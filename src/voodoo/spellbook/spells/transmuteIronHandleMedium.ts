import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { PrefabHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const transmuteIronHandleMedium: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'transmuteIronHandleMedium' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Handle_Medium_Cool,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Transmute Iron Handle (medium)`);
};