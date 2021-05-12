import { floatToUInt } from './floatToUInt';

export const floatToBits = (float: number): string => floatToUInt(float).toString(2).padStart(32, '0');
