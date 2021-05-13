import { SpawnOptions } from '..';
import { createPrefabObject } from './createPrefabObject';
import { createRigidBody, VERSION as rigidBodyVersion } from './createRigidBody';
import { binaryToUInts } from './binaryToUInts';

export const createString = (prefabHash: number) => (options: SpawnOptions) => {
  /* Create prefab components. */
  const prefabObject = createPrefabObject(prefabHash, options);
  const rigidBody = createRigidBody(options);

  /* Join all components. */
  const binary = [prefabObject, rigidBody].join('');

  /* Pad bits with trailing zeroes to make it % 32. */
  const missingBits = binary.length + (32 - (binary.length % 32 === 0 ? 32 : binary.length % 32));
  const paddedBinary = binary.padEnd(missingBits, '0');

  /* Calculate byte size of padded binary. */
  const bytes = paddedBinary.length / 8;

  /* Convert binary to array of UInts. */
  const uInts = binaryToUInts(paddedBinary);

  /* Construct the components string. */
  const components = [prefabHash, bytes, ...uInts].join(',');

  /* Construct the versions string. */
  const componentVersions = [rigidBodyVersion];
  const versions = [componentVersions.length, ...componentVersions].join(',');

  /* Return spawn string. */
  return `${components},|${versions},`;
};
