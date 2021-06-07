import { ComponentHash } from '../../ComponentHash';
import { BinaryReader, createBinaryWriter } from '../../utils';

export const HASH = ComponentHash.BasicDecay;
export const VERSION = 3;

export type Component = {
  isDisabled?: boolean;
  timelineEntry?: string; // 64 bits
};

export const decode = (reader: BinaryReader): Component => ({
  isDisabled: reader.boolean(),
  timelineEntry: reader.binary(64)
});

export const encode = ({ isDisabled = true, timelineEntry = '0'.repeat(64) }: Component): string => {
  const writer = createBinaryWriter();

  /* Component hash. */
  writer.uInt(ComponentHash.BasicDecay);
  const hashBits = writer.flush();

  /* Component data. */
  writer.boolean(isDisabled);
  writer.binary(timelineEntry);
  const dataBits = writer.flush();

  /* Component data length. */
  writer.uInt(dataBits.length);
  const sizeBits = writer.flush();

  /* Return encoded component. */
  writer.binary(hashBits);
  writer.binary(sizeBits);
  writer.binary(dataBits);

  return writer.flush();
};
