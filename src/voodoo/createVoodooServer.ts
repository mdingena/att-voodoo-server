import ua, { Visitor } from 'universal-analytics';
import { ServerConnection } from 'att-client';
import { DecodedString, PrefabData } from 'att-string-transcoder';
import { spellbook, Spellbook, Spell, School, upgradeAttribute, UpgradeConfig, spawnFrom, spawn } from './spellbook';
import { db } from '../db';
import {
  selectExperience,
  selectPreparedSpells,
  upsertExperience,
  upsertPreparedSpells,
  upsertUpgrade
} from '../db/sql';

type Config = {
  CONDUIT_DISTANCE: number;
  CONDUIT_PREFABS: RegExp;
  PREPARED_SPELLS_CONFIG: UpgradeConfig;
  UPGRADE_COST_XP: number;
};

type Server = {
  id: number;
  groupId: number;
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
    name: string;
    isVoodooClient: boolean;
    analytics: Visitor;
    serverId: number;
    serverName?: string;
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
  charges: number;
};

export type PreparedSpells = PreparedSpell[];

interface AddPlayer {
  name: string;
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

interface GetPlayerCheckStat {
  accountId: number;
  stat: string;
}

interface GetPlayerCheckStatBase {
  accountId: number;
  stat: string;
}

interface GetPlayerCheckStatCurrent {
  accountId: number;
  stat: string;
}

type PotentialVectorResponse = string | number[];

export type PlayerDetailed = {
  Position: PotentialVectorResponse;
  HeadPosition: PotentialVectorResponse;
  HeadForward: PotentialVectorResponse;
  HeadUp: PotentialVectorResponse;
  LeftHandPosition: PotentialVectorResponse;
  LeftHandForward: PotentialVectorResponse;
  LeftHandUp: PotentialVectorResponse;
  RightHandPosition: PotentialVectorResponse;
  RightHandForward: PotentialVectorResponse;
  RightHandUp: PotentialVectorResponse;
  Chunk: string;
  Body: {
    Identifier: number;
    Name: string;
  };
  id: number;
  username: string;
};

type PlayerDetailedResponse = {
  Result?: PlayerDetailed;
};

type PlayerCheckStatResponse = {
  Result?: {
    Base: number;
    Value: number;
  };
};

type PlayerStat = {
  base?: number;
  current?: number;
};

interface GetExperience {
  accountId: number;
  serverId: number;
}

interface AddExperience {
  accountId: number;
  school: School;
  amount: number;
}

interface GetSpellUpgrades {
  accountId: number;
  spell: string;
}

interface AddUpgrade {
  accountId: number;
  school: School;
  spell: string;
  upgrade: string;
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

interface ReturnMaterials {
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

export enum TrackCategory {
  Experience = 'Experience',
  Players = 'Players',
  Servers = 'Servers',
  Sessions = 'Sessions',
  SpellCast = 'Cast spell',
  SpellPrepared = 'Prepared spell'
}

export enum TrackAction {
  ExperienceAdded = 'Experience added',
  ExperienceRemoved = 'Experience removed',
  PlayerAdded = 'Player added',
  PlayerRemoved = 'Player removed',
  SessionCreated = 'Session created',
  UpgradeAdded = 'Upgrade added'
}

interface Track {
  accountId: number;
  serverId?: number;
  category: TrackCategory;
  action: TrackAction | string;
  value?: number;
}

export type VoodooServer = {
  config: Config;
  servers: Server[];
  players: Players;
  spellbook: Spellbook;
  updateServer: (server: Server) => void;
  addPlayer: ({ name, accountId, serverId, serverConnection }: AddPlayer) => Promise<void>;
  setPlayerClientStatus: ({ accountId, isVoodooClient }: PlayerClientStatus) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  getPlayerDetailed: ({ accountId }: GetPlayerDetailed) => Promise<PlayerDetailed | undefined>;
  getPlayerCheckStat: ({ accountId, stat }: GetPlayerCheckStat) => Promise<PlayerStat>;
  getPlayerCheckStatBase: ({ accountId, stat }: GetPlayerCheckStatBase) => Promise<number | undefined>;
  getPlayerCheckStatCurrent: ({ accountId, stat }: GetPlayerCheckStatCurrent) => Promise<number | undefined>;
  getExperience: ({ accountId, serverId }: GetExperience) => Promise<Experience>;
  addExperience: ({ accountId, school, amount }: AddExperience) => Promise<Experience>;
  getSpellUpgrades: ({ accountId, spell }: GetSpellUpgrades) => { [key: string]: number };
  addUpgrade: ({ accountId, school, spell, upgrade }: AddUpgrade) => Promise<false | Experience>;
  setDexterity: ({ accountId, dexterity }: SetDexterity) => void;
  addIncantation: ({ accountId, incantation }: AddIncantation) => SpellpageIncantation[];
  clearIncantations: ({ accountId }: ClearIncantations) => SpellpageIncantation[];
  returnMaterials: ({ accountId }: ReturnMaterials) => void;
  command: ({ accountId, command }: Command) => Promise<any>;
  prepareSpell: ({ accountId, incantations, spell }: PrepareSpell) => Promise<PreparedSpells>;
  track: ({ accountId, serverId, category, action, value }: Track) => void;
};

export const createVoodooServer = (): VoodooServer => ({
  config: {
    CONDUIT_DISTANCE: 10,
    CONDUIT_PREFABS: /^Green_Crystal_cluster_03.*|^Puzzle Orb 1.*/i,
    PREPARED_SPELLS_CONFIG: {
      isStepFunction: true,
      min: 10,
      max: 25,
      constant: 0.0000343
    },
    UPGRADE_COST_XP: 1000
  },

  servers: [],

  players: {},

  spellbook,

  updateServer: function (server) {
    const servers = this.servers.filter(({ id }) => id !== server.id);
    this.servers = [...servers, server];
  },

  addPlayer: async function ({ name, accountId, serverId, serverConnection }) {
    const experience = await this.getExperience({ accountId, serverId });

    const { name: serverName } = this.servers.find(({ id }) => id === serverId) ?? {};

    const newPlayer = {
      name,
      isVoodooClient: false,
      analytics: ua(process.env.GA_TRACKING_ID!, { uid: accountId.toString() }),
      serverId,
      serverName,
      serverConnection,
      dexterity: 'right' as Dexterity,
      incantations: [],
      experience
    };

    this.players = { ...this.players, [accountId]: newPlayer };

    console.log(`[${serverName ?? serverId} | ${name}] added`);
  },

  setPlayerClientStatus: function ({ accountId, isVoodooClient }) {
    if (this.players[accountId]) {
      this.players[accountId].isVoodooClient = isVoodooClient;

      if (isVoodooClient) {
        const { serverId } = this.players[accountId];

        this.track({
          accountId,
          serverId,
          category: TrackCategory.Players,
          action: TrackAction.PlayerAdded
        });
      }
    }
  },

  removePlayer: function ({ accountId }) {
    if (!this.players[accountId]) {
      return console.error(`Attempted to remove player ${accountId} but no such player found.`);
    }

    const { name, serverId, serverName, isVoodooClient } = this.players[accountId];

    if (isVoodooClient) {
      this.track({
        accountId,
        serverId,
        category: TrackCategory.Players,
        action: TrackAction.PlayerRemoved
      });
    }

    delete this.players[accountId];

    console.warn(`[${serverName ?? serverId} | ${name}] removed`);
  },

  removePlayers: function ({ serverId }) {
    const { name: serverName } = this.servers.find(({ id }) => id === serverId) ?? {};

    Object.entries(this.players)
      .filter(([_, player]) => player.serverId === serverId)
      .forEach(([accountId]) => delete this.players[Number(accountId)]);

    console.warn(`[${serverName ?? serverId}] removed all players`);
  },

  getPlayerDetailed: async function ({ accountId }) {
    try {
      const { Result: player }: PlayerDetailedResponse = await this.command({
        accountId,
        command: `player detailed ${accountId}`
      });

      return player;
    } catch (error) {
      return undefined;
    }
  },

  getPlayerCheckStat: async function ({ accountId, stat }) {
    try {
      const checkStatResponse: PlayerCheckStatResponse = await this.command({
        accountId,
        command: `player check-stat ${accountId} ${stat}`
      });

      return {
        base: checkStatResponse.Result?.Base,
        current: checkStatResponse.Result?.Value
      };
    } catch (error) {
      return {
        base: undefined,
        current: undefined
      };
    }
  },

  getPlayerCheckStatBase: async function ({ accountId, stat }) {
    const playerStat = await this.getPlayerCheckStat({ accountId, stat });

    return playerStat.base;
  },

  getPlayerCheckStatCurrent: async function ({ accountId, stat }) {
    const playerStat = await this.getPlayerCheckStat({ accountId, stat });

    return playerStat.current;
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
    const { name, serverId, serverName } = this.players[accountId];

    await db.query(upsertExperience(`${school}_xp_total`), [accountId, serverId, amount]);

    const experience = await this.getExperience({ accountId, serverId });

    this.players[accountId].experience = experience;

    console.log(`[${serverName ?? serverId} | ${name}] gained ${amount} ${school} XP`);

    this.track({
      accountId,
      serverId,
      category: TrackCategory.Experience,
      action: TrackAction.ExperienceAdded,
      value: amount
    });

    return experience;
  },

  getSpellUpgrades: function ({ accountId, spell }) {
    return this.players[accountId].experience.upgrades[spell] ?? {};
  },

  addUpgrade: async function ({ accountId, school, spell, upgrade }) {
    const { name, serverId, serverName } = this.players[accountId];

    const experience = await this.getExperience({ accountId, serverId });

    const experienceTotal = experience[`${school}XpTotal` as keyof Experience] as number;
    const experienceSpent = experience[`${school}XpSpent` as keyof Experience] as number;
    const experienceBudget = experienceTotal - experienceSpent;
    const { UPGRADE_COST_XP } = this.config;

    if (experienceBudget < UPGRADE_COST_XP) return false;

    const { upgrades } = experience;

    upgrades[spell] = {
      ...upgrades[spell],
      [upgrade]: (upgrades[spell]?.[upgrade] ?? 0) + 1
    };

    await db.query(upsertUpgrade(`${school}_xp_spent`), [
      accountId,
      serverId,
      UPGRADE_COST_XP,
      JSON.stringify(upgrades)
    ]);

    const newExperience = await this.getExperience({ accountId, serverId });

    this.players[accountId].experience = experience;

    console.log(`[${serverName ?? serverId} | ${name}] upgraded ${spell} (${upgrade}) for ${UPGRADE_COST_XP} XP`);

    this.track({
      accountId,
      serverId,
      category: TrackCategory.Experience,
      action: TrackAction.UpgradeAdded
    });

    this.track({
      accountId,
      serverId,
      category: TrackCategory.Experience,
      action: TrackAction.ExperienceRemoved,
      value: UPGRADE_COST_XP
    });

    return newExperience;
  },

  setDexterity: function ({ accountId, dexterity }) {
    const { name, serverId, serverName } = this.players[accountId];

    this.players = { ...this.players, [accountId]: { ...this.players[accountId], dexterity } };

    console.log(`[${serverName ?? serverId} | ${name}] changed dexterity to ${dexterity}`);
  },

  addIncantation: function ({ accountId, incantation }) {
    const player = this.players[accountId];

    if (!player) return [];

    const newIncantations = [...player.incantations, incantation];

    this.players = {
      ...this.players,
      [accountId]: { ...player, incantations: newIncantations }
    };

    console.log(
      `[${player.serverName ?? player.serverId} | ${
        player.name
      }] incanted "${incantation.verbalSpellComponent.toUpperCase()}" (${incantation.materialSpellComponent})`
    );

    return newIncantations.map(incantation => [incantation.verbalSpellComponent, incantation.materialSpellComponent]);
  },

  clearIncantations: function ({ accountId }) {
    const player = this.players[accountId];

    if (!player) return [];

    this.players = { ...this.players, [accountId]: { ...player, incantations: [] } };

    console.log(`[${player.serverName ?? player.serverId} | ${player.name}] cleared incantations`);

    return [];
  },

  returnMaterials: async function ({ accountId }) {
    const player = this.players[accountId];

    if (!player) return;

    for (const incantation of player.incantations) {
      const { prefab } = incantation.decodedString;
      const playerDetailed = await this.getPlayerDetailed({ accountId });
      const { position, rotation } = spawnFrom(playerDetailed, 'eyes', 1);

      const respawn: PrefabData = {
        ...prefab,
        prefabObject: {
          ...prefab.prefabObject,
          position,
          rotation,
          scale: 1
        },
        components: {
          ...prefab.components,
          NetworkRigidbody: {
            ...prefab.components?.NetworkRigidbody,
            position,
            rotation
          }
        }
      };

      spawn(this, accountId, respawn);
    }

    this.clearIncantations({ accountId });
  },

  command: async function ({ accountId, command }) {
    const player = this.players[accountId];

    if (!player) throw Error('Player not found');

    const response = await player.serverConnection.send(command);

    console.log('### TEMP ###', JSON.stringify(response, null, 2));

    if (typeof response === 'undefined') {
      console.error('Something went wrong sending a console command.');
      return;
    }

    const result = response.data.Result;

    console.log(`[${player.serverName ?? player.serverId} | ${player.name}] ${command}`);

    return result;
  },

  prepareSpell: async function ({ accountId, incantations, spell }) {
    const { name, serverId, serverName, experience } = this.players[accountId];
    const storedSpells = await db.query(selectPreparedSpells, [accountId, serverId]);
    const preparedSpells: PreparedSpells = JSON.parse(storedSpells.rows[0]?.prepared_spells ?? '[]');

    const { abjurationXpTotal, conjurationXpTotal, evocationXpTotal, transmutationXpTotal, upgrades } = experience;

    const xpTotal = abjurationXpTotal + conjurationXpTotal + evocationXpTotal + transmutationXpTotal;
    const maxPreparedSpells = upgradeAttribute(xpTotal, this.config.PREPARED_SPELLS_CONFIG);

    const upgradeLevel = upgrades[spell.key]?.eidetic ?? 0;
    const upgradeConfig: UpgradeConfig | undefined = spell.upgrades.eidetic;
    const charges = upgradeConfig ? upgradeAttribute(upgradeLevel, upgradeConfig) : 1;

    if (preparedSpells.length >= maxPreparedSpells) preparedSpells.shift();

    const preparedSpell: PreparedSpell = {
      name: spell.name,
      verbalTrigger: spell.verbalTrigger ?? '',
      incantations,
      charges
    };

    preparedSpells.push(preparedSpell);
    const newPreparedSpells = JSON.stringify(preparedSpells);

    await db.query(upsertPreparedSpells, [accountId, serverId, newPreparedSpells]);

    console.info(`[${serverName ?? serverId} | ${name}] prepared spell: ${spell.name}`);

    this.track({
      accountId,
      serverId,
      category: TrackCategory.SpellPrepared,
      action: spell.name
    });

    return preparedSpells;
  },

  track: function ({ accountId, serverId, category, action, value }) {
    try {
      const { analytics } = this.players[accountId];
      const p = (serverId ?? this.players[accountId]?.serverId ?? 0).toString();

      return analytics
        .event({
          ec: category,
          ea: action,
          el: accountId.toString(),
          ev: value,
          p
        })
        .send();
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }
});
