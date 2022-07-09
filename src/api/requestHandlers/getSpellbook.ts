import { pages } from 'att-voodoo-spellbook';
import * as spellFunctions from '../../voodoo/spellbook/spells';
import { RequestHandler } from 'express';

export const getSpellbook = (): RequestHandler => {
  const spellbook = Object.entries(pages)
    .filter(([spellKey]) => spellFunctions.hasOwnProperty(spellKey))
    .reduce(
      (spells, [spellKey, spell]) => ({
        ...spells,
        [spellKey]: {
          name: spell.name,
          school: spell.school,
          description: spell.description,
          castsFrom: spell.castsFrom,
          requiresPreparation: spell.requiresPreparation,
          upgrades: spell.upgrades,
          incantations: spell.isDiscovered ? spell.incantations : undefined
        }
      }),
      {}
    );

  return async (clientRequest, clientResponse) => {
    clientResponse.json({ ok: true, result: spellbook });
  };
};
