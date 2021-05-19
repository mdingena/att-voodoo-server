import { numberToBinary, floatToBinary } from '../utils';

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
  const hashBits = numberToBinary(hash);

  const positionBits = [floatToBinary(position.x), floatToBinary(position.y), floatToBinary(position.z)].join('');

  const rotationBits = [
    floatToBinary(rotation.x),
    floatToBinary(rotation.y),
    floatToBinary(rotation.z),
    floatToBinary(rotation.w)
  ].join('');

  const scaleBits = floatToBinary(scale);

  return [hashBits, positionBits, rotationBits, scaleBits].join('');
};
