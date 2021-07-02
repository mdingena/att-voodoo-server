import { RequestHandler } from 'express';
import { VoodooServer } from '../../voodoo';

export const getSpellbook = (voodoo: VoodooServer): RequestHandler => {
  const spellbook = [...voodoo.spellbook.spells.values()].reduce(
    (spells, spell) => ({
      ...spells,
      [spell.name]: {
        name: spell.name,
        school: spell.school,
        requiresPreparation: spell.requiresPreparation,
        upgrades: Object.values(spell.upgrades).reduce(
          (upgrades, upgrade) => ({
            ...upgrades,
            [upgrade.name]: upgrade
          }),
          {}
        )
      }
    }),
    {}
  );

  return async (clientRequest, clientResponse) => {
    clientResponse.json({ ok: true, result: spellbook });
  };
};
