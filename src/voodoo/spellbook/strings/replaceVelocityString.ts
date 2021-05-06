import { packFloat } from './packFloat';
import { Transform } from './tag';

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
    packFloat(transform.vx ?? 0)
      .toString(2)
      .padStart(32, '0'),
    packFloat(transform.vy ?? 0)
      .toString(2)
      .padStart(32, '0'),
    packFloat(transform.vz ?? 0)
      .toString(2)
      .padStart(32, '0')
  ].join('');

  const angularVelocity = [
    packFloat(transform.avx ?? 0)
      .toString(2)
      .padStart(32, '0'),
    packFloat(transform.avy ?? 0)
      .toString(2)
      .padStart(32, '0'),
    packFloat(transform.avz ?? 0)
      .toString(2)
      .padStart(32, '0')
  ].join('');

  const newBits = `${isKinematicBit}${isServerSleepingBit}${velocity}${angularVelocity}${trailingBits}`;

  const newIntegers = newBits.match(/.{32}/g)?.map(integer => Number(`0b${integer}`)) || [];

  return `${newIntegers.join(',')}`;
};
