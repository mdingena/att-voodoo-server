import { SpellFunction } from '../spellbook';
import { anamnesis, ANAMNESIS_MAP } from './anamnesis';
import { Prefab } from 'att-string-transcoder';

export const anamnesisPumpkinPieceCooked: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const hash = ANAMNESIS_MAP.get(Prefab.pumpkin_piece_cooked.hash);

  if (!hash) return;

  anamnesis(hash)(voodoo, accountId, upgradeConfigs);

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Anamnesis (cooked pumpkin piece)`);
};
