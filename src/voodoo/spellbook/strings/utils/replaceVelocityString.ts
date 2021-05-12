import { Transform } from '..';
import { floatToBits } from './floatToBits';
import { bitsToUInts } from './bitsToUInts';

type StringOptions = {
  string: string;
  transform: Transform;
  isKinematic?: boolean;
  isServerSleeping?: boolean;
};

export const replaceVelocityString = ({ string, transform, isKinematic, isServerSleeping }: StringOptions) => {
  const integers = string.split(',');
  const bits = integers.reduce((bits, integer) => `${bits}${Number(integer).toString(2).padStart(32, '0')}`, '');

  const isKinematicBit = typeof isKinematic === 'undefined' ? bits.substr(0, 1) : Number(isKinematic).toString();
  const isServerSleepingBit =
    typeof isServerSleeping === 'undefined' ? bits.substr(1, 1) : Number(isServerSleeping).toString();
  const trailingBitsPosition = 2 + 32 * 6; // leadingBits + velocity * 3 + angularVelocity * 3
  const trailingBits = bits.substr(trailingBitsPosition);

  const velocity = [
    floatToBits(transform.vx ?? 0),
    floatToBits(transform.vy ?? 0),
    floatToBits(transform.vz ?? 0)
  ].join('');

  const angularVelocity = [
    floatToBits(transform.avx ?? 0),
    floatToBits(transform.avy ?? 0),
    floatToBits(transform.avz ?? 0)
  ].join('');

  const newBits = [isKinematicBit, isServerSleepingBit, velocity, angularVelocity, trailingBits].join('');

  const newIntegers = bitsToUInts(newBits);

  return `${newIntegers.join(',')}`;
};
