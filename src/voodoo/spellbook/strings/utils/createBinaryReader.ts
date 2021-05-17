type Index = { size: number; current: number };

export type BinaryReader = (bits: number) => string;

export const createBinaryReader = (binary: string, size: number) => {
  const index: Index = { size, current: 0 };

  return (bits: number): string => {
    if (index.current + bits >= index.size) {
      throw Error(`Cannot read ${bits} bits from binary at index ${index.current}. Binary is only ${index.size} bits.`);
    }

    return binary.slice(index.current, (index.current += bits));
  };
};
