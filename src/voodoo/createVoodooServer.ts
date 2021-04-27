import { ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';

const logger = new Logger('Voodoo');

interface Player {
  accountId: number;
  serverId: number;
  serverConnection: ServerConnection;
  isVoodooClient: boolean;
  invocations: string[];
}

interface AddPlayer {
  accountId: number;
  serverId: number;
  serverConnection: ServerConnection;
}

interface RemovePlayer {
  accountId: number;
}

interface RemovePlayers {
  serverId: number;
}

interface SetVoodooClient {
  accountId: number;
  isVoodooClient: boolean;
}

interface AddInvocation {
  accountId: number;
  invocation: string;
}

interface ClearInvocations {
  accountId: number;
}

export type VoodooServer = {
  logger: Logger;
  players: Player[];
  addPlayer: ({ accountId, serverId, serverConnection }: AddPlayer) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  setVoodooClient: ({ accountId, isVoodooClient }: SetVoodooClient) => void;
  addInvocation: ({ accountId, invocation }: AddInvocation) => string[];
  clearInvocations: ({ accountId }: ClearInvocations) => void;
};

export const createVoodooServer = (): VoodooServer => ({
  logger,

  players: [],

  addPlayer: function ({ accountId, serverId, serverConnection }) {
    const newPlayer = {
      accountId,
      serverId,
      serverConnection,
      isVoodooClient: false,
      invocations: []
    };

    this.players = [...this.players.filter(player => player.accountId !== accountId), newPlayer];

    logger.success(`Added player ${accountId}`);
  },

  removePlayer: function ({ accountId }) {
    this.players = [...this.players.filter(player => player.accountId !== accountId)];

    logger.warn(`Removed player ${accountId}`);
  },

  removePlayers: function ({ serverId }) {
    this.players = [...this.players.filter(player => player.serverId !== serverId)];

    logger.warn(`Removed all players of server ${serverId}`);
  },

  setVoodooClient: function ({ accountId, isVoodooClient }) {
    const player = this.players.find(player => player.accountId === accountId);

    if (!player) return;

    this.players = [...this.players.filter(player => player.accountId !== accountId), { ...player, isVoodooClient }];

    if (isVoodooClient) {
      logger.success(`Player ${accountId} is a Voodoo Client`);
    } else {
      logger.warn(`Player ${accountId} is not a Voodoo Client`);
    }
  },

  addInvocation: function ({ accountId, invocation }) {
    const player = this.players.find(player => player.accountId === accountId);

    if (!player) return [];

    const newInvocations = [...player.invocations, invocation];

    this.players = [
      ...this.players.filter(player => player.accountId !== accountId),
      { ...player, invocations: newInvocations }
    ];

    logger.success(`Player ${accountId} invocated '${invocation}'`);

    return newInvocations;
  },

  clearInvocations: function ({ accountId }) {
    const player = this.players.find(player => player.accountId === accountId);

    if (!player) return;

    this.players = [...this.players.filter(player => player.accountId !== accountId), { ...player, invocations: [] }];

    logger.success(`Cleared all invocations of player ${accountId}`);
  }
});
