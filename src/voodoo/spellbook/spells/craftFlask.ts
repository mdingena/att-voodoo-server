import { spawnFrom, potionEmpty } from '../strings';
import { VoodooServer } from '../../index';

export const craftFlask = async (voodoo: VoodooServer, accountId: number) => {
  const { Result: player } = await voodoo.command({ accountId, command: `player detailed ${accountId}` });
  console.log({ player });
  const [px, py, pz] = spawnFrom(player, 'rightPalm', 0.3);

  // some quaternion stuff here?

  const transform = { px, py, pz, qx: 0, qy: 0, qz: 0, qw: 1, s: 1 };

  const results = await voodoo.command({ accountId, command: `spawn string-raw ${potionEmpty(transform)}` });

  console.log({ results });
};
