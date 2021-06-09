import express from 'express';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { auth } from './middleware';
import {
  getInfo,
  getSession,
  getHeartbeat,
  postIncantation,
  deleteIncantations,
  getSeal,
  postTrigger
} from './requestHandlers';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.use(auth);
api.use(express.json());

export const createApi = async (voodoo: VoodooServer) => {
  api.get('/', getInfo);
  api.get('/heartbeat', getHeartbeat(voodoo));
  api.get('/session', getSession(voodoo));
  api.post('/incantation', postIncantation(voodoo));
  api.delete('/incantation', deleteIncantations(voodoo));
  api.get('/seal', getSeal(voodoo));
  api.post('/trigger', postTrigger(voodoo));

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
