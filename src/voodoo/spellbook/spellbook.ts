import { pages, School, Upgrades } from 'att-voodoo-spellbook';
import * as spells from './spells';
import { VoodooServer } from '..';
import { xpGain } from './experience';

export type Spell = {
  key: string;
  name: string;
  school: School;
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
            cast: async (voodoo, accountId) => {
              await spell(voodoo, accountId, upgrades);

              const amount = xpGain(incantations.length);
              await voodoo.addExperience({ accountId, school, amount });
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
