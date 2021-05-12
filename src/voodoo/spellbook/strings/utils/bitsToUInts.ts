export const bitsToUInts = (bits: string): string[] =>
  bits.match(/.{32}/g)?.map(uint => Number(`0b${uint}`).toString()) ?? [];
