import express from 'express';

const port = process.env.PORT || 3000;
const webServer = express();

webServer.use(express.json());

export const createApi = () => {
  webServer.get('/', (request, response) => {
    response.send('Hello World!');
  });

  webServer.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
  });

  return webServer;
};
