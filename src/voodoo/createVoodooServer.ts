import { ServerConnection } from 'js-tale';
import Logger from 'js-tale/dist/logger';
import { spellbook, Spellbook, Spell, School, DecodedString } from './spellbook';
import { db } from '../db';
import {
  selectExperience,
  selectPreparedSpells,
  upsertExperience,
  upsertPreparedSpells,
  upsertUpgrade
} from '../db/sql';

const logger = new Logger('Voodoo');

type Server = {
  id: number;
  name: string;
  online: boolean;
  players: number;
};

export type Dexterity = 'left' | 'right';

type DockedIncantation = {
  verbalSpellComponent: string;
  materialSpellComponent: string;
  decodedString: DecodedString;
};

type SpellpageIncantation = [string, string];

type Players = {
  [accountId: number]: {
    isVoodooClient: boolean;
    serverId: number;
    serverConnection: ServerConnection;
    dexterity: Dexterity;
    incantations: DockedIncantation[];
    experience: Experience;
  };
};

type Upgrades = {
  [key: string]: { [key: string]: number };
};

export type Experience = {
  upgrades: Upgrades;
  abjurationXpTotal: number;
  abjurationXpSpent: number;
  conjurationXpTotal: number;
  conjurationXpSpent: number;
  evocationXpTotal: number;
  evocationXpSpent: number;
  transmutationXpTotal: number;
  transmutationXpSpent: number;
};

type PreparedSpell = {
  name: string;
  verbalTrigger: string;
  incantations: [string, string][];
};

export type PreparedSpells = PreparedSpell[];

interface AddPlayer {
  accountId: number;
  serverId: number;
  serverConnection: ServerConnection;
}

interface PlayerClientStatus {
  accountId: number;
  isVoodooClient: boolean;
}

interface RemovePlayer {
  accountId: number;
}

interface RemovePlayers {
  serverId: number;
}

interface GetPlayerDetailed {
  accountId: number;
}

interface GetExperience {
  accountId: number;
  serverId: number;
}

interface AddExperience {
  accountId: number;
  school: School;
  amount: number;
}

interface AddUpgrade {
  accountId: number;
  spell: Spell;
  upgrade: string;
  cost: number;
}

interface SetDexterity {
  accountId: number;
  dexterity: Dexterity;
}

interface AddIncantation {
  accountId: number;
  incantation: DockedIncantation;
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
  incantations: [string, string][];
  spell: Spell;
}

export type VoodooServer = {
  logger: Logger;
  servers: Server[];
  players: Players;
  spellbook: Spellbook;
  updateServer: (server: Server) => void;
  addPlayer: ({ accountId, serverId, serverConnection }: AddPlayer) => Promise<void>;
  setPlayerClientStatus: ({ accountId, isVoodooClient }: PlayerClientStatus) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  getPlayerDetailed: ({ accountId }: GetPlayerDetailed) => Promise<any>;
  getExperience: ({ accountId, serverId }: GetExperience) => Promise<Experience>;
  addExperience: ({ accountId, school, amount }: AddExperience) => Promise<Experience>;
  addUpgrade: ({ accountId, spell, upgrade, cost }: AddUpgrade) => Promise<false | Experience>;
  setDexterity: ({ accountId, dexterity }: SetDexterity) => void;
  addIncantation: ({ accountId, incantation }: AddIncantation) => SpellpageIncantation[];
  clearIncantations: ({ accountId }: ClearIncantations) => SpellpageIncantation[];
  command: ({ accountId, command }: Command) => Promise<any>;
  prepareSpell: ({ accountId, incantations, spell }: PrepareSpell) => Promise<PreparedSpells>;
};

export const createVoodooServer = (): VoodooServer => ({
  logger,

  servers: [],

  players: {},

  spellbook,

  updateServer: function (server) {
    const servers = this.servers.filter(({ id }) => id !== server.id);
    this.servers = [...servers, server];
  },

  addPlayer: async function ({ accountId, serverId, serverConnection }) {
    const experience = await this.getExperience({ accountId, serverId });

    const newPlayer = {
      isVoodooClient: false,
      serverId,
      serverConnection,
      dexterity: 'right' as Dexterity,
      incantations: [],
      experience
    };

    this.players = { ...this.players, [accountId]: newPlayer };

    logger.success(`Added ${accountId}@${serverId}`);
  },

  setPlayerClientStatus: function ({ accountId, isVoodooClient }) {
    if (this.players[accountId]) {
      this.players[accountId].isVoodooClient = isVoodooClient;
    }
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

  getPlayerDetailed: async function ({ accountId }) {
    const { Result: player } = await this.command({
      accountId,
      command: `player detailed ${accountId}`
    });

    return player;
  },

  getExperience: async function ({ accountId, serverId }) {
    const storedExperience = await db.query(selectExperience, [accountId, serverId]);

    const experience: Experience = {
      upgrades: JSON.parse(storedExperience.rows[0]?.upgrades ?? '{}'),
      abjurationXpTotal: storedExperience.rows[0]?.abjuration_xp_total ?? 0,
      abjurationXpSpent: storedExperience.rows[0]?.abjuration_xp_spent ?? 0,
      conjurationXpTotal: storedExperience.rows[0]?.conjuration_xp_total ?? 0,
      conjurationXpSpent: storedExperience.rows[0]?.conjuration_xp_spent ?? 0,
      evocationXpTotal: storedExperience.rows[0]?.evocation_xp_total ?? 0,
      evocationXpSpent: storedExperience.rows[0]?.evocation_xp_spent ?? 0,
      transmutationXpTotal: storedExperience.rows[0]?.transmutation_xp_total ?? 0,
      transmutationXpSpent: storedExperience.rows[0]?.transmutation_xp_spent ?? 0
    };

    return experience;
  },

  addExperience: async function ({ accountId, school, amount }) {
    const { serverId } = this.players[accountId];

    await db.query(upsertExperience(`${school}_xp_total`), [accountId, serverId, amount]);

    return this.getExperience({ accountId, serverId });
  },

  addUpgrade: async function ({ accountId, spell, upgrade, cost }) {
    const { serverId } = this.players[accountId];

    const experience = await this.getExperience({ accountId, serverId });

    const experienceTotal = experience[`${spell.school}XpTotal` as keyof Experience] as number;
    const experienceSpent = experience[`${spell.school}XpSpent` as keyof Experience] as number;
    const experienceBudget = experienceTotal - experienceSpent;

    if (experienceBudget < cost) return false;

    const { upgrades } = experience;

    upgrades[spell.name] = {
      ...upgrades[spell.name],
      [upgrade]: (upgrades[spell.name]?.[upgrade] ?? 0) + 1
    };

    await db.query(upsertUpgrade(`${spell.school}_xp_spent`), [accountId, serverId, cost, JSON.stringify(upgrades)]);

    return this.getExperience({ accountId, serverId });
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

    logger.success(
      `${accountId}@${player.serverId} incanted "${incantation.verbalSpellComponent.toUpperCase()}" (${
        incantation.materialSpellComponent
      })`
    );

    return newIncantations.map(incantation => [incantation.verbalSpellComponent, incantation.materialSpellComponent]);
  },

  clearIncantations: function ({ accountId }) {
    const player = this.players[accountId];

    if (!player) return [];

    this.players = { ...this.players, [accountId]: { ...player, incantations: [] } };

    logger.success(`Cleared all incantations of ${accountId}@${player.serverId}`);

    return [];
  },

  command: async function ({ accountId, command }) {
    const player = this.players[accountId];

    if (!player) throw Error('Player not found');

    const result = await player.serverConnection.send(command);

    logger.log(`${accountId}@${player.serverId}: ${command}`);

    return result;
  },

  prepareSpell: async function ({ accountId, incantations, spell }) {
    const { serverId } = this.players[accountId];
    const storedSpells = await db.query(selectPreparedSpells, [accountId, serverId]);
    const preparedSpells: PreparedSpells = JSON.parse(storedSpells.rows[0]?.prepared_spells ?? '[]');
    const maxPreparedSpells = 10; // @todo Base this off player level / skills

    if (preparedSpells.length >= maxPreparedSpells) preparedSpells.shift();

    const preparedSpell: PreparedSpell = {
      name: spell.name,
      verbalTrigger: spell.verbalTrigger ?? '',
      incantations
    };

    preparedSpells.push(preparedSpell);
    const newPreparedSpells = JSON.stringify(preparedSpells);

    await db.query(upsertPreparedSpells, [accountId, serverId, newPreparedSpells]);

    logger.info(`${accountId} prepared spell: ${spell.name}`);

    return preparedSpells;
  }
});
