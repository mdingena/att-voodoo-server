import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { db } from '../../db';
import { upsertSession, upsertHeartbeat } from '../../db/sql';

const userInfoApiUrl = 'https://accounts.townshiptale.com/connect/userinfo';

export const getSession: RequestHandler = async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';
  try {
    const response = await fetch(userInfoApiUrl, {
      method: 'GET',
      headers: { Authorization: auth }
    });

    const userInfo = await response.json();

    const accountId = userInfo.sub;
    const accessToken = auth.replace(/Bearer\s+/i, '');

    await db.query(upsertSession, [accountId, accessToken]);
    await db.query(upsertHeartbeat, [accessToken]);

    clientResponse.json({ ok: true, result: { accountId } });
  } catch (error) {
    clientResponse.status(500).json({ ok: false, error });
  }
};
