import express from 'express';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { auth } from './middleware';
import { getSession, getHeartbeat, postIncantation, postTrigger } from './requestHandlers';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.use(auth);
api.use(express.json());

export const createApi = async (voodoo: VoodooServer) => {
  api.get('/heartbeat', getHeartbeat);
  api.get('/session', getSession(voodoo));
  api.post('/incantation', postIncantation(voodoo));
  api.post('/trigger', postTrigger(voodoo));

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
