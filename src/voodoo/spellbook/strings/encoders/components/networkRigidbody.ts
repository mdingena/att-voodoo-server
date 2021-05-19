import { numberToBinary, floatToBinary } from '../../utils';

export const HASH = 2290978823;
export const VERSION = 1;

const HASH_BITS = numberToBinary(HASH);

export interface Options {
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  isKinematic?: boolean;
  isServerSleeping?: boolean;
  velocity?: {
    x: number;
    y: number;
    z: number;
  };
  angularVelocity?: {
    x: number;
    y: number;
    z: number;
  };
}

export const encode = ({
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0, w: 1 },
  isKinematic = false,
  isServerSleeping = false,
  velocity = { x: 0, y: 0, z: 0 },
  angularVelocity = { x: 0, y: 0, z: 0 }
}: Options): string => {
  const positionBits = [floatToBinary(position.x), floatToBinary(position.y ?? 0), floatToBinary(position.z ?? 0)].join(
    ''
  );

  const rotationBits = [
    floatToBinary(rotation.x),
    floatToBinary(rotation.y),
    floatToBinary(rotation.z),
    floatToBinary(rotation.w)
  ].join('');

  const isKinematicBit = Number(isKinematic).toString();

  const isServerSleepingBit = Number(isServerSleeping).toString();

  const velocityBits = [floatToBinary(velocity.x), floatToBinary(velocity.y), floatToBinary(velocity.z)].join('');

  const angularVelocityBits = [
    floatToBinary(angularVelocity.x),
    floatToBinary(angularVelocity.y),
    floatToBinary(angularVelocity.z)
  ].join('');

  const dataBits = [
    positionBits,
    rotationBits,
    isKinematicBit,
    isServerSleepingBit,
    velocityBits,
    angularVelocityBits
  ].join('');

  const sizeBits = numberToBinary(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
