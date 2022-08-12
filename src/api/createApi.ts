import express from 'express';
import nocache from 'nocache';
import { VoodooServer } from '../voodoo';
import { auth } from './middleware';
import {
  getInfo,
  getHeartbeat,
  getSession,
  getBloodIncantation,
  postBloodIncantation,
  postIncantation,
  deleteBloodIncantations,
  deleteIncantations,
  getSeal,
  postTrigger,
  getPlayer,
  getSpellbook,
  postUpgrade,
  deleteUpgrades,
  postSettings
} from './requestHandlers';

const port = process.env.PORT || 3000;

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
  api.get('/blood-incantation', getBloodIncantation(voodoo));
  api.post('/blood-incantation', postBloodIncantation(voodoo));
  api.delete('/blood-incantation', deleteBloodIncantations(voodoo));
  api.get('/seal', getSeal(voodoo));
  api.post('/trigger', postTrigger(voodoo));
  api.get('/player', getPlayer(voodoo));
  api.get('/spellbook', getSpellbook());
  api.post('/upgrade', postUpgrade(voodoo));
  api.delete('/upgrade', deleteUpgrades(voodoo));
  api.post('/settings', postSettings(voodoo));

  api.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });

  return api;
};
