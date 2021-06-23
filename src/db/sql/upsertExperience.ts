export const upsertExperience = `
INSERT INTO
  player_skills ( account_id, server_id, $3 )
  VALUES ( $1, $2, $4 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  $3 = player_skills.$3 + $4
;`;
