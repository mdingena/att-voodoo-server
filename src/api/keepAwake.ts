import fetch from 'node-fetch';
import { VoodooServer } from '../voodoo';

const keepAwakeUrl = 'https://att-voodoo-server.herokuapp.com/';
const keepAwakeInterval = 180000;

export const keepAwake = (voodoo: VoodooServer): NodeJS.Timer | undefined =>
  !!process.env.KEEP_AWAKE
    ? setInterval(() => fetch(keepAwakeUrl).catch(error => voodoo.logger.error(error.message)), keepAwakeInterval)
    : undefined;
