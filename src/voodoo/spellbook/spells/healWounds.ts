import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const healWounds: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'healWounds' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const heal = attributes.intensify / 4; // 0.25 equals one "heart"
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerIds = [accountId, ...nearbySoulbondIds];

  for (const playerId of playerIds) {
    const currentHealth = await voodoo.getPlayerCheckStatCurrent({ accountId: playerId, stat: 'health' });

    if (currentHealth) {
      const healedHealth = currentHealth + heal;

      voodoo.command({
        accountId,
        command: `player set-stat ${playerId} health ${healedHealth}`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Heal Wounds`);
};
