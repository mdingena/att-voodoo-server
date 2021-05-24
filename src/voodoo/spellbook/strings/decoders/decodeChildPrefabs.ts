import { BinaryReader, binaryToNumber } from '../utils';
import { decodePrefab, Prefab } from './decodePrefab';

export type ChildPrefab = {
  parentHash: number;
  prefab: Prefab;
};

export const decodeChildPrefabs = (readBinary: BinaryReader): ChildPrefab[] => {
  const childPrefabs: ChildPrefab[] = [];

  /* Continue looping until we find a false exists bit. */
  while (true) {
    /* Get the exists bit. */
    const existsBit = readBinary(1);
    const exists = existsBit === '1';

    /* Break if we reached the end of the child prefabs loop. */
    if (!exists) break;

    /* Get the parent entity hash. */
    const parentHashBits = readBinary(32);
    const parentHash = binaryToNumber(parentHashBits);

    /* Get the child prefab. */
    const prefab = decodePrefab(readBinary);

    /* Save entity. */
    childPrefabs.push({ parentHash, prefab });
  }

  return childPrefabs;
};
