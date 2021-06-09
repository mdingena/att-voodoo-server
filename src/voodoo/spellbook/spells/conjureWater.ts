import { VoodooServer } from '../..';
import { PrefabHash, PresetHash } from '../strings';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';

export const conjureWater = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  return spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Potion_Medium,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      },
      LiquidContainer: {
        contentLevel: 1,
        presetHash: PresetHash.Water
      }
    }
  });
};
