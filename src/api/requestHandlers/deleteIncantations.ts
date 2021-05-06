import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer } from '../../voodoo';
import { selectSession } from '../../db/sql';

export const deleteIncantations = (voodoo: VoodooServer): RequestHandler => async (clientRequest, clientResponse) => {
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

    /* Clear player's incantations. */
    const accountId = session.rows[0].account_id;
    const incantations = voodoo.clearIncantations({ accountId });

    if (incantations.length) {
      return clientResponse.status(500).json({
        ok: false,
        error: "Couldn't clear your incantations"
      });
    }

    clientResponse.json({ ok: true, result: incantations });
  } catch (error) {
    voodoo.logger.error(error);
    clientResponse.status(500).json({ ok: false, error: error.message });
  }
};
