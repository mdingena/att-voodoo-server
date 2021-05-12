import { packFloat } from './packFloat';

export const floatToBits = (float: number): string => packFloat(float).toString(2).padStart(32, '0');
