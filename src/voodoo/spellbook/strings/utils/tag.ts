import { SpawnOptions } from '..';
import { floatToUInt } from './floatToUInt';
import { replaceVelocityString } from './replaceVelocityString';

/**
 * Tags a template literal with a transform.
 * Takes a template literal and returns a function to populate the template.
 * @argument substrings - The template literal strings without the placeholders.
 * @argument keys - The values passed into the placeholders, to be used as keys for the object passed into the curried function.
 * @returns {(transform: Transform) => string} Function to populate the template with a transform.
 * @example
 * const prefab = tag`123,5,123,${'px'},${'py'},${'pz'},${'qx'},${'qy'},${'qz'},${'qw'},${'s'},42,2,`;
 * const transform = { px: -906.5, py: 162.5, pz: 110.5, etc... };
 * const rawString = prefab(transform);
 * // "123,5,123,3294797824,1126334464,1121779712,etc..."
 */
export const tag = (substrings: TemplateStringsArray, ...keys: string[]) => ({
  transform,
  isKinematic,
  isServerSleeping
}: SpawnOptions) => {
  const hasVelocity = transform.vx || transform.vy || transform.vz || transform.avx || transform.avy || transform.avz;

  return keys.reduce((string, key, index) => {
    if (key === 'velocityStart' && hasVelocity) {
      const velocityString = replaceVelocityString({
        string: substrings[index + 1],
        transform,
        isKinematic,
        isServerSleeping
      });

      return `${string}${velocityString}`;
    } else if (key === 'velocityEnd' && hasVelocity) {
      return `${string}${substrings[index + 1]}`;
    } else {
      const packedFloat = floatToUInt(Number(transform[key]));

      return `${string}${packedFloat}${substrings[index + 1]}`;
    }
  }, substrings[0]);
};
