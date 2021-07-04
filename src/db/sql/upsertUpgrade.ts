export const upsertUpgrade = (column: string) => `
INSERT INTO
  experience ( account_id, server_id, updated_at, ${column}, upgrades )
  VALUES ( $1, $2, NOW(), $3, $4 )
ON CONFLICT ( account_id, server_id )
DO UPDATE SET
  updated_at = NOW(),
  ${column} = experience.${column} + $3,
  upgrades = $4
;`;
