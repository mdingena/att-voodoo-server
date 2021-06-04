import { BinaryReader } from '../utils';

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

export const decodePrefabObject = (reader: BinaryReader): PrefabObject => ({
  hash: reader.uInt(),
  px: reader.float(),
  py: reader.float(),
  pz: reader.float(),
  qx: reader.float(),
  qy: reader.float(),
  qz: reader.float(),
  qw: reader.float(),
  s: reader.float()
});
