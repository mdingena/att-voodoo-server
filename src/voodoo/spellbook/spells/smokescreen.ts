import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const smokescreen: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'smokescreen' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  const { position } = spawnFrom(player, 'eyes', dexterity);

  spawn(voodoo, accountId, {
    prefabObject: {
      hash: Prefab.Ash_Gotera_Smoke.hash,
      position
    }
  });

  voodoo.command({ accountId, command: 'select snap-ground' });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Smokescreen`);
};
