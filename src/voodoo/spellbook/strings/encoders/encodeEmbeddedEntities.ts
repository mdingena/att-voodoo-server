import { EmbeddedEntities } from '../decoders';
import { createBinaryWriter } from '../utils/createBinaryWriter';
import { encodeComponents } from './encodeComponents';

const terminator = '0'.repeat(32);

export const encodeEmbeddedEntities = (entities: EmbeddedEntities = {}): string => {
  const writer = createBinaryWriter();
  let binary: string = '';

  for (const [key, value] of Object.entries(entities)) {
    const embeddedEntityHash = key as unknown as number;

    writer.uInt(embeddedEntityHash);
    const hashBits = writer.flush();

    writer.boolean(value.isAlive);

    if (value.isAlive) {
      const componentBits = encodeComponents(value.components);
      writer.binary(componentBits);
    }

    const dataBits = writer.flush();

    writer.uInt(dataBits.length);
    const sizeBits = writer.flush();

    writer.binary(hashBits);
    writer.binary(sizeBits);
    writer.binary(dataBits);

    binary += writer.flush();
  }

  return `${binary}${terminator}`;
};
