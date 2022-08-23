import { VoodooServer } from '..';
import { createString, PrefabData } from 'att-string-transcoder';

type PartialVoodooServer = Pick<VoodooServer, 'command'>;

export const spawn = <T>(voodoo: PartialVoodooServer, accountId: number, prefab: PrefabData) => {
  const spawnString = createString(prefab);

  return voodoo.command<T>({ accountId, command: `spawn string-raw ${spawnString}` });
};
