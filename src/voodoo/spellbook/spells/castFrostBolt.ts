import { VoodooServer } from '../..';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';

export const castFrostBolt = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position, rotation, direction } = spawnFrom(player, 'rightPalm', 0.3);
  const velocity = spawnVelocity(direction, 15);

  return spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Crystal_Spit,
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
};
