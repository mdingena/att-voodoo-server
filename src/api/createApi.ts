import express from 'express';
import { auth } from './middleware';
import { getSession } from './requestHandlers';
import Logger from 'js-tale/dist/logger';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.use(auth);
api.use(express.json());

export const createApi = () => {
  // @todo pass bot into request handlers to make use of the alread-established ApiConnection.
  api.get('/session', getSession);

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
