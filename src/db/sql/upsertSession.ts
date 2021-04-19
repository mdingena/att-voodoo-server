export const upsertSession = `
INSERT INTO
  sessions ( account_id, access_token )
  VALUES ( $1, $2 )
ON CONFLICT ( account_id )
DO UPDATE SET
  access_token = $2
;`;
