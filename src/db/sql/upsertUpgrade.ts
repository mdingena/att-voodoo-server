export const upsertUpgrade = (column: string) => `
INSERT INTO
  experience ( account_id, server_id, ${column}, upgrades )
  VALUES ( $1, $2, $3, $4 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  ${column} = experience.${column} + $3,
  upgrades = $4
;`;
