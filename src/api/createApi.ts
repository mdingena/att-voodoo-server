import express from 'express';
import nocache from 'nocache';
import Logger from 'js-tale/dist/logger';
import { VoodooServer } from '../voodoo';
import { auth } from './middleware';
import {
  getInfo,
  getHeartbeat,
  getSession,
  postIncantation,
  deleteIncantations,
  getSeal,
  postTrigger,
  getPlayer
} from './requestHandlers';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.set('etag', false);
api.use(nocache());
api.use(auth);
api.use(express.json());

export const createApi = (voodoo: VoodooServer) => {
  api.get('/', getInfo);
  api.get('/heartbeat', getHeartbeat(voodoo));
  api.get('/session', getSession(voodoo));
  api.post('/incantation', postIncantation(voodoo));
  api.delete('/incantation', deleteIncantations(voodoo));
  api.get('/seal', getSeal(voodoo));
  api.post('/trigger', postTrigger(voodoo));
  api.get('/player', getPlayer(voodoo));

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
