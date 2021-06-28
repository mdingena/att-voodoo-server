type UpgradeConfig = {
  isStepFunction: boolean;
  min: number;
  max: number;
  constant: number;
};

type SpellUpgrades = { [key: string]: number };

type UpgradeConfigs = { [key: string]: UpgradeConfig };

const upgradedAttribute = (
  upgrades: number | undefined,
  { isStepFunction, min, max, constant }: UpgradeConfig
): number => {
  const attribute = max - (max - min) * Math.exp(-constant * (upgrades ?? 0));
  return isStepFunction ? Math.round(attribute) : attribute;
};

export const xpGain = (incantations: number): number => {
  const xp = -10 + (incantations - 1) * 20;

  return Math.max(0, xp);
};

export const getSpellAttributes = (spellUpgrades: SpellUpgrades, configs: UpgradeConfigs): SpellUpgrades =>
  Object.keys(configs).reduce(
    (sum, key) => ({ ...sum, [key]: upgradedAttribute(spellUpgrades[key], configs[key]) }),
    {}
  );
