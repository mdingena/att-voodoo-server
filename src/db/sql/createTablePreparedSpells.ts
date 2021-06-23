const createTablePreparedSpells = `
CREATE TABLE prepared_spells (
  account_id INTEGER NOT NULL,
  server_id INTEGER NOT NULL,
  prepared_spells TEXT NOT NULL
);

CREATE UNIQUE INDEX ON prepared_spells (account_id, server_id);
`;
