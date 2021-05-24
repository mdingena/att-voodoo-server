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

  const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction'
  });

  setTimeout(() => {
    try {
      // @ts-ignore
      foo();
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);
}

(async () => {
  const voodoo = createVoodooServer();
  await createBot(voodoo);
  createApi(voodoo);

  keepAwake(voodoo);
})();
