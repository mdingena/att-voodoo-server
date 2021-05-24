import { hashes } from './components';
import { numberToBinaryUInt, numberToBinary, BinaryReader, binaryToNumber } from '../utils';

export const HASH = hashes.NetworkRigidbody;
export const VERSION = 1;

const HASH_BITS = numberToBinaryUInt(HASH);

export type Options = {
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
};

export const decode = (readBinary: BinaryReader): Options => ({
  position: {
    x: binaryToNumber(readBinary(32)),
    y: binaryToNumber(readBinary(32)),
    z: binaryToNumber(readBinary(32))
  },
  rotation: {
    x: binaryToNumber(readBinary(32)),
    y: binaryToNumber(readBinary(32)),
    z: binaryToNumber(readBinary(32)),
    w: binaryToNumber(readBinary(32))
  },
  isKinematic: Boolean(readBinary(1)),
  isServerSleeping: Boolean(readBinary(1)),
  velocity: {
    x: binaryToNumber(readBinary(32)),
    y: binaryToNumber(readBinary(32)),
    z: binaryToNumber(readBinary(32))
  },
  angularVelocity: {
    x: binaryToNumber(readBinary(32)),
    y: binaryToNumber(readBinary(32)),
    z: binaryToNumber(readBinary(32))
  }
});

export const encode = ({
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0, w: 1 },
  isKinematic = false,
  isServerSleeping = false,
  velocity = { x: 0, y: 0, z: 0 },
  angularVelocity = { x: 0, y: 0, z: 0 }
}: Options): string => {
  const positionBits = [numberToBinary(position.x), numberToBinary(position.y), numberToBinary(position.z)].join('');

  const rotationBits = [
    numberToBinary(rotation.x),
    numberToBinary(rotation.y),
    numberToBinary(rotation.z),
    numberToBinary(rotation.w)
  ].join('');

  const isKinematicBit = Number(isKinematic).toString();

  const isServerSleepingBit = Number(isServerSleeping).toString();

  const velocityBits = [numberToBinary(velocity.x), numberToBinary(velocity.y), numberToBinary(velocity.z)].join('');

  const angularVelocityBits = [
    numberToBinary(angularVelocity.x),
    numberToBinary(angularVelocity.y),
    numberToBinary(angularVelocity.z)
  ].join('');

  const dataBits = [
    positionBits,
    rotationBits,
    isKinematicBit,
    isServerSleepingBit,
    velocityBits,
    angularVelocityBits
  ].join('');

  const sizeBits = numberToBinaryUInt(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
