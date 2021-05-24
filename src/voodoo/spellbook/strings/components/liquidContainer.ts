import { hashes } from './components';
import { numberToBinaryUInt, numberToBinary, binaryToNumber, BinaryReader } from '../utils';

export const HASH = hashes.LiquidContainer;
export const VERSION = 1;

const HASH_BITS = numberToBinaryUInt(HASH);

export type Options = {
  canAddTo?: boolean;
  canRemoveFrom?: boolean;
  contentLevel?: number;
  hasContent?: boolean;
  isCustom?: boolean;
};

export const decode = (readBinary: BinaryReader): Options => ({
  canAddTo: Boolean(readBinary(1)),
  canRemoveFrom: Boolean(readBinary(1)),
  contentLevel: binaryToNumber(readBinary(32)),
  hasContent: Boolean(readBinary(1)),
  isCustom: Boolean(readBinary(1))
});

export const encode = ({
  canAddTo = true,
  canRemoveFrom = true,
  contentLevel = 0,
  hasContent = !!contentLevel,
  isCustom = false
}: Options): string => {
  const canAddToBit = Number(canAddTo).toString();

  const canRemoveFromBit = Number(canRemoveFrom).toString();

  const contentLevelBit = numberToBinary(contentLevel);

  const hasContentBit = Number(hasContent).toString();

  const isCustomBit = Number(isCustom).toString();

  const dataBits = [canAddToBit, canRemoveFromBit, contentLevelBit, hasContentBit, isCustomBit].join('');

  const sizeBits = numberToBinaryUInt(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
