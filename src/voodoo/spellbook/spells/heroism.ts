import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

type PlayerCheckStatHealthResponse = {
  Result?: {
    Value: number;
  };
};

export const heroism: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'heroism' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const value = 1 + attributes.intensify / 100;
  const duration = attributes.concentration;
  const searchRadius = attributes.projection;

  let nearbySoulbondIds: number[] = [];

  if (searchRadius > 0) {
    const nearbySoulbonds = await getNearbySoulbonds(voodoo, accountId, searchRadius);
    nearbySoulbondIds = nearbySoulbonds.map(soulbond => soulbond.id);
  }

  const playerIds = [accountId, ...nearbySoulbondIds];

  /* Increase health by same amount as raised max health. */
  for (const playerId of playerIds) {
    const healthResponse: PlayerCheckStatHealthResponse = await voodoo.command({
      accountId,
      command: `player check-stat ${playerId} health`
    });

    if (healthResponse.Result) {
      const buffedHealth = healthResponse.Result.Value * value;

      voodoo.command({ accountId, command: `player modify-stat ${playerId} health ${buffedHealth} ${duration}` });
    }
  }

  const playerList = playerIds.join(',');

  /* Raise max health. */
  voodoo.command({
    accountId,
    command: `player modify-stat ${playerList} maxhealth ${value} ${duration} true`
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Heroism`);
};
