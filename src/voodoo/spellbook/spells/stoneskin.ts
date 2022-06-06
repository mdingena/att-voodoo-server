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
  const rightHand = spawnFrom(player, 'rightPalm', 0.05);
  const eyes = spawnFrom(player, 'eyes');

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Potion_Medium.hash,
      position: rightHand.position,
      rotation: rightHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        rotation: rightHand.rotation
      },
      LiquidContainer: {}
    }
  });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Iron_Boulder_Parts.hash,
      position: eyes.position
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
      const damageprotectionBuff = baseDamageProtection * bonus;

      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} damageprotection ${damageprotectionBuff} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Stoneskin`);
};
