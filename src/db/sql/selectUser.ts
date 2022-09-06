export const selectUser = `
SELECT
  dexterity,
  patreon_tier
FROM
  users
WHERE
  account_id = $1
;`;
