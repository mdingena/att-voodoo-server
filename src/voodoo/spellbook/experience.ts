export const xpGain = (incantations: number): number => {
  const xp = -10 + (incantations - 1) * 20;

  return Math.max(0, xp);
};
