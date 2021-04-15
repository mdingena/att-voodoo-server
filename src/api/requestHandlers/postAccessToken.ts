import { Request, Response } from 'express';

export const postAccessToken = (request: Request, response: Response) => {
  response.json({ thing: 'Hello World!' });
};
