import { db } from '../db';
import { upsertPreparedSpells } from '../db/sql';
import { PreparedSpells } from './createVoodooServer';

const topupConfig = {
  tier1: {
    'Fire': 5
  },
  tier2: {
    'Fire': 5,
    'Haste': 6,
    'Heal Wounds': 6,
    'Conjure Crystal Pick': 3
  }
};

export const topupPatrons = async () => {
  const users = await db.query('SELECT account_id, patreon_tier FROM users WHERE patreon_tier > 0;');

  await Promise.all(
    users.rows.map(async ({ account_id: accountId, patreon_tier: patreonTier }) => {
      const tier = `tier${patreonTier}` as keyof typeof topupConfig;

      const storedSpells = await db.query(
        'SELECT server_id, prepared_spells FROM prepared_spells WHERE account_id = $1;',
        [accountId]
      );

      for (const { server_id: serverId, prepared_spells: preparedSpellsJson } of storedSpells.rows) {
        let preparedSpells: PreparedSpells = JSON.parse(preparedSpellsJson ?? '[]');

        for (const [spellName, maxCharges] of Object.entries(topupConfig[tier])) {
          const matchingPreparedSpells = Object.values(preparedSpells).filter(
            preparedSpell => preparedSpell.name === spellName
          );
          let charges = 0;

          for (const preparedSpell of matchingPreparedSpells) {
            charges += preparedSpell.charges;
          }

          if (charges < maxCharges) {
            const firstPreparedSpell = matchingPreparedSpells[0];
            const filteredSpells = Object.values(preparedSpells).filter(
              preparedSpell => preparedSpell.name !== spellName
            );

            const newPreparedSpell = {
              name: firstPreparedSpell.name,
              school: firstPreparedSpell.school,
              verbalTrigger: firstPreparedSpell.verbalTrigger ?? '',
              incantations: firstPreparedSpell.incantations,
              charges: maxCharges
            };

            preparedSpells = [...filteredSpells, newPreparedSpell];
          }
        }

        const newPreparedSpells = JSON.stringify(preparedSpells);

        await db.query(upsertPreparedSpells, [accountId, serverId, newPreparedSpells]);
      }
    })
  );
};
