import Heroku from 'heroku-client';
import * as Sentry from '@sentry/node';
import { createVoodooServer, gracefulShutdown } from './voodoo';
import { createBot } from './bot';
import { createApi, keepAwake } from './api';
import { regularlyPurgeSessions } from './db';

const FORCE_RESTART_DELAY = 1000 * 60 * 90;

if (!!process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  });
}

if (!process.env.ALTA_CLIENT_ID || !process.env.GA_TRACKING_ID || !process.env.HEROKU_API_TOKEN) {
  throw new Error('Missing required environment variables.');
}

const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

(async () => {
  /* Create Voodoo server. */
  const voodoo = createVoodooServer();

  /* Enable graceful shutdown. */
  process.on('SIGTERM', gracefulShutdown(voodoo));

  await createBot(voodoo);
  createApi(voodoo);

  voodoo.logger.success('Voodoo Server is online');

  keepAwake(voodoo);
  regularlyPurgeSessions(voodoo);

  setTimeout(() => {
    voodoo.logger.warn('Restarting Heroku dyno');
    heroku.delete('/apps/att-voodoo-server/dynos');
  }, FORCE_RESTART_DELAY);
})();
