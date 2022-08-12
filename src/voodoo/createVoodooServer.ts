import ua, { Visitor } from 'universal-analytics';
import { ServerConnection } from 'att-client';
import { DecodedString, PrefabData } from 'att-string-transcoder';
import {
  spellbook,
  Spellbook,
  Spell,
  School,
  upgradeAttribute,
  UpgradeConfig,
  spawnFrom,
  spawn,
  StudyFeedback,
  SpellpageIncantation,
  EvokeHandedness,
  EvokeAngle,
  BloodConduits,
  destroyBloodConduits,
  spawnBloodConduits
} from './spellbook';
import { db } from '../db';
import {
  selectExperience,
  selectPreparedSpells,
  selectUser,
  upsertExperience,
  upsertPreparedSpells,
  upsertUpgrade
} from '../db/sql';
import { Vector3Tuple } from 'three';

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

export type Dexterity = 'rightHand/palm' | 'rightHand/index' | 'leftHand/palm' | 'leftHand/index';

type DockedIncantation = {
  verbalSpellComponent: string;
  materialSpellComponent: string;
  decodedString: DecodedString;
  studyFeedback: StudyFeedback | undefined;
};

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
    isCastingHeartfruit: boolean;
    bloodConduits?: BloodConduits;
    heartfruit?: PrefabData;
  };
};

type Upgrades = {
  [key: string]: { [key: string]: number };
};

export type Experience = {
  freeResets: number;
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
  school: string;
  verbalTrigger: string;
  incantations: SpellpageIncantation[];
  charges: number;
};

export type PreparedSpells = PreparedSpell[];

type User = {
  dexterity: Dexterity;
};

interface GetPlayer {
  accountId: number;
}

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

interface GetPlayerInventory {
  accountId: number;
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

export type SelectFindResponse = { Result: { Name: string; Identifier: number }[] };

type PlayerInventoryResponse = {
  Result?: PlayerInventory[];
};

type InventoryItem = {
  Position: Vector3Tuple;
  Rotation: Vector3Tuple;
  Name: string;
  Identifier: number;
  RootIdentifier: number;
  PrefabHash: number;
  ChunkingParent: number;
};

type PlayerInventory = {
  LeftHand?: InventoryItem;
  RightHand?: InventoryItem;
  Belt: [InventoryItem | null, InventoryItem | null, InventoryItem | null, InventoryItem | null];
  Back: [InventoryItem | null];
  All: InventoryItem[];
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

interface GetDexterity {
  accountId: number;
}

interface ParseDexterity {
  dexterity: Dexterity;
}

interface SetDexterity {
  accountId: number;
  dexterity: Dexterity;
}

interface SetCastingHeartfruit {
  accountId: number;
  isCastingHeartfruit: boolean;
}

interface SetBloodConduits {
  accountId: number;
  bloodConduits: BloodConduits | undefined;
  heartfruit: PrefabData | undefined;
}

interface ActivateBloodConduit {
  accountId: number;
  conduitId: number;
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
  incantations: SpellpageIncantation[];
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
  getPlayer: ({ accountId }: GetPlayer) => Promise<User>;
  addPlayer: ({ name, accountId, serverId, serverConnection }: AddPlayer) => Promise<void>;
  setPlayerClientStatus: ({ accountId, isVoodooClient }: PlayerClientStatus) => void;
  removePlayer: ({ accountId }: RemovePlayer) => void;
  removePlayers: ({ serverId }: RemovePlayers) => void;
  getPlayerDetailed: ({ accountId }: GetPlayerDetailed) => Promise<PlayerDetailed | undefined>;
  getPlayerCheckStat: ({ accountId, stat }: GetPlayerCheckStat) => Promise<PlayerStat>;
  getPlayerCheckStatBase: ({ accountId, stat }: GetPlayerCheckStatBase) => Promise<number | undefined>;
  getPlayerCheckStatCurrent: ({ accountId, stat }: GetPlayerCheckStatCurrent) => Promise<number | undefined>;
  getPlayerInventory: ({ accountId }: GetPlayerInventory) => Promise<PlayerInventory | undefined>;
  getExperience: ({ accountId, serverId }: GetExperience) => Promise<Experience>;
  addExperience: ({ accountId, school, amount }: AddExperience) => Promise<Experience>;
  getSpellUpgrades: ({ accountId, spell }: GetSpellUpgrades) => { [key: string]: number };
  addUpgrade: ({ accountId, school, spell, upgrade }: AddUpgrade) => Promise<false | Experience>;
  getDexterity: ({ accountId }: GetDexterity) => Dexterity;
  parseDexterity: ({ dexterity }: ParseDexterity) => [EvokeHandedness, EvokeAngle];
  setDexterity: ({ accountId, dexterity }: SetDexterity) => void;
  setCastingHeartfruit: ({ accountId, isCastingHeartfruit }: SetCastingHeartfruit) => void;
  setBloodConduits: ({ accountId, bloodConduits, heartfruit }: SetBloodConduits) => void;
  activateBloodConduit: ({ accountId, conduitId }: ActivateBloodConduit) => Promise<string | undefined>;
  addIncantation: ({ accountId, incantation }: AddIncantation) => SpellpageIncantation[];
  clearIncantations: ({ accountId }: ClearIncantations) => SpellpageIncantation[];
  returnMaterials: ({ accountId }: ReturnMaterials) => void;
  command: <T = void>({ accountId, command }: Command) => Promise<T | undefined>;
  prepareSpell: ({ accountId, incantations, spell }: PrepareSpell) => Promise<PreparedSpells>;
  track: ({ accountId, serverId, category, action, value }: Track) => void;
};

export const createVoodooServer = (): VoodooServer => ({
  config: {
    CONDUIT_DISTANCE: 10,
    CONDUIT_PREFABS: /^Green_Crystal_cluster_03.*/i,
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

  getPlayer: async function ({ accountId }) {
    const storedUser = await db.query(selectUser, [accountId]);

    const user: User = {
      dexterity: storedUser.rows[0]?.dexterity ?? 'rightHand/palm'
    };

    return user;
  },

  addPlayer: async function ({ name, accountId, serverId, serverConnection }) {
    const [experience, user] = await Promise.all([
      this.getExperience({ accountId, serverId }),
      this.getPlayer({ accountId })
    ]);

    const { name: serverName } = this.servers.find(({ id }) => id === serverId) ?? {};

    const newPlayer = {
      name,
      isVoodooClient: false,
      analytics: ua(process.env.GA_TRACKING_ID!, { uid: accountId.toString() }),
      serverId,
      serverName,
      serverConnection,
      dexterity: user.dexterity,
      incantations: [],
      experience,
      isCastingHeartfruit: false
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

    const { name, serverId, serverName, isVoodooClient, bloodConduits } = this.players[accountId];

    if (isVoodooClient) {
      this.track({
        accountId,
        serverId,
        category: TrackCategory.Players,
        action: TrackAction.PlayerRemoved
      });
    }

    if (typeof bloodConduits !== 'undefined') {
      try {
        Promise.all(
          Object.values(bloodConduits).map(({ id }) => {
            this.command({ accountId, command: `wacky destroy ${id}` });
          })
        );
      } catch (error) {
        console.error(`Can't remove blood conduits on closed connection for server ${serverId} (${serverName}).`);
      }
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
      const { Result: player } = (await this.command({
        accountId,
        command: `player detailed ${accountId}`
      })) as PlayerDetailedResponse;

      return player;
    } catch (error) {
      return undefined;
    }
  },

  getPlayerCheckStat: async function ({ accountId, stat }) {
    try {
      const checkStatResponse = (await this.command({
        accountId,
        command: `player check-stat ${accountId} ${stat}`
      })) as PlayerCheckStatResponse;

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

  getPlayerInventory: async function ({ accountId }) {
    try {
      const playerInventoryResponse = (await this.command({
        accountId,
        command: `player inventory ${accountId}`
      })) as PlayerInventoryResponse;

      return playerInventoryResponse.Result?.[0];
    } catch (error) {
      return;
    }
  },

  getExperience: async function ({ accountId, serverId }) {
    const storedExperience = await db.query(selectExperience, [accountId, serverId]);

    const experience: Experience = {
      freeResets: storedExperience.rows[0]?.free_resets ?? 0,
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

  getDexterity: function ({ accountId }) {
    const { dexterity } = this.players[accountId];

    return dexterity as Dexterity;
  },

  parseDexterity: function ({ dexterity }) {
    return dexterity.split('/') as [EvokeHandedness, EvokeAngle];
  },

  setDexterity: function ({ accountId, dexterity }) {
    const { name, serverId, serverName } = this.players[accountId];

    this.players = { ...this.players, [accountId]: { ...this.players[accountId], dexterity } };

    console.log(`[${serverName ?? serverId} | ${name}] changed dexterity to ${dexterity}`);
  },

  setCastingHeartfruit: function ({ accountId, isCastingHeartfruit }) {
    const player = this.players[accountId];

    this.players = {
      ...this.players,
      [accountId]: { ...player, isCastingHeartfruit }
    };
  },

  setBloodConduits: function ({ accountId, bloodConduits, heartfruit }) {
    const player = this.players[accountId];

    this.players = {
      ...this.players,
      [accountId]: { ...player, bloodConduits, heartfruit }
    };
  },

  activateBloodConduit: async function ({ accountId, conduitId }) {
    const player = this.players[accountId];

    if (
      typeof player.heartfruit === 'undefined' ||
      typeof player.bloodConduits === 'undefined' ||
      typeof player.bloodConduits[conduitId] === 'undefined'
    ) {
      return;
    }

    const conduits = {
      ...player.bloodConduits,
      [conduitId]: {
        ...player.bloodConduits[conduitId],
        isActivated: true
      }
    };

    const key = player.bloodConduits[conduitId].key;
    const heartfruit = player.heartfruit;

    const activated = Object.values(conduits)
      .filter(({ isActivated }) => isActivated)
      .map(({ key }) => {
        switch (key) {
          case 'Zephyrus':
            return 0;
          case 'Corus':
            return 1;
          case 'Caecias':
            return 2;
          case 'Subsolanus':
            return 3;
          case 'Vulturnus':
            return 4;
          case 'Africus':
            return 5;
          default:
            return -1;
        }
      });

    await destroyBloodConduits(this, accountId);

    if (activated.length < 4) {
      await spawnBloodConduits(this, accountId, heartfruit, activated);
    }

    return key;
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

    return newIncantations.map(incantation => [
      incantation.verbalSpellComponent,
      incantation.materialSpellComponent,
      incantation.studyFeedback
    ]);
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

    const playerDetailed = await this.getPlayerDetailed({ accountId });

    if (typeof playerDetailed === 'undefined') return;

    const evokePreference = player.dexterity.split('/') as [EvokeHandedness, EvokeAngle];
    const { position, rotation } = spawnFrom(playerDetailed, 'eyes', evokePreference, 1);

    for (const incantation of player.incantations) {
      const { prefab } = incantation.decodedString;

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

  command: async function <T = void>({ accountId, command }: Command) {
    const player = this.players[accountId];

    if (!player) throw Error('Player not found');

    try {
      const response = await player.serverConnection.send(command);

      const result = response.data;

      // console.log(`[${player.serverName ?? player.serverId} | ${player.name}] ${command}`);

      return result as T;
    } catch (error) {
      console.error((error as Error).message);
    }
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
      school: spell.school,
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
