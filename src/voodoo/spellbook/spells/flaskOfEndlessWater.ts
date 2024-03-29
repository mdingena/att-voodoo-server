import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab, LiquidContainer } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const flaskOfEndlessWater: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const flask = voodoo.players[accountId].incantations[0].decodedString;
  const liquidContainer = flask.prefab.components?.LiquidContainer as LiquidContainer;

  if (!liquidContainer) return;

  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'flaskOfEndlessWater' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const { position, rotation } = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Potion_Medium.hash,
      position,
      rotation
    },
    components: {
      NetworkRigidbody: {
        position,
        rotation
      },
      LiquidContainer: {
        ...liquidContainer,
        contentLevel: (liquidContainer.contentLevel ?? 1) + attributes.copious
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Flask of Endless Water`);
};
