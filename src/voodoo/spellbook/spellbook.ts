import { pages, School, Upgrades } from 'att-voodoo-spellbook';
import { hiddenSpells } from 'att-voodoo-book-of-blood';
import * as knownSpells from './spells';
import { Experience, TrackCategory, VoodooServer } from '../createVoodooServer';
import { xpGain } from './experience';
import { spawn as voodooSpawn } from './spawn';
import { EvokeHandedness, EvokeAngle, spawnFrom } from './spawnFrom';
import { spawnVelocity } from './spawnVelocity';
import { getNearbySoulbonds } from './getNearbySoulbonds';
import { parseVector } from './utils';

export type Spell = {
  key: string;
  name: string;
  school: School;
  xp: (voodoo: VoodooServer, accountId: number) => Promise<Experience>;
  cast: (voodoo: VoodooServer, accountId: number) => Promise<void>;
  spawn: (voodoo: VoodooServer, accountId: number) => Promise<void>;
  requiresPreparation: boolean;
  verbalTrigger?: string;
  upgrades: Upgrades;
};

export type SpellpageIncantation = [string, string, StudyFeedback | undefined];

export type Spellbook = {
  spells: Map<string, Spell>;
  get: (incantations: SpellpageIncantation[]) => Spell | undefined;
};

export type SpellFunction = (voodoo: VoodooServer, accountId: number, upgrades: Upgrades) => Promise<void>;

export enum StudyFeedback {
  Match = 'MATCH',
  Partial = 'PARTIAL',
  Mismatch = 'MISMATCH'
}

const decodedSpells = Object.fromEntries(
  Object.entries(hiddenSpells).map(([key, value]) => [
    key,
    value({
      getNearbySoulbonds,
      parseVector: parseVector,
      spawnFrom,
      spawn: voodooSpawn,
      spawnVelocity
    })
  ])
);

const spells = {
  ...decodedSpells,
  ...knownSpells
};

export const spellbook: Spellbook = {
  spells: new Map(
    Object.entries(spells)
      .filter(([spellKey]) => pages.hasOwnProperty(spellKey))
      .map(([spellKey, spell]) => {
        const { incantations, school, upgrades, spawn } = pages[spellKey];

        return [
          JSON.stringify(incantations),
          {
            ...pages[spellKey],
            key: spellKey,
            xp: (voodoo, accountId) => {
              const amount = xpGain(incantations.length);
              return voodoo.addExperience({ accountId, school, amount });
            },
            cast: async (voodoo, accountId) => {
              await spell(voodoo, accountId, upgrades);
              return voodoo.track({
                accountId,
                category: TrackCategory.SpellCast,
                action: pages[spellKey].name
              });
            },
            spawn: async (voodoo, accountId) => {
              if (typeof spawn === 'undefined') return;

              const player = await voodoo.getPlayerDetailed({ accountId });

              if (typeof player === 'undefined') return;

              const evokePreference = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
              const { position, rotation } = spawnFrom(player, spawn.from, evokePreference, spawn.distance);

              voodooSpawn(voodoo, accountId, spawn.prefabData(position, rotation));
            }
          }
        ];
      })
  ),

  get: function (incantations: SpellpageIncantation[]) {
    const key = incantations.map(([verbalComponent, materialComponent]) => [verbalComponent, materialComponent]);
    return this.spells.get(JSON.stringify(key));
  }
};
