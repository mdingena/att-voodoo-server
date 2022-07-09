import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { repairMaterial } from '../utils';
import { PhysicalMaterialPartHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const repairSilverDevice: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const hiltedApparatus = voodoo.players[accountId].incantations[0].decodedString.prefab;

  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'repairSilverDevice' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const { position, rotation } = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  const repairAmount = attributes.reconstructor / 100;
  const repairedApparatus = repairMaterial(hiltedApparatus, PhysicalMaterialPartHash.Silver, repairAmount);

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
  console.log(`[${serverName ?? serverId} | ${name}] cast Repair Silver Device`);
};
