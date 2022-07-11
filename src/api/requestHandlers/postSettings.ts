import { RequestHandler } from 'express';
import { db } from '../../db';
import { Dexterity, VoodooServer } from '../../voodoo';
import { selectSession, upsertUserSetting } from '../../db/sql';

export const postSettings =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      /* Apply the settings. */
      const { settings } = clientRequest.body;
      const results = await Promise.all(
        Object.entries(settings).map(([key, value]) => {
          switch (key) {
            case 'dexterity':
              voodoo.setDexterity({ accountId, dexterity: value as Dexterity });
          }

          return db.query(upsertUserSetting(key), [accountId, value]);
        })
      );

      clientResponse.json({ ok: true, result: results });
    } catch (error: unknown) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: (error as Error).message });
    }
  };
