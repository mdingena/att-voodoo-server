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

export const decodePrefab = (reader: BinaryReader): Prefab => {
  const prefabObject = decodePrefabObject(reader);
  const components = decodeComponents(reader);
  const embeddedEntities = decodeEmbeddedEntities(reader);
  const childPrefabs = decodeChildPrefabs(reader);

  return {
    prefabObject,
    components,
    embeddedEntities,
    childPrefabs
  };
};
