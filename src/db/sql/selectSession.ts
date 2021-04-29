export const selectSession = `
SELECT
  account_id
FROM
  sessions
WHERE
  access_token = $1
;`;
