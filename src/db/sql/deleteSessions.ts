export const deleteSessions = `
DELETE
FROM sessions s
USING heartbeats h
WHERE
  s.account_id = h.account_id
  AND h.updated_at < NOW() - INTERVAL '5 minutes'
;

DELETE
FROM heartbeats h
WHERE
  h.updated_at < NOW() - INTERVAL '5 minutes'
;`;
