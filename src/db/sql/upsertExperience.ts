export const upsertExperience = (column: string) => `
INSERT INTO
  experience ( account_id, server_id, updated_at, ${column} )
  VALUES ( $1, $2, NOW(), $3 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  updated_at = NOW(),
  ${column} = experience.${column} + $3
;`;
