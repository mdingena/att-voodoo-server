import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { getNearbySoulbonds } from '../getNearbySoulbonds';
import { spawnFrom } from '../spawnFrom';
import { PrefabHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const stoneskin: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'stoneskin' });
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
    command: `player modify-stat ${playerList} damageprotection ${value} ${duration} true`
  });

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position } = spawnFrom(player, 'eyes');

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Iron_Boulder_Parts,
      position
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Stoneskin`);
};
