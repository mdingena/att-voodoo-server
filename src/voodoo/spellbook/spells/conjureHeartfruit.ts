import { SpellFunction } from '../spellbook';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

const ONE_HEART = 0.25;
const MAX_HEALTH_REDUCTION = ONE_HEART;
const CURRENT_HEALTH_REDUCTION = 3 * ONE_HEART;
const MINIMUM_MAX_HEALTH = 4 * ONE_HEART;

export const conjureHeartfruit: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const [health, maxHealth] = await Promise.all([
    voodoo.getPlayerCheckStat({ accountId, stat: 'health' }),
    voodoo.getPlayerCheckStat({ accountId, stat: 'maxhealth' })
  ]);

  const adjustedMaxHealth = (maxHealth.base ?? 0) - MAX_HEALTH_REDUCTION;

  if (
    adjustedMaxHealth < MINIMUM_MAX_HEALTH ||
    typeof health.current === 'undefined' ||
    health.current < CURRENT_HEALTH_REDUCTION
  ) {
    voodoo.command({
      accountId,
      command: `player message ${accountId} "Your blood offering is insufficient" 3`
    });
    return;
  }

  const adjustedHealth = health.current - CURRENT_HEALTH_REDUCTION;

  voodoo.command({ accountId, command: `player set-stat ${accountId} maxhealth ${adjustedMaxHealth}` });
  voodoo.command({ accountId, command: `player set-stat ${accountId} health ${adjustedHealth}` });

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const { position } = spawnFrom(player, 'mainHand', dexterity, 1);
  const adjustedPosition = { ...position, y: position.y + 2 };

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Heart_Receptacle.hash,
      position: adjustedPosition
    }
  });

  voodoo.command({ accountId, command: 'select snap-ground' });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Conjure Heartfruit`);
};
