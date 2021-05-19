import { VoodooServer } from '../../index';
import { createString, crystalWyrmSpit } from '../strings';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';

export const castFrostBolt = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const { Result: player } = await voodoo.command({
    accountId,
    command: `player detailed ${accountId}`
  });

  const { position, rotation, direction } = spawnFrom(player, 'rightPalm', 0.05);
  const velocity = spawnVelocity(direction, 15);

  const spawnString = createString({
    prefabObject: {
      hash: crystalWyrmSpit,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation,
        velocity
      }
    }
  });

  return await voodoo.command({
    accountId,
    command: `spawn string-raw ${spawnString}`
  });
};
