import { RequestHandler } from 'express';

export const getInfo: RequestHandler = async (clientRequest, clientResponse) => {
  clientResponse.json({ ok: true });
};
