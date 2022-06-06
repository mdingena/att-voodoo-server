import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const conjureCrystalLance: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'conjureCrystalLance' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const rightHand = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Crystal_Lance_Blue.hash,
      position: rightHand.position,
      rotation: rightHand.rotation
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        rotation: rightHand.rotation
      }
    }
  });

  if (attributes.ambidextrous === 2) {
    const leftHand = spawnFrom(player, 'leftPalm', 0.05);

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: Prefab.Crystal_Lance_Blue.hash,
        position: leftHand.position,
        rotation: leftHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: leftHand.position,
          rotation: leftHand.rotation
        }
      }
    });
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Conjure Crystal Lance`);
};
