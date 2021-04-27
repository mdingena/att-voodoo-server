import { createVoodooServer } from './voodoo';
import { createBot } from './bot';
import { createApi } from './api';

(async () => {
  const voodoo = createVoodooServer();
  await createBot(voodoo);
  createApi(voodoo);
})();
