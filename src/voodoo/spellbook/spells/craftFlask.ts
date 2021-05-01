import { spawnFrom, potionEmpty } from '../strings';
import { VoodooServer } from '../../index';

export const craftFlask = async (voodoo: VoodooServer, accountId: number) => {
  const { Result: player } = await voodoo.command({
    accountId,
    command: `player detailed ${accountId}`
  });

  const origin = spawnFrom(player, 'rightPalm', 0.05);

  const transform = {
    ...origin,
    s: 1
  };

  return await voodoo.command({
    accountId,
    command: `spawn string-raw ${potionEmpty(transform)}`
  });
};
