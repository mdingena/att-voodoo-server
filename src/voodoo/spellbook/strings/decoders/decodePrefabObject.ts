import { BinaryReader, binaryToNumber, uIntToNumber } from '../utils';

export type PrefabObject = {
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

  const hash = binaryToNumber(hashBits);
  const px = binaryToNumber(pxBits);
  const py = binaryToNumber(pyBits);
  const pz = binaryToNumber(pzBits);
  const qx = binaryToNumber(qxBits);
  const qy = binaryToNumber(qyBits);
  const qz = binaryToNumber(qzBits);
  const qw = binaryToNumber(qwBits);
  const s = binaryToNumber(sBits);

  return {
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
