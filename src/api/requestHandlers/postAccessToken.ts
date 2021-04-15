import { RequestHandler } from 'express';

export const postAccessToken: RequestHandler = (request, response) => {
  response.json({ token: request.headers.authorization });
};
