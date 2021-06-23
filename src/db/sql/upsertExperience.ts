export const upsertExperience = (column: string) => `
INSERT INTO
  experience ( account_id, server_id, ${column} )
  VALUES ( $1, $2, $3 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  ${column} = experience.${column} + $3
;`;
