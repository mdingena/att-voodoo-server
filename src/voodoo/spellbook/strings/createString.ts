import { SpawnOptions } from '.';
import { binaryToUInts } from './utils';
import { encodePrefabObject, encodeComponents } from './encoders';
import * as componentEncoders from './encoders/components';

export const COMPONENTS = Object.keys(componentEncoders).reduce((map, key) => ({ ...map, [key]: key }), {});

type Component = keyof typeof componentEncoders;

export const createString = (hash: number, components: Component[] = []) => (options: SpawnOptions): string => {
  let binary: string = '';

  /* Create prefab object. */
  binary += encodePrefabObject(hash, options);

  /* Create components. */
  binary += encodeComponents(components.map(name => ({ name, options })));

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
  const versions = components.map(name => componentEncoders[name].VERSION);
  const versionString = versions.length && [versions.length, ...versions].join(',');

  /* Return spawn string. */
  const strings = [uIntString, versionString].filter(Boolean);
  return `${strings.join(',|')},`;
};
