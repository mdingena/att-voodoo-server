import { VoodooServer } from '../..';
import { spawn } from '../spawn';
import { spawnFrom } from '../spawnFrom';
import { repairMaterial } from '../strings/utils';
import { MaterialHash } from '../strings/MaterialHash';

export const repairGoldWeapon = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  const hiltedApparatus = voodoo.players[accountId].incantations[0].decodedString.prefab;

  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  const repairedApparatus = repairMaterial(hiltedApparatus, MaterialHash.Gold, 0.25);

  return spawn(voodoo, accountId, {
    ...repairedApparatus,
    prefabObject: {
      ...repairedApparatus.prefabObject,
      position,
      rotation
    },
    components: {
      ...repairedApparatus.components,
      NetworkRigidbody: {
        position,
        rotation
      }
    }
  });
};
