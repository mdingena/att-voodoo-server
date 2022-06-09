import { pages, School, Upgrades } from 'att-voodoo-spellbook';
import * as spells from './spells';
import { Experience, TrackCategory, VoodooServer } from '../createVoodooServer';
import { xpGain } from './experience';
import { spawn as voodooSpawn } from './spawn';
import { spawnFrom } from './spawnFrom';

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

export type Spellbook = {
  spells: Map<string, Spell>;
  get: (incantations: [string, string][]) => Spell | undefined;
};

export type SpellFunction = (voodoo: VoodooServer, accountId: number, upgrades: Upgrades) => Promise<void>;

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
              const { position, rotation } = spawnFrom(player, spawn.from, spawn.distance);

              voodooSpawn(voodoo, accountId, spawn.prefabData(position, rotation));
            }
          }
        ];
      })
  ),

  get: function (incantations: [string, string][]) {
    const key = JSON.stringify(incantations);
    return this.spells.get(key);
  }
};
