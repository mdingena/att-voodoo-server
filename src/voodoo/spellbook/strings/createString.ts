import { binaryToUIntArray } from './utils';
import {
  encodePrefabObject,
  PrefabObjectProperties,
  encodeComponents,
  encodeEmbeddedEntities,
  encodeChildPrefabs
} from './encoders';
import { transcoders, Components, ComponentName } from './components';
import { EmbeddedEntities } from './embeddedEntities';

export type SpawnPrefab = {
  prefabObject: PrefabObjectProperties;
  components?: Components;
  embeddedEntities?: EmbeddedEntities;
};

export const createString = (options: SpawnPrefab): string => {
  const hash = options.prefabObject.hash;

  let binary: string = '';

  /* Create prefab object. */
  binary += encodePrefabObject(options.prefabObject);

  /* Create components. */
  binary += encodeComponents(options.components);

  /* Create embedded entities. */
  binary += encodeEmbeddedEntities(options.embeddedEntities);

  /* Create child prefabs. */
  binary += encodeChildPrefabs([]); // @todo

  /* Pad bits with trailing zeroes to make it % 32. */
  const missingBits = binary.length + (32 - (binary.length % 32 === 0 ? 32 : binary.length % 32));
  const paddedBinary = binary.padEnd(missingBits, '0');

  /* Calculate byte size of padded binary. */
  const bytes = paddedBinary.length / 8;

  /* Convert binary to array of UInts. */
  const uInts = binaryToUIntArray(paddedBinary);

  /* Construct the UInts string. */
  const uIntString = [hash, bytes, ...uInts].join(',');

  /* Construct the versions string. */
  const components = Object.keys(options.components ?? {}).filter(name => name !== 'Unknown') as ComponentName[];
  const versions = components.map(name => `${transcoders[name].HASH},${transcoders[name].VERSION}`);
  const versionString = versions.length && [versions.length, ...versions].join(',');

  /* Return spawn string. */
  const strings = [uIntString, versionString].filter(Boolean);
  return `${strings.join(',|')},`;
};
