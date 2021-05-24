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
      }
      // @todo This is broken, since I don't have the complete picture of the data shape yet.
      // LiquidContainer: {
      //   canAddTo: false,
      //   canRemoveFrom: true,
      //   contentLevel: binaryToNumber('1000000000000000000000000000000000000000000000000000000000000000'),
      //   hasContent: false,
      //   dataBits: '001'
      // }
    }
  });

  return await voodoo.command({
    accountId,
    command: `spawn string-raw ${spawnString}`
  });
};
