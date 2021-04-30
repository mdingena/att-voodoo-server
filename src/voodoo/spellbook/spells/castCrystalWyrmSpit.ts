import { spawnFrom, spawnVelocity, crystalCrystalWyrmSpit } from '../strings';
import { VoodooServer } from '../../index';

export const castCrystalWyrmSpit = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
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
    command: `spawn string-raw ${crystalCrystalWyrmSpit(transform)}`
  });
};
