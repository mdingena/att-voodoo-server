import { BinaryReader } from '../utils';
import { decodeComponents, Component } from './decodeComponents';

export type EmbeddedEntity = {
  hash: number;
  size: number;
  isAlive: boolean;
  components: Component[];
};

export const decodeEmbeddedEntities = (reader: BinaryReader): EmbeddedEntity[] => {
  const embeddedEntities: EmbeddedEntity[] = [];

  /* Continue looping until we find a zero hash. */
  while (true) {
    /* Get the entity hash. */
    const hash = reader.uInt();

    /* Break if we reached the end of the entities loop. */
    if (hash === 0) break;

    /* Get the entity's data length. */
    const size = reader.uInt();

    /* Check if entity is still alive. */
    const isAlive = reader.boolean();

    /* Skip to next entity if this one is dead. */
    if (!isAlive) {
      embeddedEntities.push({ hash, size, isAlive, components: [] });
      reader.binary(size);
      continue;
    }

    /* Get the entity's components. */
    const components = decodeComponents(reader);

    /* Save entity. */
    embeddedEntities.push({ hash, size, isAlive, components });
  }

  return embeddedEntities;
};
