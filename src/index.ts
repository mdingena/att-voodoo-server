import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { createVoodooServer } from './voodoo';
import { createBot } from './bot';
import { createApi, keepAwake } from './api';

if (!!process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
  });
}

(async () => {
  const voodoo = createVoodooServer();
  await createBot(voodoo);
  createApi(voodoo);

  keepAwake(voodoo);
})();
