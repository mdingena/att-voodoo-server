import express from 'express';
import Logger from 'js-tale/dist/logger';

const logger = new Logger('Express');

const port = process.env.PORT || 3000;
const webServer = express();

webServer.use(express.json());

export const createApi = () => {
  webServer.get('/', (request, response) => {
    response.send('Hello World!');
  });

  webServer.listen(port, () => {
    logger.log(`Webserver listening on port ${port}`);
  });

  return webServer;
};
