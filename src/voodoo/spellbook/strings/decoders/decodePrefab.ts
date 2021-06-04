import { Components } from '../components';
import { BinaryReader } from '../utils';
import { decodePrefabObject, PrefabObject } from './decodePrefabObject';
import { decodeComponents } from './decodeComponents';
import { decodeEmbeddedEntities } from './decodeEmbeddedEntities';
import { decodeChildPrefabs } from './decodeChildPrefabs';

export type Prefab = {
  prefabObject: PrefabObject;
  components?: Components;
  embeddedEntities?: {
    [key: string]: any;
  };
  childPrefabs?: {
    [key: string]: any;
  }[];
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
