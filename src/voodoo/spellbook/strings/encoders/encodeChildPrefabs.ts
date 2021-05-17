export type ChildPrefab = {
  name: string;
};

const terminator = '0';

export const encodeChildPrefabs = (childPrefabs: ChildPrefab[]): string => terminator;
