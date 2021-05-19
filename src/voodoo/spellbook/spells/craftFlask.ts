import { VoodooServer } from '../../index';
import { createString, potionMedium } from '../strings';
import { spawnFrom } from '../spawnFrom';

export const craftFlask = async (voodoo: VoodooServer, accountId: number) => {
  const { Result: player } = await voodoo.command({
    accountId,
    command: `player detailed ${accountId}`
  });

  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  const spawnString = createString({
    prefabObject: {
      hash: potionMedium,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      },
      LiquidContainer: {
        dataBits: '011000000000000000000000000000000000000000000000000000000000000000001'
      }
    }
  });

  return await voodoo.command({
    accountId,
    command: `spawn string-raw ${spawnString}`
  });
};
