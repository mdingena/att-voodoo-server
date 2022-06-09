import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const aptitude: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'aptitude' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const value = 1 + attributes.intensify / 100;
  const duration = attributes.concentration;
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerList = [accountId, ...nearbySoulbondIds].join(',');

  voodoo.command({
    accountId,
    command: `player modify-stat ${playerList} xpboost ${value} ${duration} true`
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Aptitude`);
};
