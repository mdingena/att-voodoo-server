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
    const playerDamageProtection = voodoo.getPlayerCheckStat({ accountId: playerId, stat: 'speed' });

    const buffedDamageProtection = playerDamageProtection.Base * (1 + bonus);
    
    const damageprotectionDelta = buffedDamageProtection - playerDamageProtection.Value;
    
    
    if (damageprotectionDelta > 0) {
      const damageprotectionBuff = playerDamageProtection.Base * bonus;

      voodoo.command({
        accountId,
        command: `player modify-stat ${playerId} damageprotection ${damageprotectionBuff} ${duration} false`
      });
    }
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Stoneskin`);
};
