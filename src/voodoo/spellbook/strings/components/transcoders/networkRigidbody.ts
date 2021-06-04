import { hashes } from '../components';
import { BinaryReader, numberToBinaryUInt, numberToBinary } from '../../utils';

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

export const decode = (reader: BinaryReader): Properties => ({
  position: {
    x: reader.float(),
    y: reader.float(),
    z: reader.float()
  },
  rotation: {
    x: reader.float(),
    y: reader.float(),
    z: reader.float(),
    w: reader.float()
  },
  isKinematic: reader.boolean(),
  isServerSleeping: reader.boolean(),
  velocity: {
    x: reader.float(),
    y: reader.float(),
    z: reader.float()
  },
  angularVelocity: {
    x: reader.float(),
    y: reader.float(),
    z: reader.float()
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
