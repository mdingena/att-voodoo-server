import ieee754 from 'ieee754';

/**
 * Unpack a float packed as IEEE754 integer.
 * Thanks to https://github.com/edencomputing/attprefabulator/
 * @argument packedFloat
 * @returns {number}
 */
export const unpackFloat = (packedFloat: number) => {
  const buffer = Buffer.from(new Uint8Array(4));

  buffer.writeUInt32LE(packedFloat);

  const unpackedFloat = ieee754.read(buffer, 0, true, 23, 4);

  return unpackedFloat;
};
