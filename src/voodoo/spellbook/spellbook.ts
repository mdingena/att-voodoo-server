import { pages, School, Upgrades } from 'att-voodoo-spellbook';
import * as spells from './spells';
import { Experience, TrackAction, TrackCategory, VoodooServer } from '../createVoodooServer';
import { xpGain } from './experience';

export type Spell = {
  key: string;
  name: string;
  school: School;
  xp: (voodoo: VoodooServer, accountId: number) => Promise<Experience>;
  cast: (voodoo: VoodooServer, accountId: number) => Promise<void>;
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
        const { incantations, school, upgrades } = pages[spellKey];

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
                category: TrackCategory.Spells,
                action: TrackAction.SpellCast
              });
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
