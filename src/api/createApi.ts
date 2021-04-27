import express from 'express';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { auth } from './middleware';
import { getSession, getHeartbeat } from './requestHandlers';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.use(auth);
api.use(express.json());

export const createApi = (voodoo: VoodooServer) => {
  api.get('/session', getSession(voodoo));
  api.get('/heartbeat', getHeartbeat);

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
