import { pages, School } from 'att-voodoo-spellbook';
import * as spells from './spells';
import { VoodooServer } from '..';
import { xpGain } from './experience';

export type Spell = {
  name: string;
  school: School;
  cast: (voodoo: VoodooServer, accountId: number) => Promise<void>;
  requiresPreparation: boolean;
  verbalTrigger?: string;
};

export type Spellbook = {
  spells: Map<string, Spell>;
  get: (incantations: [string, string][]) => Spell | undefined;
};

export const spellbook: Spellbook = {
  spells: new Map(
    Object.entries(spells)
      .filter(([spellName]) => pages.hasOwnProperty(spellName))
      .map(([spellName, spell]) => [
        JSON.stringify(pages[spellName].incantations),
        {
          cast: async (voodoo, accountId) => {
            await spell(voodoo, accountId);
            const xp = xpGain(pages[spellName].incantations.length);
            voodoo.addExperience({ accountId, school: pages[spellName].school, amount: xp });
          },
          ...pages[spellName]
        }
      ])
  ),

  get: function (incantations: [string, string][]) {
    const key = JSON.stringify(incantations);
    return this.spells.get(key);
  }
};
