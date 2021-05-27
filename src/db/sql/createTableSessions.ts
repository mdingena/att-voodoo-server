const createTableSessions = `
CREATE TABLE sessions (
  access_token varchar(2048) primary key,
  account_id integer unique not null
);

CREATE UNIQUE INDEX ON sessions (account_id);
`;
