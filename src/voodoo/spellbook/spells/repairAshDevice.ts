import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { repairMaterial } from '../utils';
import { PhysicalMaterialPartHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const repairAshDevice: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const hiltedApparatus = voodoo.players[accountId].incantations[0].decodedString.prefab;

  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'repairAshDevice' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  const repairAmount = attributes.reconstructor / 100;
  const repairedApparatus = repairMaterial(hiltedApparatus, PhysicalMaterialPartHash.Ash, repairAmount);

  spawn(voodoo, accountId, {
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

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Repair Ash Device`);
};
