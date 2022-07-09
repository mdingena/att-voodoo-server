import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const acidBolt: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'acidBolt' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const mainHand = spawnFrom(player, 'mainHand', dexterity, 0.3);

  if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Wyrm_Spit.hash,
      position: mainHand.position,
      rotation: mainHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: mainHand.position,
        rotation: mainHand.rotation,
        velocity: spawnVelocity(mainHand.direction, attributes.velocity)
      }
    }
  });

  if (attributes.ambidextrous === 2) {
    const offHand = spawnFrom(player, 'offHand', dexterity, 0.3);

    if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: Prefab.Wyrm_Spit.hash,
        position: offHand.position,
        rotation: offHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: offHand.position,
          rotation: offHand.rotation,
          velocity: spawnVelocity(offHand.direction, attributes.velocity)
        }
      }
    });
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Acid Bolt`);
};
