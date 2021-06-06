import { VoodooServer } from '..';
import { createString, Prefab } from './strings';

export const spawn = (voodoo: VoodooServer, accountId: number, prefab: Prefab) => {
  const spawnString = createString(prefab);

  return voodoo.command({ accountId, command: `spawn string-raw ${spawnString}` });
};
