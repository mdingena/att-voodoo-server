import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';

export const transmuteIronIngotToOre: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'craftFlask' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  const leftHand = spawnFrom(player, 'leftPalm', 0.05);
  const rightHand = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Iron_Ore,
      position: leftHand.position,
      rotation: leftHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: leftHand.position,
        rotation: leftHand.rotation
      }
    }
  });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Iron_Ore,
      position: rightHand.position,
      rotation: rightHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        rotation: rightHand.rotation
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Transmute Ingot To Ore (Iron)`);
};
