import { createBot } from './bot';
import { createApi } from './api';

(async () => {
  const bot = await createBot();
  const api = createApi();
})();
