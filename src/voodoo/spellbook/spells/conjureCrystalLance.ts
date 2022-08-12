import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const conjureCrystalLance: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'conjureCrystalLance' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const mainHand = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Crystal_Lance_Blue.hash,
      position: mainHand.position,
      rotation: mainHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: mainHand.position,
        rotation: mainHand.rotation
      }
    }
  });

  if (attributes.ambidextrous === 2) {
    const offHand = spawnFrom(player, 'offHand', [dexterity[0], 'palm'], 0.05);

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: Prefab.Crystal_Lance_Blue.hash,
        position: offHand.position,
        rotation: offHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: offHand.position,
          rotation: offHand.rotation
        }
      }
    });
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Conjure Crystal Lance`);
};
