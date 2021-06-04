import { ComponentHash } from '../ComponentHash';
import { BinaryReader, numberToBinary } from '../../utils';

export const HASH = ComponentHash.StatManager;
export const VERSION = 2;

const HASH_BITS = numberToBinary(HASH).padStart(32, '0');

type Stat = null | {
  hash: number;
  baseFlat: number;
};

type TimedModifier = null | {
  hash: number;
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

type IndirectStatModifier = null | {
  hash: number;
  time: string;
  modifiers: IndirectModifierSaveData[];
};

export type Component = {
  stats?: Stat[];
  modifiers?: TimedModifier[];
  indirectStatModifiers?: IndirectStatModifier[];
};

export const decode = (reader: BinaryReader): Component => {
  /* Get stats array. */
  const statsLength = reader.uInt();
  const stats: Stat[] = [];
  for (let index = 0; index < statsLength; ++index) {
    /* Skip stat if is null. */
    const isNull = reader.boolean();
    if (isNull) {
      stats.push(null);
      continue;
    }

    stats.push({
      hash: reader.uInt(),
      baseFlat: reader.float()
    });
  }

  /* Get modifiers array. */
  const modifiersLength = reader.uInt();
  const modifiers: TimedModifier[] = [];
  for (let index = 0; index < modifiersLength; ++index) {
    /* Skip modifier if is null. */
    const isNull = reader.boolean();
    if (isNull) {
      modifiers.push(null);
      continue;
    }

    modifiers.push({
      hash: reader.uInt(),
      value: reader.float(),
      isMultiplier: reader.boolean(),
      time: reader.binary(64)
    });
  }

  /* Get indirect stat modifiers array. */
  const indirectStatModifiersLength = reader.uInt();
  const indirectStatModifiers: IndirectStatModifier[] = [];
  for (let index = 0; index < indirectStatModifiersLength; ++index) {
    /* Skip indirectStatModifier if is null. */
    const isNull = reader.boolean();
    if (isNull) {
      indirectStatModifiers.push(null);
      continue;
    }

    const hash = reader.uInt();
    const time = reader.binary(64);

    /* Get indirect modifier save data array. */
    const indirectModifiersSaveDataLength = reader.uInt();
    const indirectModifiersSaveData: IndirectModifierSaveData[] = [];
    for (let index = 0; index < indirectModifiersSaveDataLength; ++index) {
      indirectModifiersSaveData.push({
        valueOverDurationHash: reader.uInt(),
        baseValue: reader.float(),
        duration: reader.uInt(),
        tick: reader.uInt()
      });
    }

    indirectStatModifiers.push({
      hash,
      time,
      modifiers: indirectModifiersSaveData
    });
  }

  return { stats, modifiers, indirectStatModifiers };
};

export const encode = ({ stats = [], modifiers = [], indirectStatModifiers = [] }: Component): string => {
  const dataBits = '';

  const sizeBits = numberToBinary(dataBits.length).padStart(32, '0');

  return [HASH_BITS, sizeBits, dataBits].join('');
};
