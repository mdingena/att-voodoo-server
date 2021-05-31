const createTablePreparedSpells = `
CREATE TABLE prepared_spells (
  account_id integer primary key,
  prepared_spells json not null
);`;
