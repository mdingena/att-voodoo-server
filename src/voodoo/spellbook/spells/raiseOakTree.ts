import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { composeTree, generateComposition, Prefab, SpeciesHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const raiseOakTree: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'raiseOakTree' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const terminationRate = 1 / attributes.arborist;
  const tree = generateComposition(terminationRate);
  const childPrefabs = composeTree(tree);

  const player = await voodoo.getPlayerDetailed({ accountId });
  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const rightHand = spawnFrom(player, 'mainHand', dexterity, 1);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Tree.hash,
      position: rightHand.position
    },
    components: {
      NetworkRigidbody: {
        position: rightHand.position,
        isKinematic: true
      },
      WoodcutTree: {
        speciesHash: SpeciesHash.Oak
      }
    },
    childPrefabs: [childPrefabs]
  });

  voodoo.command({ accountId, command: 'select snap-ground' });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Raise Oak Tree`);
};
