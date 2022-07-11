export const selectUser = `
SELECT
  dexterity
FROM
  users
WHERE
  account_id = $1
;`;
