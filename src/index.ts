import { createBot } from './bot';
import { createApi } from './api';

(async () => {
  await createBot();

  createApi();
})();
