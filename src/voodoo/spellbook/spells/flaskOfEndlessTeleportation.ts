import { VoodooServer } from '../..';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';
import { LiquidContainer } from '../strings/components/transcoders';

export const flaskOfEndlessTeleportation = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const flask = voodoo.players[accountId].incantations[0].decodedString;
  const liquidContainer = flask.prefab.components?.LiquidContainer as LiquidContainer.Component;

  if (!liquidContainer) return;

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
        ...liquidContainer,
        contentLevel: (liquidContainer.contentLevel ?? 1) + 1
      }
    }
  });
};
