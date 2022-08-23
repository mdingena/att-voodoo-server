import { SpellFunction } from '../spellbook';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { HEART } from 'att-voodoo-book-of-blood';
import { Object3D, Vector3 } from 'three';

const MAX_HEALTH_REDUCTION = HEART;
const CURRENT_HEALTH_REDUCTION = 3 * HEART;
const MINIMUM_MAX_HEALTH = 4 * HEART;

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
  const { position, direction } = spawnFrom(player, 'mainHand', dexterity, 1);

  const orientation = new Object3D();
  orientation.lookAt(new Vector3(-direction.x, 0, -direction.z));

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Heart_Receptacle.hash,
      position: {
        x: position.x,
        y: position.y + 2,
        z: position.z
      },
      rotation: {
        x: orientation.quaternion.x,
        y: orientation.quaternion.y,
        z: orientation.quaternion.z,
        w: orientation.quaternion.w
      }
    }
  });

  voodoo.command({ accountId, command: 'select snap-ground' });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Conjure Heartfruit`);
};
