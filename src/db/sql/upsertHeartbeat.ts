export const upsertHeartbeat = `
INSERT INTO 
  heartbeats (account_id, updated_at)
  SELECT
    s.account_id,
    NOW()
  FROM sessions as s
  WHERE s.access_token = $1
ON CONFLICT ( account_id )
DO UPDATE SET
  updated_at = NOW()
;`;
