import { ComponentHash } from '../ComponentHash';
import { BinaryReader, numberToBinaryUInt, signedIntegerToBinary, uIntToBinary, uIntToNumber } from '../../utils';

export const HASH = ComponentHash.LiquidContainer;
export const VERSION = 1;

const HASH_BITS = uIntToBinary(HASH);

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type Effect = null | {
  hash: number;
  strengthMultiplier: number;
};

type FoodChunk = number;

type CustomData = {
  color: Color;
  isConsumableThroughSkin: boolean;
  visualDataHash: number;
  effects: Effect[];
  foodChunks: FoodChunk[];
};

export type Component = {
  canAddTo?: boolean;
  canRemoveFrom?: boolean;
  contentLevel?: number;
  hasContent?: boolean;
  isCustom?: boolean;
  presetHash?: number;
  customData?: null | CustomData;
};

export const decode = (reader: BinaryReader): Component => {
  const result: Component = {
    canAddTo: reader.boolean(),
    canRemoveFrom: reader.boolean(),
    contentLevel: reader.int(),
    hasContent: reader.boolean(),
    isCustom: reader.boolean(),
    presetHash: reader.uInt()
  };

  /* Get custom data */
  const isNull = reader.boolean();
  if (isNull) {
    result.customData = null;
  } else {
    const customData = {
      color: {
        r: reader.float(),
        g: reader.float(),
        b: reader.float(),
        a: reader.float()
      },
      isConsumableThroughSkin: reader.boolean(),
      visualDataHash: reader.uInt()
    };

    /* Get the effects array. */
    const effectsLength = uIntToNumber(reader.uInt());
    const effects: Effect[] = [];
    for (let index = 0; index < effectsLength; ++index) {
      /* Skip effect if is null. */
      const isNull = reader.boolean();
      if (isNull) {
        effects.push(null);
        continue;
      }

      effects.push({
        hash: reader.uInt(),
        strengthMultiplier: reader.float()
      });
    }

    /* Get the food chunks array. */
    const foodChunksLength = uIntToNumber(reader.uInt());
    const foodChunks: FoodChunk[] = [];
    for (let index = 0; index < foodChunksLength; ++index) {
      foodChunks.push(reader.uInt());
    }

    /* Append custom data to result. */
    result.customData = {
      ...customData,
      effects,
      foodChunks
    };
  }

  return result;
};

export const encode = ({
  canAddTo = true,
  canRemoveFrom = true,
  contentLevel = 0,
  hasContent = !!contentLevel,
  isCustom = false,
  presetHash = 0,
  customData = null
}: Component): string => {
  const canAddToBit = Number(canAddTo).toString();

  const canRemoveFromBit = Number(canRemoveFrom).toString();

  const contentLevelBits = signedIntegerToBinary(Math.round(contentLevel));

  const hasContentBit = Number(hasContent).toString();

  const isCustomBit = Number(isCustom).toString();

  const presetHashBits = uIntToBinary(presetHash);

  let customDataBits: string;

  if (customData === null) {
    customDataBits = '1'; // isNull bit
  } else {
    const colorBits = [
      numberToBinaryUInt(customData.color.r),
      numberToBinaryUInt(customData.color.g),
      numberToBinaryUInt(customData.color.b),
      numberToBinaryUInt(customData.color.a)
    ].join('');

    const isConsumableThroughSkinBit = Number(customData.isConsumableThroughSkin).toString();

    const visualDataHashBits = uIntToBinary(customData.visualDataHash);

    const effectsLengthBits = numberToBinaryUInt(customData.effects.length);
    const effectsBits = customData.effects
      .map(effect => {
        if (effect === null) return '1';
        else
          return [
            '0', // isNull bit
            uIntToBinary(effect.hash),
            numberToBinaryUInt(effect.strengthMultiplier)
          ].join('');
      })
      .join('');

    const foodChunksLengthBits = numberToBinaryUInt(customData.foodChunks.length);
    const foodChunksBits = customData.foodChunks.map(foodChunk => uIntToBinary(foodChunk)).join('');

    customDataBits = [
      '0', // isNull bit
      colorBits,
      isConsumableThroughSkinBit,
      visualDataHashBits,
      effectsLengthBits,
      effectsBits,
      foodChunksLengthBits,
      foodChunksBits
    ].join('');
  }

  const dataBits = [
    canAddToBit,
    canRemoveFromBit,
    contentLevelBits,
    hasContentBit,
    isCustomBit,
    presetHashBits,
    customDataBits
  ].join('');

  const sizeBits = uIntToBinary(dataBits.length);

  return [HASH_BITS, sizeBits, dataBits].join('');
};
