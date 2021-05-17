import { Transform } from '../..';
import { numberToBinary, floatToBinary } from '../../utils';

export const HASH = 2290978823;
export const VERSION = [HASH, 1].join(',');

const HASH_BITS = numberToBinary(HASH);

export interface Options {
  transform: Transform;
  isKinematic?: boolean;
  isServerSleeping?: boolean;
}

export const encode = ({ transform, isKinematic = false, isServerSleeping = false }: Options): string => {
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

  const isKinematicBit = Number(isKinematic).toString();

  const isServerSleepingBit = Number(isServerSleeping).toString();

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
