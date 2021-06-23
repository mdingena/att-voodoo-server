const createTableExperience = `
CREATE TABLE experience (
  account_id INTEGER NOT NULL,
  server_id INTEGER NOT NULL,
  upgrades TEXT DEFAULT '{}' NOT NULL,
  abjuration_xp_total INTEGER DEFAULT 0 NOT NULL,
  abjuration_xp_spent INTEGER DEFAULT 0 NOT NULL,
  conjuration_xp_total INTEGER DEFAULT 0 NOT NULL,
  conjuration_xp_spent INTEGER DEFAULT 0 NOT NULL,
  evocation_xp_total INTEGER DEFAULT 0 NOT NULL,
  evocation_xp_spent INTEGER DEFAULT 0 NOT NULL,
  transmutation_xp_total INTEGER DEFAULT 0 NOT NULL,
  transmutation_xp_spent INTEGER DEFAULT 0 NOT NULL
);

CREATE UNIQUE INDEX ON experience (account_id, server_id);
`;
