export const upsertPreparedSpells = `
INSERT INTO
  prepared_spells ( account_id, server_id, prepared_spells )
  VALUES ( $1, $2, $3 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  prepared_spells = $3
;`;
