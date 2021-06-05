import { numberToBinaryUInt } from './numberToBinaryUInt';
import { signedIntegerToBinary } from './signedIntegerToBinary';
import { uIntToBinary } from './uIntToBinary';

export type BinaryWriter = {
  binary: (bits: string) => void;
  boolean: (bit: boolean) => void;
  uInt: (number: number) => void;
  float: (number: number) => void;
  int: (number: number) => void;
  flush: () => string;
};

export const createBinaryWriter = (): BinaryWriter => {
  let binary: string = '';

  return {
    binary: function (bits: string): void {
      binary += bits;
    },

    boolean: function (bit: boolean) {
      binary += Number(bit).toString();
    },

    uInt: function (number: number) {
      binary += uIntToBinary(number);
    },

    float: function (number: number) {
      binary += numberToBinaryUInt(number);
    },

    int: function (number: number) {
      binary += signedIntegerToBinary(number);
    },

    flush: function () {
      const result = binary;
      binary = '';

      return result;
    }
  };
};
