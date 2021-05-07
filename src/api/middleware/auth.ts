import { RequestHandler } from 'express';

export const auth: RequestHandler = (request, response, next) => {
  if (request.path !== '/' && !request.headers.authorization) {
    return response.status(403).json({ error: 'Missing authorization.' });
  }

  next();
};
