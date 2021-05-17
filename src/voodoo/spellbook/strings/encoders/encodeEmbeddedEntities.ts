export type Entity = {
  name: string;
};

const terminator = '0'.repeat(32);

export const encodeEmbeddedEntities = (entities: Entity[]): string => terminator;
