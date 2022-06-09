import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const haste: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'haste' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

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
    const playerSpeed = await voodoo.getPlayerCheckStat({ accountId: playerId, stat: 'speed' });

    const baseSpeed = playerSpeed.base ?? 1;
    const currentSpeed = playerSpeed.current ?? 1;

    const buffedSpeed = baseSpeed * (1 + bonus);
    const speedDelta = buffedSpeed - currentSpeed;

    if (speedDelta > 0) {
      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} speed ${speedDelta} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Haste`);
};
