export const selectUser = `
SELECT
  dexterity,
  patreon_tier,
  pocket_dimension
FROM
  users
WHERE
  account_id = $1
;`;
