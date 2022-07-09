import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const liquateRedIron: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'liquateRedIron' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const offHand = spawnFrom(player, 'offHand', [dexterity[0], 'palm'], 0.05);
  const mainHand = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Copper_Ingot.hash,
      position: offHand.position,
      rotation: offHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: offHand.position,
        rotation: offHand.rotation
      }
    }
  });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Iron_Ingot.hash,
      position: mainHand.position,
      rotation: mainHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: mainHand.position,
        rotation: mainHand.rotation
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Liquate Alloy (Red Iron)`);
};
