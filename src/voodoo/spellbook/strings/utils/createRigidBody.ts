import { SpawnOptions } from '..';
import { floatToBits } from './floatToBits';

export const createRigidBody = ({ transform, isKinematic, isServerSleeping }: SpawnOptions) => {
  const positionBits = [
    floatToBits(transform.px ?? 0),
    floatToBits(transform.py ?? 0),
    floatToBits(transform.pz ?? 0)
  ].join('');

  const quaternionBits = [
    floatToBits(transform.qx ?? 0),
    floatToBits(transform.qy ?? 0),
    floatToBits(transform.qz ?? 0),
    floatToBits(transform.qw ?? 1)
  ].join('');

  const isKinematicBit = isKinematic ? '0' : Number(isKinematic).toString();

  const isServerSleepingBit = isServerSleeping ? '0' : Number(isServerSleeping).toString();

  const velocityBits = [
    floatToBits(transform.vx ?? 0),
    floatToBits(transform.vy ?? 0),
    floatToBits(transform.vz ?? 0)
  ].join('');

  const angularVelocityBits = [
    floatToBits(transform.avx ?? 0),
    floatToBits(transform.avy ?? 0),
    floatToBits(transform.avz ?? 0)
  ].join('');

  const rigidBodyBits = [
    positionBits,
    quaternionBits,
    isKinematicBit,
    isServerSleepingBit,
    velocityBits,
    angularVelocityBits
  ].join('');

  /* Pad 418 bits with trailing zeroes to make it % 32. */
  // const paddedRigidBodyBits = rigidBodyBits.padEnd(
  //   rigidBodyBits.length + (32 - (rigidBodyBits.length % 32 === 0 ? 32 : rigidBodyBits.length % 32)),
  //   '0'
  // );
  const paddedRigidBodyBits = rigidBodyBits.padEnd(448, '0');

  return paddedRigidBodyBits;
};
