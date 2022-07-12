export const multiplyExperience = (multiplier: number) => `
UPDATE 
  experience
SET
  abjuration_xp_total = experience.abjuration_xp_total * ${multiplier},
  abjuration_xp_spent = 0,
  conjuration_xp_total = experience.conjuration_xp_total * ${multiplier},
  conjuration_xp_spent = 0,
  evocation_xp_total = experience.evocation_xp_total * ${multiplier},
  evocation_xp_spent = 0,
  transmutation_xp_total = experience.transmutation_xp_total * ${multiplier},
  transmutation_xp_spent = 0
WHERE
  account_id = $1
  AND server_id = $2
;`;
