import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, PreparedSpells } from '../../voodoo';
import { selectSession, selectPreparedSpells, upsertPreparedSpells } from '../../db/sql';

export const postUpgrade =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      /* Verify player is near a Spellcrafting Conduit. */
      const { Result: nearbyPrefabs } = await voodoo.command({
        accountId,
        command: `select find ${accountId} ${voodoo.config.CONDUIT_DISTANCE}`
      });

      if ((nearbyPrefabs ?? []).length === 0) {
        voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

        return clientResponse.status(406).json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit',
          nearbyPrefabs
        });
      }

      const nearConduit = nearbyPrefabs.find(({ Name }: { Name: string }) => voodoo.config.CONDUIT_PREFABS.test(Name));

      if (!nearConduit) {
        voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

        return clientResponse.status(406).json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit'
        });
      }

      /* Apply the upgrade. */
      const { school, spell, upgrade } = clientRequest.body;
      const experience = await voodoo.addUpgrade({ accountId, school, spell, upgrade });

      clientResponse.json({ ok: true, result: experience });
    } catch (error: unknown) {
      voodoo.logger.error(error);
      clientResponse.status(500).json({ ok: false, error: (error as Error).message });
    }
  };
