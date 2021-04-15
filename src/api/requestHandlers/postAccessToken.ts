import { RequestHandler } from 'express';

export const postAccessToken: RequestHandler = (request, response) => {
  response.json({ thing: 'Hello World!' });
};
