export const upsertUserSetting = (setting: string) => `
INSERT INTO
  users ( account_id, ${setting} )
  VALUES ( $1, $2 )
ON CONFLICT ( account_id )
DO UPDATE SET
  ${setting} = $2
;`;
