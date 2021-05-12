import { VoodooServer } from '../../index';
import { frostBolt } from '../strings';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';

export const castFrostBolt = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const { Result: player } = await voodoo.command({
    accountId,
    command: `player detailed ${accountId}`
  });

  const origin = spawnFrom(player, 'rightPalm', 0.4);

  const transform = {
    ...origin,
    ...spawnVelocity(origin.dx, origin.dy, origin.dz, 15),
    s: 1
  };

  return await voodoo.command({
    accountId,
    command: `spawn string-raw ${frostBolt({ transform })}`
  });
};
