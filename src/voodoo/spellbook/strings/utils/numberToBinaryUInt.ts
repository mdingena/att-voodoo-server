import { numberToUInt } from './numberToUInt';
import { numberToBinary } from './numberToBinary';

export const numberToBinaryUInt = (number: number): string => numberToBinary(numberToUInt(number)).padStart(32, '0');
