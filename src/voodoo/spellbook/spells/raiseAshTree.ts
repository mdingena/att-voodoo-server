import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { createRandomTree, SpeciesHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const raiseAshTree: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'raiseAshTree' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const terminationRate = 1 / attributes.arborist;

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const mainHand = spawnFrom(player, 'mainHand', dexterity, 0.5);

  const tree = createRandomTree(SpeciesHash.Ash, terminationRate, mainHand.position);

  spawn(voodoo, accountId, tree);

  voodoo.command({ accountId, command: 'select snap-ground' });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Raise Ash Tree`);
};
