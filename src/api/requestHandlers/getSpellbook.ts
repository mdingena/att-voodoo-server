import { RequestHandler } from 'express';
import { VoodooServer } from '../../voodoo';

export const getSpellbook = (voodoo: VoodooServer): RequestHandler => {
  const spellbook = [...voodoo.spellbook.spells.values()].reduce(
    (sum, spell) => ({
      ...sum,
      [spell.name]: {
        name: spell.name,
        school: spell.school,
        requiresPreparation: spell.requiresPreparation,
        upgrades: spell.upgrades
      }
    }),
    {}
  );

  return async (clientRequest, clientResponse) => {
    clientResponse.json({ ok: true, result: spellbook });
  };
};
