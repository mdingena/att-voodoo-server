const createTablePreparedSpells = `
CREATE TABLE prepared_spells (
  account_id integer not null,
  server_id integer not null,
  prepared_spells text not null
);

CREATE UNIQUE INDEX ON prepared_spells (account_id, server_id);
`;
