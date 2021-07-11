import { numberToBinary } from './numberToBinary';

export const numberToBinaryULong = (number: number): string => {
  const binary = numberToBinary(number).padStart(64, '0');

  return `${binary.slice(32)}${binary.slice(0, 32)}`;
};
