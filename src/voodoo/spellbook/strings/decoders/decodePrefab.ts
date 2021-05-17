import { BinaryReader } from '../utils';
import { decodePrefabObject, PrefabObject } from './decodePrefabObject';
import { decodeComponents, Component } from './decodeComponents';
import { decodeEmbeddedEntities, EmbeddedEntity } from './decodeEmbeddedEntities';
import { decodeChildPrefabs, ChildPrefab } from './decodeChildPrefabs';

export type Prefab = {
  prefabObject: PrefabObject;
  components: Component[];
  embeddedEntities: EmbeddedEntity[];
  childPrefabs: ChildPrefab[];
};

export const decodePrefab = (readBinary: BinaryReader): Prefab => {
  const prefabObject = decodePrefabObject(readBinary);
  const components = decodeComponents(readBinary);
  const embeddedEntities = decodeEmbeddedEntities(readBinary);
  const childPrefabs = decodeChildPrefabs(readBinary);

  return {
    prefabObject,
    components,
    embeddedEntities,
    childPrefabs
  };
};
