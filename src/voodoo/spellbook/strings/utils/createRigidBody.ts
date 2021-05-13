import { SpawnOptions } from '..';
import { numberToBinary } from './numberToBinary';
import { floatToBinary } from './floatToBinary';

const HASH = 2290978823;
const HASH_BITS = numberToBinary(HASH);

export const createRigidBody = ({ transform, isKinematic, isServerSleeping }: SpawnOptions): string => {
  const positionBits = [
    floatToBinary(transform.px ?? 0),
    floatToBinary(transform.py ?? 0),
    floatToBinary(transform.pz ?? 0)
  ].join('');

  const quaternionBits = [
    floatToBinary(transform.qx ?? 0),
    floatToBinary(transform.qy ?? 0),
    floatToBinary(transform.qz ?? 0),
    floatToBinary(transform.qw ?? 1)
  ].join('');

  const isKinematicBit = isKinematic ? '0' : Number(isKinematic).toString();

  const isServerSleepingBit = isServerSleeping ? '0' : Number(isServerSleeping).toString();

  const velocityBits = [
    floatToBinary(transform.vx ?? 0),
    floatToBinary(transform.vy ?? 0),
    floatToBinary(transform.vz ?? 0)
  ].join('');

  const angularVelocityBits = [
    floatToBinary(transform.avx ?? 0),
    floatToBinary(transform.avy ?? 0),
    floatToBinary(transform.avz ?? 0)
  ].join('');

  const dataBits = [
    positionBits,
    quaternionBits,
    isKinematicBit,
    isServerSleepingBit,
    velocityBits,
    angularVelocityBits
  ].join('');

  const sizeBits = numberToBinary(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
