import { SpellFunction } from '../spellbook';
import { anamnesis, ANAMNESIS_MAP } from './anamnesis';
import { Prefab } from 'att-string-transcoder';

export const anamnesisCarrotFullRipe: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const hash = ANAMNESIS_MAP.get(Prefab.Carrot_Full_Ripe.hash);

  if (!hash) return;

  anamnesis(hash)(voodoo, accountId, upgradeConfigs);

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Anamnesis (ripe carrot)`);
};
