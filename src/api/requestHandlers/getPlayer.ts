import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, PreparedSpells } from '../../voodoo';
import { selectSession, selectPreparedSpells } from '../../db/sql';

export const getPlayer =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      /* Get player details. */
      const accountId = session.rows[0].account_id;
      const { serverId } = voodoo.players[accountId];

      let preparedSpells: PreparedSpells = [];

      if (accountId && serverId) {
        const storedSpells = await db.query(selectPreparedSpells, [accountId, serverId]);
        preparedSpells = JSON.parse(storedSpells.rows[0]?.prepared_spells ?? '[]');
      }

      clientResponse.json({ ok: true, result: { preparedSpells } });
    } catch (error) {
      voodoo.logger.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
