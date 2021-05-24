import { hashes } from '../components';
import { BinaryReader, binaryToNumber, numberToBinary, uIntToNumber } from '../../utils';

export const HASH = hashes.StatManager;
export const VERSION = 2;

const HASH_BITS = numberToBinary(HASH).padStart(32, '0');

type Stat = {
  hash: number;
  unknownBoolean: boolean;
  baseFlat: number;
};

type TimedModifier = {
  hash: number;
  unknownBoolean: boolean;
  value: number;
  isMultiplier: boolean;
  time: string;
};

type IndirectModifierSaveData = {
  valueOverDurationHash: number;
  baseValue: number;
  duration: number;
  tick: number;
};

type IndirectStatModifier = {
  hash: number;
  unknownBoolean: boolean;
  time: string;
  modifiers: IndirectModifierSaveData[];
};

export type Properties = {
  stats?: Stat[];
  modifiers?: TimedModifier[];
  indirectStatModifiers?: IndirectStatModifier[];
};

export const decode = (readBinary: BinaryReader): Properties => {
  /* Get stats array. */
  const statsLength = binaryToNumber(readBinary(32));
  const stats: Stat[] = [];
  for (let index = 0; index < statsLength; ++index) {
    stats.push({
      hash: binaryToNumber(readBinary(32)),
      unknownBoolean: Boolean(readBinary(1)),
      baseFlat: uIntToNumber(binaryToNumber(readBinary(32)))
    });
  }

  /* Get modifiers array. */
  const modifiersLength = binaryToNumber(readBinary(32));
  const modifiers: TimedModifier[] = [];
  for (let index = 0; index < modifiersLength; ++index) {
    modifiers.push({
      hash: binaryToNumber(readBinary(32)),
      unknownBoolean: Boolean(readBinary(1)),
      value: uIntToNumber(binaryToNumber(readBinary(32))),
      isMultiplier: Boolean(readBinary(1)),
      time: readBinary(64)
    });
  }

  /* Get indirect stat modifiers array. */
  const indirectStatModifiersLength = binaryToNumber(readBinary(32));
  const indirectStatModifiers: IndirectStatModifier[] = [];
  for (let index = 0; index < indirectStatModifiersLength; ++index) {
    const hash = binaryToNumber(readBinary(32));
    const unknownBoolean = Boolean(readBinary(1));
    const time = readBinary(64);

    /* Get indirect modifier save data array. */
    const indirectModifiersSaveDataLength = binaryToNumber(readBinary(32));
    const indirectModifiersSaveData: IndirectModifierSaveData[] = [];
    for (let index = 0; index < indirectModifiersSaveDataLength; ++index) {
      indirectModifiersSaveData.push({
        valueOverDurationHash: binaryToNumber(readBinary(32)),
        baseValue: uIntToNumber(binaryToNumber(readBinary(32))),
        duration: binaryToNumber(readBinary(32)),
        tick: binaryToNumber(readBinary(32))
      });
    }

    indirectStatModifiers.push({
      hash,
      unknownBoolean,
      time,
      modifiers: indirectModifiersSaveData
    });
  }

  return { stats, modifiers, indirectStatModifiers };
};

export const encode = ({ stats = [], modifiers = [], indirectStatModifiers = [] }: Properties): string => {
  const dataBits = '';

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
