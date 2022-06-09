import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { getNearbySoulbonds } from '../getNearbySoulbonds';

export const trueStrike: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'trueStrike' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Potion_Medium.hash,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      },
      LiquidContainer: {}
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
    const playerDamage = await voodoo.getPlayerCheckStat({ accountId: playerId, stat: 'damage' });

    const baseDamage = playerDamage.base ?? 1;
    const currentDamage = playerDamage.current ?? 1;

    const buffedDamage = baseDamage * (1 + bonus);
    const damageDelta = buffedDamage - currentDamage;

    if (damageDelta > 0) {
      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} damage ${damageDelta} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast True Strike`);
};
