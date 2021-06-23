export const upsertExperience = `
INSERT INTO
  experience ( account_id, server_id, $3 )
  VALUES ( $1, $2, $4 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  $3 = experience.$3 + $4
;`;
