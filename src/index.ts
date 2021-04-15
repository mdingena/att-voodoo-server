import { AltaManager } from './AltaManager';
import { createApi } from './api';

const altaManager = new AltaManager();
altaManager.init();

createApi();
