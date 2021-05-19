type Vector3 = { x: number; y: number; z: number };

export const spawnVelocity = (direction: Vector3, velocity: number): Vector3 => ({
  x: direction.x * velocity,
  y: direction.y * velocity,
  z: direction.z * velocity
});
