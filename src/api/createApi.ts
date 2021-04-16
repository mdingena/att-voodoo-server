import express from 'express';
import { auth } from './middleware';
import { postAccessToken } from './requestHandlers';
import Logger from 'js-tale/dist/logger';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const api = express();
api.use(auth);
api.use(express.json());

export const createApi = () => {
  api.post('/token', postAccessToken);

  api.listen(port, () => {
    logger.success(`API listening on port ${port}`);
  });

  return api;
};
