import { BinaryReader, componentMap, uIntToNumber } from '../utils';

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
  const px = Number(`0b${pxBits}`);
  const py = Number(`0b${pyBits}`);
  const pz = Number(`0b${pzBits}`);
  const qx = Number(`0b${qxBits}`);
  const qy = Number(`0b${qyBits}`);
  const qz = Number(`0b${qzBits}`);
  const qw = Number(`0b${qwBits}`);
  const s = Number(`0b${sBits}`);

  return {
    name: componentMap[hash],
    hash,
    px: uIntToNumber(px),
    py: uIntToNumber(py),
    pz: uIntToNumber(pz),
    qx: uIntToNumber(qx),
    qy: uIntToNumber(qy),
    qz: uIntToNumber(qz),
    qw: uIntToNumber(qw),
    s: uIntToNumber(s)
  };
};
