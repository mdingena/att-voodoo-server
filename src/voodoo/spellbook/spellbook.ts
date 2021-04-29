import { ServerConnection } from 'js-tale';
import { pages } from 'att-voodoo-spellbook';
import { spells } from './spells';

export type Incantation = [string, number];

export type Spellbook = {
  spells: Map<string, (connection: ServerConnection, accountId: number) => Promise<void>>;
  get: (
    incantations: Incantation[]
  ) => ((connection: ServerConnection, accountId: number) => Promise<void>) | undefined;
};

export const spellbook: Spellbook = {
  spells: new Map(
    Object.entries(spells)
      .filter(([spellName]) => pages.has(spellName))
      .map(([spellName, spell]) => {
        const incantations = JSON.stringify(pages.get(spellName) ?? [[]]);

        return [incantations, spell];
      })
  ),

  get: function (incantations: Incantation[]) {
    const key = JSON.stringify(incantations);
    return this.spells.get(key);
  }
};
