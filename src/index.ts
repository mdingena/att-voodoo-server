import * as Sentry from '@sentry/node';
import { discordBot } from 'att-voodoo-book-of-blood';
import { createVoodooServer, gracefulShutdown, topupPatrons } from './voodoo';
import { createBot } from './bot';
import { createApi, keepAwake } from './api';
import { regularlyPurgeSessions } from './db';

if (!!process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  });
}

if (!process.env.ALTA_CLIENT_ID || !process.env.GA_TRACKING_ID || !process.env.CONJURE_HEARTFRUIT_INCANTATION) {
  throw new Error('Missing required environment variables.');
}

(async () => {
  /* Top up Patrons in database. */
  await topupPatrons();

  /* Create Voodoo server. */
  const voodoo = createVoodooServer();

  /* Enable graceful shutdown. */
  process.on('SIGTERM', await gracefulShutdown(voodoo));

  await createBot(voodoo);
  createApi(voodoo);

  console.log('Voodoo Server is online');

  if (process.env.DISCORD_ARCANUM_VERBUM_TOKEN) {
    try {
      await discordBot.login(process.env.DISCORD_ARCANUM_VERBUM_TOKEN);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  keepAwake(voodoo);
  regularlyPurgeSessions(voodoo);
})();
