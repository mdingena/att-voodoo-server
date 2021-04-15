import express from 'express';
import { auth } from './middleware';
import { postAccessToken } from './requestHandlers';
import Logger from 'js-tale/dist/logger';

const port = process.env.PORT || 3000;
const logger = new Logger('Express');

const webServer = express();
webServer.use(auth);
webServer.use(express.json());

export const createApi = () => {
  webServer.post('/token', postAccessToken);

  webServer.listen(port, () => {
    logger.log(`Webserver listening on port ${port}`);
  });

  return webServer;
};
