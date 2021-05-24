import { hashes } from '../components';
import { BinaryReader, binaryToNumber, numberToBinaryUInt, numberToBinary, uIntToNumber } from '../../utils';

export const HASH = hashes.NetworkRigidbody;
export const VERSION = 1;

const HASH_BITS = numberToBinary(HASH).padStart(32, '0');

export type Properties = {
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

export const decode = (readBinary: BinaryReader): Properties => ({
  position: {
    x: uIntToNumber(binaryToNumber(readBinary(32))),
    y: uIntToNumber(binaryToNumber(readBinary(32))),
    z: uIntToNumber(binaryToNumber(readBinary(32)))
  },
  rotation: {
    x: uIntToNumber(binaryToNumber(readBinary(32))),
    y: uIntToNumber(binaryToNumber(readBinary(32))),
    z: uIntToNumber(binaryToNumber(readBinary(32))),
    w: uIntToNumber(binaryToNumber(readBinary(32)))
  },
  isKinematic: Boolean(readBinary(1)),
  isServerSleeping: Boolean(readBinary(1)),
  velocity: {
    x: uIntToNumber(binaryToNumber(readBinary(32))),
    y: uIntToNumber(binaryToNumber(readBinary(32))),
    z: uIntToNumber(binaryToNumber(readBinary(32)))
  },
  angularVelocity: {
    x: uIntToNumber(binaryToNumber(readBinary(32))),
    y: uIntToNumber(binaryToNumber(readBinary(32))),
    z: uIntToNumber(binaryToNumber(readBinary(32)))
  }
});

export const encode = ({
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0, w: 1 },
  isKinematic = false,
  isServerSleeping = false,
  velocity = { x: 0, y: 0, z: 0 },
  angularVelocity = { x: 0, y: 0, z: 0 }
}: Properties): string => {
  const positionBits = [
    numberToBinaryUInt(position.x),
    numberToBinaryUInt(position.y),
    numberToBinaryUInt(position.z)
  ].join('');

  const rotationBits = [
    numberToBinaryUInt(rotation.x),
    numberToBinaryUInt(rotation.y),
    numberToBinaryUInt(rotation.z),
    numberToBinaryUInt(rotation.w)
  ].join('');

  const isKinematicBit = Number(isKinematic).toString();

  const isServerSleepingBit = Number(isServerSleeping).toString();

  const velocityBits = [
    numberToBinaryUInt(velocity.x),
    numberToBinaryUInt(velocity.y),
    numberToBinaryUInt(velocity.z)
  ].join('');

  const angularVelocityBits = [
    numberToBinaryUInt(angularVelocity.x),
    numberToBinaryUInt(angularVelocity.y),
    numberToBinaryUInt(angularVelocity.z)
  ].join('');

  const dataBits = [
    positionBits,
    rotationBits,
    isKinematicBit,
    isServerSleepingBit,
    velocityBits,
    angularVelocityBits
  ].join('');

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
