import { VoodooServer } from '..';
import { createString, PrefabData } from 'att-string-transcoder';

export const spawn = (voodoo: VoodooServer, accountId: number, prefab: PrefabData) => {
  const spawnString = createString(prefab);

  return voodoo.command({ accountId, command: `spawn string-raw ${spawnString}` });
};
