import { hashes } from '../components';
import { numberToBinary, binaryToSignedNumber, BinaryReader } from '../../utils';

export const HASH = hashes.LiquidContainer;
export const VERSION = 1;

const HASH_BITS = numberToBinary(HASH).padStart(32, '0');

export type Properties = {
  canAddTo?: boolean;
  canRemoveFrom?: boolean;
  contentLevel?: number;
  hasContent?: boolean;
  isCustom?: boolean;
};

export const decode = (readBinary: BinaryReader): Properties => ({
  canAddTo: Boolean(readBinary(1)),
  canRemoveFrom: Boolean(readBinary(1)),
  contentLevel: binaryToSignedNumber(readBinary(32)),
  hasContent: Boolean(readBinary(1)),
  isCustom: Boolean(readBinary(1))
});

export const encode = ({
  canAddTo = true,
  canRemoveFrom = true,
  contentLevel = 0,
  hasContent = !!contentLevel,
  isCustom = false
}: Properties): string => {
  const canAddToBit = Number(canAddTo).toString();

  const canRemoveFromBit = Number(canRemoveFrom).toString();

  const contentLevelBit = numberToBinary(contentLevel).padStart(32, '0');

  const hasContentBit = Number(hasContent).toString();

  const isCustomBit = Number(isCustom).toString();

  const dataBits = [canAddToBit, canRemoveFromBit, contentLevelBit, hasContentBit, isCustomBit].join('');

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
