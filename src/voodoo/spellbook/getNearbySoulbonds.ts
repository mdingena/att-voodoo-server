import { PlayerDetailed, VoodooServer } from '../createVoodooServer';
import { decodeString, Pickup } from 'att-string-transcoder';
import { parsePrefab, parseVector } from './utils';

type PartialVoodooServer = Pick<VoodooServer, 'command' | 'getPlayerDetailed' | 'getPlayerInventory'>;

export const getNearbySoulbonds = async (voodoo: PartialVoodooServer, accountId: number, searchRadius: number) => {
  const playerInventory = await voodoo.getPlayerInventory({ accountId });

  if (typeof playerInventory === 'undefined') return [];

  const beltItemIds: number[] = playerInventory.Belt.map(item => item?.Identifier ?? 0).filter(Boolean);

  const beltItems = await Promise.all(
    beltItemIds.map(id => {
      voodoo.command({ accountId, command: `select ${id}` });
      return voodoo.command<{ ResultString?: string }>({ accountId, command: `select tostring` });
    })
  );

  const soulbondAccountIds = beltItems
    .filter(item => typeof item !== 'undefined' && item.ResultString)
    .map(item => {
      const string = item?.ResultString;

      if (typeof string === 'undefined') return 0;

      const decodedString = decodeString(string);
      const prefab = parsePrefab(decodedString);

      if (prefab !== 'soulbond') return 0;

      return (decodedString.prefab.components?.Pickup as Pickup)?.lastInteractorPlayerId ?? 0;
    })
    .filter(id => id !== 0 && id !== accountId);

  const caster = await voodoo.getPlayerDetailed({ accountId });
  const casterPosition = parseVector(caster!.Position);

  const soulbondPlayers = await Promise.all(soulbondAccountIds.map(id => voodoo.getPlayerDetailed({ accountId: id })));

  const nearbySoulbonds = soulbondPlayers.filter(player => {
    if (typeof player === 'undefined') return false;

    const playerPosition = parseVector(player.Position);
    const distance = casterPosition.distanceTo(playerPosition);

    return distance <= searchRadius;
  }) as PlayerDetailed[];

  return nearbySoulbonds;
};
