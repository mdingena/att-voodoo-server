import { VoodooServer } from '../..';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';

export const transmuteCopperIngotToOre = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position: positionLeft, rotation: rotationLeft } = spawnFrom(player, 'leftPalm', 0.05);
  const { position: positionRight, rotation: rotationRight } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Copper_Ore,
      position: positionLeft,
      rotation: rotationLeft
    },
    components: {
      NetworkRigidbody: {
        position: positionLeft,
        rotation: rotationLeft
      }
    }
  });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Copper_Ore,
      position: positionRight,
      rotation: rotationRight
    },
    components: {
      NetworkRigidbody: {
        position: positionRight,
        rotation: rotationRight
      }
    }
  });

  return;
};
