import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, PreparedSpells } from '../../voodoo';
import { selectSession, selectPreparedSpells, upsertPreparedSpells } from '../../db/sql';

export const postTrigger =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) {
        return clientResponse.status(404).json({
          ok: false,
          error: 'Session not found'
        });
      }

      /* Get the player's prepared spells. */
      const accountId = session.rows[0].account_id;
      const storedSpells = await db.query(selectPreparedSpells, [accountId]);

      if (!storedSpells.rows.length) {
        return clientResponse.status(404).json({
          ok: false,
          error: 'You have no prepared spells'
        });
      }

      const preparedSpells: PreparedSpells = JSON.parse(storedSpells.rows[0].prepared_spells);

      /* Get verbal spell trigger. */
      const [verbalTrigger] = clientRequest.body;

      /* Find the spell matching the verbal spell trigger. */
      const spellIndex = preparedSpells.findIndex(preparedSpell => preparedSpell.verbalTrigger === verbalTrigger) ?? {};

      if (spellIndex === -1) {
        return clientResponse.status(404).json({
          ok: false,
          error: 'You have no prepared spells matching your verbal trigger'
        });
      }

      /* Get the prepared spell's incantations. */
      const { incantations } = preparedSpells[spellIndex];

      /* Search for spell in spellbook matching prepared incantations. */
      const spell = voodoo.spellbook.get(incantations);

      if (!spell)
        return clientResponse.status(500).json({
          ok: false,
          error: 'Something went wrong locating the spell for the given incantations',
          incantations
        });

      // @todo abstract casting prepared spell into VoodooServer
      /* Cast the prepared spell. */
      spell.cast(voodoo, accountId);

      /* Remove prepared spell. */
      preparedSpells.splice(spellIndex, 1);

      /* Store new prepared spells list. */
      const newPreparedSpells = JSON.stringify(preparedSpells);
      await db.query(upsertPreparedSpells, [accountId, newPreparedSpells]);

      clientResponse.json({ ok: true, result: preparedSpells });
    } catch (error) {
      voodoo.logger.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
