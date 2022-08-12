import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const frostBolt: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'frostBolt' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const rightHand = spawnFrom(player, 'mainHand', dexterity, 0.5);

  if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Wyrm_Crystal_Spit.hash,
      position: rightHand.position,
      rotation: rightHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        rotation: rightHand.rotation,
        velocity: spawnVelocity(rightHand.direction, attributes.velocity)
      }
    }
  });

  if (attributes.ambidextrous === 2) {
    const leftHand = spawnFrom(player, 'offHand', dexterity, 0.5);

    if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: Prefab.Wyrm_Crystal_Spit.hash,
        position: leftHand.position,
        rotation: leftHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: leftHand.position,
          rotation: leftHand.rotation,
          velocity: spawnVelocity(leftHand.direction, attributes.velocity)
        }
      }
    });
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Frost Bolt`);
};
