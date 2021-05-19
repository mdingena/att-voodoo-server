type Index = { current: number };

export type BinaryReader = (bits: number) => string;

export const createBinaryReader = (binary: string) => {
  const index: Index = { current: 0 };
  const size = binary.length;

  return (bits: number): string => {
    if (index.current + bits > size) {
      throw Error(`Cannot read ${bits} bits from binary at index ${index.current}. Binary is only ${size} bits.`);
    }

    return binary.slice(index.current, (index.current += bits));
  };
};
