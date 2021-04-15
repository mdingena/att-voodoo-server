import express from 'express';

const port = process.env.PORT || 3000;
const webServer = express();

webServer.use(express.json());

webServer.get('/', (request, response) => {
  response.send('Hello World!');
});

webServer.listen(port, () => {
  console.log(`Example webServer listening at http://localhost:${port}`);
});

export const api = () => webServer;
