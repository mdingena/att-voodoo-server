import { altaManager } from './altaManager';
import { createApi } from './api';

(async () => {
  await altaManager.init();

  createApi();
})();
