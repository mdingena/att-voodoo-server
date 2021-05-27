const createTableHeartbeats = `
CREATE TABLE heartbeats (
  account_id integer primary key,
  updated_at timestamp not null
);`;
