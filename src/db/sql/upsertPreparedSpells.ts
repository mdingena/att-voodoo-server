export const upsertPreparedSpells = `
INSERT INTO
  prepared_spells ( account_id, prepared_spells )
  VALUES ( $1, $2 )
ON CONFLICT ( account_id )
DO UPDATE SET
prepared_spells = $2
;`;
