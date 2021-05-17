import { BinaryReader } from '../utils';
import { decodeComponents, Component } from './decodeComponents';

export type EmbeddedEntity = {
  hash: number;
  size: number;
  isAlive: boolean;
  components: Component[];
};

export const decodeEmbeddedEntities = (readBinary: BinaryReader): EmbeddedEntity[] => {
  const embeddedEntities: EmbeddedEntity[] = [];

  /* Continue looping until we find a zero hash. */
  while (true) {
    /* Get the entity hash. */
    const hashBits = readBinary(32);
    const hash = Number(`0b${hashBits}`);

    /* Break if we reached the end of the entities loop. */
    if (hash === 0) break;

    /* Get the entity's data length. */
    const sizeBits = readBinary(32);
    const size = Number(`0b${sizeBits}`);

    /* Check if entity is still alive. */
    const isAliveBit = readBinary(1);
    const isAlive = isAliveBit === '1';

    /* Skip to next entity if this one is dead. */
    if (!isAlive) {
      embeddedEntities.push({ hash, size, isAlive, components: [] });
      readBinary(size);
      continue;
    }

    /* Get the entity's components. */
    const components = decodeComponents(readBinary);

    /* Save entity. */
    embeddedEntities.push({ hash, size, isAlive, components });
  }

  return embeddedEntities;
};
