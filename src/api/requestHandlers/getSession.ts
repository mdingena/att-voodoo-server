import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { db } from '../../db';

const userInfoApiUrl = 'https://accounts.townshiptale.com/connect/userinfo';

const sql = `
INSERT INTO
  sessions ( account_id, access_token )
  VALUES ( $1, $2 )
ON CONFLICT ( account_id )
DO UPDATE SET
  access_token = $2
;`;

export const getSession: RequestHandler = async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';
  try {
    const response = await fetch(userInfoApiUrl, {
      method: 'GET',
      headers: { Authorization: auth }
    });
    console.log({ response });

    const userInfo = await response.json();

    const accountId = userInfo.sub;
    const accessToken = auth.replace(/Bearer\s+/i, '');
    console.log({ accountId, accessToken });

    const rows = await db.query(sql, [accountId, accessToken]);
    console.log({ rows });

    clientResponse.json({ ok: true, result: { accountId } });
  } catch (error) {
    clientResponse.status(500).json({ ok: false, error });
  }
};
