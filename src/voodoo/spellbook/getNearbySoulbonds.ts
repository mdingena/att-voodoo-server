import { PlayerDetailed, VoodooServer } from '../createVoodooServer';
import { decodeString, Pickup } from 'att-string-transcoder';
import { parsePrefab, parseVector } from './utils';

export const getNearbySoulbonds = async (voodoo: VoodooServer, accountId: number, searchRadius: number) => {
  const {
    Result: [{ Belt: inventory }]
  } = await voodoo.command({ accountId, command: `player inventory ${accountId}` });

  const beltItemIds: number[] = inventory.map((item: { Identifier?: number }) => item.Identifier).filter(Boolean);

  const beltItems: { ResultString?: string }[] = await Promise.all(
    beltItemIds.map(id => {
      voodoo.command({ accountId, command: `select ${id}` });
      return voodoo.command({ accountId, command: `select tostring` });
    })
  );

  const soulbondAccountIds = beltItems
    .filter(item => item.ResultString)
    .map(item => {
      const decodedString = decodeString(item.ResultString!);
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

    return distance >= searchRadius;
  }) as PlayerDetailed[];

  return nearbySoulbonds;
};
