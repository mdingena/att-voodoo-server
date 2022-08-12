import type { VoodooServer } from '../createVoodooServer';

export const destroyBloodConduits = async (voodoo: VoodooServer, accountId: number) => {
  const conduits = voodoo.players[accountId].bloodConduits;

  if (typeof conduits === 'undefined') return;

  for (const id of Object.keys(conduits).map(Number)) {
    voodoo.command({ accountId, command: `wacky destroy ${id}` });
  }

  voodoo.setBloodConduits({ accountId, bloodConduits: undefined });
};
