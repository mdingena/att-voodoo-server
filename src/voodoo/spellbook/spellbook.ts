import { pages } from 'att-voodoo-spellbook';
import * as spells from './spells';
import { VoodooServer } from '../index';

export type Spell = {
  name: string;
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
        { ...pages[spellName], cast: spell }
      ])
  ),

  get: function (incantations: [string, string][]) {
    const key = JSON.stringify(incantations);
    return this.spells.get(key);
  }
};
