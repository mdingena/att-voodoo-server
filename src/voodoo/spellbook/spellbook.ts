import { pages } from 'att-voodoo-spellbook';
import { spells } from './spells';
import { VoodooServer } from '../index';

export type Spell = {
  name: string;
  cast: (voodoo: VoodooServer, accountId: number) => Promise<void>;
  requiresPreparation: boolean;
  verbalTrigger?: string;
};

export type Incantation = [string, string];

export type Spellbook = {
  spells: Map<string, Spell>;
  get: (incantations: Incantation[]) => Spell | undefined;
};

export const spellbook: Spellbook = {
  spells: new Map(
    Object.entries(spells)
      .filter(([spellName]) => pages.hasOwnProperty(spellName))
      .map(([spellName, spell]) => {
        const { name, incantations, requiresPreparation, verbalTrigger } = pages[spellName];

        return [JSON.stringify(incantations), { name, cast: spell, requiresPreparation, verbalTrigger }];
      })
  ),

  get: function (incantations: Incantation[]) {
    const key = JSON.stringify(incantations);
    return this.spells.get(key);
  }
};
