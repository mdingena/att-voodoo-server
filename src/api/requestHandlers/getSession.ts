import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { TrackAction, TrackCategory, VoodooServer } from '../../voodoo';
import { db } from '../../db';
import { upsertSession, upsertHeartbeat } from '../../db/sql';

const userInfoApiUrl = 'https://accounts.townshiptale.com/connect/userinfo';

export const getSession =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      const response = await fetch(userInfoApiUrl, {
        method: 'GET',
        headers: { Authorization: auth }
      });

      const userInfo = await response.json();

      const accountId = Number(userInfo.sub);
      const accessToken = auth.replace(/Bearer\s+/i, '');

      await db.query(upsertSession, [accountId, accessToken]);
      await db.query(upsertHeartbeat, [accessToken]);

      const serverId = voodoo.players[accountId]?.serverId;

      const session = {
        accountId,
        playerJoined: serverId ?? null,
        servers: [...voodoo.servers]
      };

      voodoo.track({
        accountId,
        serverId,
        category: TrackCategory.Sessions,
        action: TrackAction.SessionCreated
      });

      clientResponse.json({ ok: true, result: session });
    } catch (error: unknown) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: (error as Error).message });
    }
  };
