import { bot } from './bot';
import { createApi } from './api';

(async () => {
  await bot.init();

  createApi();
})();
