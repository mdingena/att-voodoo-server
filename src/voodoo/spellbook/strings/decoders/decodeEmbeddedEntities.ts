import { BinaryReader } from '../utils';
import { decodeComponents, Components } from './decodeComponents';

type DeadEmbeddedEntity = {
  isAlive: false;
  components: null;
};

type AliveEmbeddedEntity = {
  isAlive: true;
  components: Components;
};

export type EmbeddedEntities = {
  [key: string]: AliveEmbeddedEntity | DeadEmbeddedEntity;
};

export const decodeEmbeddedEntities = (reader: BinaryReader): EmbeddedEntities => {
  const embeddedEntities: EmbeddedEntities = {};

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
      embeddedEntities[hash] = { isAlive, components: null };
      reader.binary(size);
      continue;
    }

    /* Get the entity's components. */
    const components = decodeComponents(reader);

    /* Save entity. */
    embeddedEntities[hash] = { isAlive, components };
  }

  return embeddedEntities;
};
