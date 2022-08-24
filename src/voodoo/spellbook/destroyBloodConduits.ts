import type { VoodooServer } from '../createVoodooServer';

export const destroyBloodConduits = async (voodoo: VoodooServer, accountId: number) => {
  const player = voodoo.players[accountId];

  if (typeof player === 'undefined') return;

  const conduits = player.bloodConduits;

  if (typeof conduits === 'undefined') return;

  const storedTimeout = voodoo.players[accountId].bloodConduitsTimeout;

  if (typeof storedTimeout !== 'undefined') clearTimeout(storedTimeout);

  for (const id of Object.keys(conduits).map(Number)) {
    voodoo.command({ accountId, command: `wacky destroy ${id}` });
  }

  voodoo.setBloodConduits({
    accountId,
    bloodConduits: undefined,
    bloodConduitsTimeout: undefined,
    heartfruit: undefined
  });
};
