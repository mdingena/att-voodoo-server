import { binaryToUInts } from './utils';
import {
  encodePrefabObject,
  PrefabObjectOptions,
  encodeComponents,
  ComponentName,
  ComponentOptions,
  encodeEmbeddedEntities,
  encodeChildPrefabs
} from './encoders';
import * as componentEncoders from './components';

interface Options {
  prefabObject: PrefabObjectOptions;
  components: {
    [key in ComponentName]?: ComponentOptions;
  };
}

export const createString = (options: Options): string => {
  const hash = options.prefabObject.hash;

  let binary: string = '';

  /* Create prefab object. */
  binary += encodePrefabObject(options.prefabObject);

  /* Create components. */
  const components = Object.entries(options.components).map(([name, options]) => ({
    name: <ComponentName>name,
    options: <ComponentOptions>options
  }));
  binary += encodeComponents(components);

  /* Create embedded entities. */
  binary += encodeEmbeddedEntities([]); // @todo

  /* Create child prefabs. */
  binary += encodeChildPrefabs([]); // @todo

  /* Pad bits with trailing zeroes to make it % 32. */
  const missingBits = binary.length + (32 - (binary.length % 32 === 0 ? 32 : binary.length % 32));
  const paddedBinary = binary.padEnd(missingBits, '0');

  /* Calculate byte size of padded binary. */
  const bytes = paddedBinary.length / 8;

  /* Convert binary to array of UInts. */
  const uInts = binaryToUInts(paddedBinary);

  /* Construct the UInts string. */
  const uIntString = [hash, bytes, ...uInts].join(',');

  /* Construct the versions string. */
  const versions = components.map(({ name }) => `${componentEncoders[name].HASH},${componentEncoders[name].VERSION}`);
  const versionString = versions.length && [versions.length, ...versions].join(',');

  /* Return spawn string. */
  const strings = [uIntString, versionString].filter(Boolean);
  return `${strings.join(',|')},`;
};
