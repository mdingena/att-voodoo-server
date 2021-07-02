import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { PrefabHash } from '../strings';
import { spawn } from '../spawn';

export const acidBolt: SpellFunction = async (voodoo, accountId, upgrades) => {
  const spellUpgrades = voodoo.getSpellUpgrades({ accountId, spell: 'Acid Bolt' });
  const attributes = getSpellAttributes(spellUpgrades, upgrades);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const rightHand = spawnFrom(player, 'rightPalm', 0.3);

  if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Spit,
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

  if (attributes.ambidextrous) {
    const leftHand = spawnFrom(player, 'leftPalm', 0.3);

    if (attributes.burst > 1) voodoo.command({ accountId, command: `repeat ${attributes.burst} 0.2` });

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: PrefabHash.Spit,
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
};
