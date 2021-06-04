import { VoodooServer } from '..';
import { createString, SpawnPrefab } from './strings';

export const spawn = (voodoo: VoodooServer, accountId: number, prefab: SpawnPrefab) => {
  const spawnString = createString(prefab);

  return voodoo.command({ accountId, command: `spawn string-raw ${spawnString}` });
};
