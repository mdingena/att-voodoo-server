import { numberToBinaryUInt, numberToBinary } from '../utils';

export interface PrefabObjectOptions {
  hash: number;
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
  scale?: number;
}

export const encodePrefabObject = ({
  hash,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0, w: 1 },
  scale = 1
}: PrefabObjectOptions): string => {
  const hashBits = numberToBinaryUInt(hash);

  const positionBits = [numberToBinary(position.x), numberToBinary(position.y), numberToBinary(position.z)].join('');

  const rotationBits = [
    numberToBinary(rotation.x),
    numberToBinary(rotation.y),
    numberToBinary(rotation.z),
    numberToBinary(rotation.w)
  ].join('');

  const scaleBits = numberToBinary(scale);

  return [hashBits, positionBits, rotationBits, scaleBits].join('');
};
