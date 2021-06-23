export const selectExperience = `
SELECT
  upgrades,
  abjuration_xp_total,
  abjuration_xp_spent,
  conjuration_xp_total,
  conjuration_xp_spent,
  evocation_xp_total,
  evocation_xp_spent,
  transmutation_xp_total,
  transmutation_xp_spent
FROM
  player_skills
WHERE
  account_id = $1
  AND server_id = $2
;`;
