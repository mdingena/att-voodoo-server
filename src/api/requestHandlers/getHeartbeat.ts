import { RequestHandler } from 'express';
import { db } from '../../db';
import { upsertHeartbeat } from '../../db/sql';

export const getHeartbeat: RequestHandler = async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';
  try {
    const accessToken = auth.replace(/Bearer\s+/i, '');

    await db.query(upsertHeartbeat, [accessToken]);

    clientResponse.json({ ok: true });
  } catch (error) {
    console.log({ error });
    clientResponse.status(500).json({ ok: false, error });
  }
};
