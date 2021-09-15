import * as Sentry from '@sentry/node';
import ua from 'universal-analytics';
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

const analytics = ua(process.env.GA_TRACKING_ID, { uid: process.env.ALTA_CLIENT_ID });

(async () => {
  /* Create Voodoo server. */
  const voodoo = createVoodooServer(analytics);

  /* Enable graceful shutdown. */
  process.on('SIGTERM', gracefulShutdown(voodoo));

  await createBot(voodoo);
  createApi(voodoo);

  voodoo.logger.success('Voodoo Server is online');

  keepAwake(voodoo);
  regularlyPurgeSessions(voodoo);
})();
