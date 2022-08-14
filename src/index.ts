import * as Sentry from '@sentry/node';
import { createVoodooServer, gracefulShutdown } from './voodoo';
import { createBot } from './bot';
import { createApi, keepAwake } from './api';
import { regularlyPurgeSessions } from './db';

if (!!process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  });
}

if (!process.env.ALTA_CLIENT_ID || !process.env.GA_TRACKING_ID) {
  throw new Error('Missing required environment variables.');
}

(async () => {
  /* Create Voodoo server. */
  const voodoo = createVoodooServer();

  /* Enable graceful shutdown. */
  process.on('SIGTERM', await gracefulShutdown(voodoo));

  await createBot(voodoo);
  createApi(voodoo);

  console.log('Voodoo Server is online');

  keepAwake(voodoo);
  regularlyPurgeSessions(voodoo);
})();
