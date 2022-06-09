import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const stoneskin: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'stoneskin' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position } = spawnFrom(player, 'eyes');

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Iron_Boulder_Parts.hash,
      position: position
    }
  });

  const bonus = attributes.intensify / 100;
  const duration = attributes.concentration;
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerIds = [accountId, ...nearbySoulbondIds];

  for (const playerId of playerIds) {
    const playerDamageProtection = await voodoo.getPlayerCheckStat({ accountId: playerId, stat: 'damageprotection' });

    const baseDamageProtection = playerDamageProtection.base ?? 0;
    const currentDamageProtection = playerDamageProtection.current ?? 0;

    const buffedDamageProtection = baseDamageProtection * (1 + bonus);
    const damageprotectionDelta = buffedDamageProtection - currentDamageProtection;

    if (damageprotectionDelta > 0) {
      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} damageprotection ${damageprotectionDelta} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Stoneskin`);
};
