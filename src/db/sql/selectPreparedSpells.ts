export const selectPreparedSpells = `
SELECT
  prepared_spells
FROM
  prepared_spells
WHERE
  account_id = $1
  AND server_id = $2
;`;
