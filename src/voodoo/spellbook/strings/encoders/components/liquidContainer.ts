import { numberToBinary } from '../../utils';

export const HASH = 4179293747;
export const VERSION = 1;

const HASH_BITS = numberToBinary(HASH);

export interface Options {
  dataBits?: string;
}

export const encode = ({ dataBits = '' }: Options): string => {
  const sizeBits = numberToBinary(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
