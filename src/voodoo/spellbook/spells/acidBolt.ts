import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const acidBolt: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'acidBolt' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const rightHand = spawnFrom(player, 'rightPalm', 0.3);

  if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Wyrm_Spit.hash,
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
    const leftHand = spawnFrom(player, 'leftPalm', 0.3);

    if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: Prefab.Wyrm_Spit.hash,
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
  console.log(`[${serverName ?? serverId} | ${name}] cast Acid Bolt`);
};
