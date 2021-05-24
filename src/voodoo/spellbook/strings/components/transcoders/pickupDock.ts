import { hashes } from '../components';
import { BinaryReader, binaryToNumber, binaryToSignedNumber, numberToBinary } from '../../utils';

export const HASH = hashes.PickupDock;
export const VERSION = 2;

const HASH_BITS = numberToBinary(HASH).padStart(32, '0');

export type Properties = {
  dockedTypeHash?: number;
  quantity?: number | string;
  childIndex?: number | string;
};

export const decode = (readBinary: BinaryReader): Properties => ({
  dockedTypeHash: binaryToNumber(readBinary(32)),
  quantity: binaryToSignedNumber(readBinary(32)),
  childIndex: binaryToSignedNumber(readBinary(32))
});

export const encode = ({ dockedTypeHash = 0, quantity = 1, childIndex = 0 }: Properties): string => {
  const dockedTypeHashBits = numberToBinary(dockedTypeHash);

  const quantityBits = numberToBinary(<number>quantity);

  const childIndexBits = numberToBinary(<number>childIndex);

  const dataBits = [dockedTypeHashBits, quantityBits, childIndexBits].join('');

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
