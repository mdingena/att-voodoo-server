import { ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';
import { spellbook, Spellbook, Incantation, Spell } from './spellbook';
import { db } from '../db';
import { selectPreparedSpells, upsertPreparedSpells } from '../db/sql';

const logger = new Logger('Voodoo');

type Server = {
  id: number;
  name: string;
  online: boolean;
  players: number;
};

export type Dexterity = 'left' | 'right';

type Players = {
  [accountId: number]: {
    serverId: number;
    serverConnection: ServerConnection;
    dexterity: Dexterity;
    incantations: Incantation[];
  };
};

export type PreparedSpells = {
  verbalTrigger: string;
  incantations: Incantation[];
}[];

interface RemoveServer {
  serverId: number;
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

interface SetDexterity {
  accountId: number;
  dexterity: Dexterity;
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

interface PrepareSpell {
  accountId: number;
  incantations: Incantation[];
  spell: Spell;
}

export type VoodooServer = {
  logger: Logger;
  servers: Server[];
  players: Players;
  spellbook: Spellbook;
  addServer: (server: Server) => void;
  updateServer: (server: Server) => void;
  removeServer: ({ serverId }: RemoveServer) => void;
  addPlayer: ({ accountId, serverId, serverConnection }: AddPlayer) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  setDexterity: ({ accountId, dexterity }: SetDexterity) => void;
  addIncantation: ({ accountId, incantation }: AddIncantation) => Incantation[];
  clearIncantations: ({ accountId }: ClearIncantations) => Incantation[];
  command: ({ accountId, command }: Command) => Promise<any>;
  prepareSpell: ({ accountId, incantations, spell }: PrepareSpell) => Promise<PreparedSpells>;
};

export const createVoodooServer = (): VoodooServer => ({
  logger,

  servers: [],

  players: {},

  spellbook,

  addServer: function (server) {
    this.servers = [...this.servers, server];
  },

  updateServer: function (server) {
    const servers = this.servers.filter(({ id }) => id !== server.id);
    this.servers = [...servers, server];
  },

  removeServer: function ({ serverId }) {
    this.servers = this.servers.filter(({ id }) => id !== serverId);
  },

  addPlayer: function ({ accountId, serverId, serverConnection }) {
    const newPlayer = {
      serverId,
      serverConnection,
      dexterity: 'right' as Dexterity,
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
    Object.entries(this.players)
      .filter(([_, player]) => player.serverId === serverId)
      .forEach(([accountId]) => delete this.players[Number(accountId)]);

    logger.warn(`Removed all players of server ${serverId}`);
  },

  setDexterity: function ({ accountId, dexterity }) {
    this.players = { ...this.players, [accountId]: { ...this.players[accountId], dexterity } };

    logger.log(`Changed ${accountId}'s dexterity to ${dexterity}`);
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

    if (!player) return [];

    this.players = { ...this.players, [accountId]: { ...player, incantations: [] } };

    logger.success(`Cleared all incantations of ${accountId}@${player.serverId}`);

    return this.players[accountId].incantations;
  },

  command: async function ({ accountId, command }) {
    const player = this.players[accountId];

    if (!player) throw Error('Player not found');

    const result = await player.serverConnection.send(command);

    logger.log(`${accountId}@${player.serverId}: ${command}`);

    return result;
  },

  prepareSpell: async function ({ accountId, incantations, spell }) {
    const storedSpells = await db.query(selectPreparedSpells, [accountId]);

    const preparedSpells: PreparedSpells = JSON.parse(storedSpells.rows[0]?.prepared_spells ?? '[]');
    const maxPreparedSpells = 10; // @todo Base this off player level / skills

    if (preparedSpells.length >= maxPreparedSpells) preparedSpells.shift();

    const preparedSpell = {
      verbalTrigger: spell.verbalTrigger ?? '',
      incantations
    };

    preparedSpells.push(preparedSpell);
    const newPreparedSpells = JSON.stringify(preparedSpells);

    await db.query(upsertPreparedSpells, [accountId, newPreparedSpells]);

    logger.info(`${accountId} prepared a spell`);

    return preparedSpells;
  }
});
