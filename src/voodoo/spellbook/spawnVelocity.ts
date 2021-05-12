export const spawnVelocity = (dx: number, dy: number, dz: number, v: number) => ({
  vx: dx * v,
  vy: dy * v,
  vz: dz * v,
  avx: 0,
  avy: 0,
  avz: 0
});
