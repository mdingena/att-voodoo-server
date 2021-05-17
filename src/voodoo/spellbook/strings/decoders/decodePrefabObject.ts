import { BinaryReader, componentMap } from '../utils';

export type PrefabObject = {
  name: string | undefined;
  hash: number;
  px: number;
  py: number;
  pz: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
  s: number;
};

export const decodePrefabObject = (readBinary: BinaryReader): PrefabObject => {
  const hashBits = readBinary(32);
  const pxBits = readBinary(32);
  const pyBits = readBinary(32);
  const pzBits = readBinary(32);
  const qxBits = readBinary(32);
  const qyBits = readBinary(32);
  const qzBits = readBinary(32);
  const qwBits = readBinary(32);
  const sBits = readBinary(32);

  const hash = Number(`0b${hashBits}`);

  return {
    name: componentMap[hash],
    hash,
    px: Number(`0b${pxBits}`),
    py: Number(`0b${pyBits}`),
    pz: Number(`0b${pzBits}`),
    qx: Number(`0b${qxBits}`),
    qy: Number(`0b${qyBits}`),
    qz: Number(`0b${qzBits}`),
    qw: Number(`0b${qwBits}`),
    s: Number(`0b${sBits}`)
  };
};
