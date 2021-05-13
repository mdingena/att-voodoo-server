import { floatToUInt } from './floatToUInt';
import { numberToBinary } from './numberToBinary';

export const floatToBinary = (float: number): string => numberToBinary(floatToUInt(float));
