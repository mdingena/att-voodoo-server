import { ComponentHash } from '../ComponentHash';
import { BinaryReader, numberToBinary, uIntToBinary } from '../../utils';

export const HASH = ComponentHash.PickupDock;
export const VERSION = 2;

const HASH_BITS = uIntToBinary(HASH);

export type Component = {
  dockedTypeHash?: number;
  quantity?: number;
  childIndex?: number;
};

export const decode = (reader: BinaryReader): Component => ({
  dockedTypeHash: reader.uInt(),
  quantity: reader.int(),
  childIndex: reader.int()
});

export const encode = ({ dockedTypeHash = 0, quantity = 1, childIndex = 0 }: Component): string => {
  const dockedTypeHashBits = numberToBinary(dockedTypeHash);

  const quantityBits = numberToBinary(<number>quantity);

  const childIndexBits = numberToBinary(<number>childIndex);

  const dataBits = [dockedTypeHashBits, quantityBits, childIndexBits].join('');

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
