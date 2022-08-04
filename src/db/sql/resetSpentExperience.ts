export const resetSpentExperience = `
UPDATE 
  experience
SET
  upgrades = '{}',
  free_resets = experience.free_resets - 1,
  abjuration_xp_spent = 0,
  conjuration_xp_spent = 0,
  evocation_xp_spent = 0,
  transmutation_xp_spent = 0
WHERE
  account_id = $1
  AND server_id = $2
;`;
