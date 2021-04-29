import { ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';
import { spellbook, Spellbook, Incantation } from './spellbook';

const logger = new Logger('Voodoo');

type Players = {
  [accountId: number]: {
    serverId: number;
    serverConnection: ServerConnection;
    isVoodooClient: boolean;
    incantations: Incantation[];
  };
};

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

interface AddIncantation {
  accountId: number;
  incantation: Incantation;
}

interface ClearIncantations {
  accountId: number;
}

interface Command {
  accountId: number;
  command: string;
}

export type VoodooServer = {
  logger: Logger;
  players: Players;
  spellbook: Spellbook;
  addPlayer: ({ accountId, serverId, serverConnection }: AddPlayer) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  setVoodooClient: ({ accountId, isVoodooClient }: SetVoodooClient) => void;
  addIncantation: ({ accountId, incantation }: AddIncantation) => Incantation[];
  clearIncantations: ({ accountId }: ClearIncantations) => void;
  command: ({ accountId, command }: Command) => Promise<any>;
};

export const createVoodooServer = (): VoodooServer => ({
  logger,

  players: [],

  spellbook,

  addPlayer: function ({ accountId, serverId, serverConnection }) {
    const newPlayer = {
      serverId,
      serverConnection,
      isVoodooClient: false,
      incantations: []
    };

    this.players = { ...this.players, [accountId]: newPlayer };

    logger.success(`Added ${accountId}@${serverId}`);
  },

  removePlayer: function ({ accountId }) {
    delete this.players[accountId];

    logger.warn(`Removed ${accountId}`);
  },

  removePlayers: function ({ serverId }) {
    const accountIds = Object.entries(this.players)
      .filter(([_, player]) => player.serverId === serverId)
      .forEach(([accountId]) => delete this.players[Number(accountId)]);

    logger.warn(`Removed all players of server ${serverId}`);
  },

  setVoodooClient: function ({ accountId, isVoodooClient }) {
    const player = this.players[accountId];

    if (!player) return;

    this.players = { ...this.players, [accountId]: { ...player, isVoodooClient } };

    if (isVoodooClient) {
      logger.success(`${accountId}@${player.serverId} is a Voodoo Client`);
    } else {
      logger.warn(`${accountId}@${player.serverId} is not a Voodoo Client`);
    }
  },

  addIncantation: function ({ accountId, incantation }) {
    const player = this.players[accountId];

    if (!player) return [];

    const newIncantations = [...player.incantations, incantation];

    this.players = {
      ...this.players,
      [accountId]: { ...player, incantations: newIncantations }
    };

    logger.success(`${accountId}@${player.serverId} incanted ${JSON.stringify(incantation)}`);

    return newIncantations;
  },

  clearIncantations: function ({ accountId }) {
    const player = this.players[accountId];

    if (!player) return;

    this.players = { ...this.players, [accountId]: { ...player, incantations: [] } };

    logger.success(`Cleared all incantations of ${accountId}@${player.serverId}`);
  },

  command: async function ({ accountId, command }) {
    const player = this.players[accountId];

    if (!player) return Promise.reject({ ok: false, error: new Error('Player not found') });

    const response = await player.serverConnection.send(command);

    return { ok: true, result: response.Result };
  }
});
