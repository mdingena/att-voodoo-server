import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { PrefabHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const fire: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'fire' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const { position, rotation } = spawnFrom(player, 'rightPalm', 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: PrefabHash.Grass_Clump,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      }
    },
    embeddedEntities: {
      Fire: {
        components: {
          HeatSourceBase: {}
        }
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  voodoo.logger.success(`[${serverName ?? serverId} | ${name}] cast Fire`);
};
