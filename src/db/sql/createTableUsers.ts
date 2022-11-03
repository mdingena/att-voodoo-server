const createTableUsers = `
CREATE TABLE users (
  account_id INTEGER PRIMARY KEY,
  dexterity TEXT DEFAULT 'rightHand/palm' NOT NULL,
  patreon_tier INTEGER DEFAULT 0 NOT NULL,
  pocket_dimension TEXT DEFAULT '{}' NOT NULL
);
`;
