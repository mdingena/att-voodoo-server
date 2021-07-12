import { ChildPrefab } from '../decoders';
import { PrefabHash } from '../PrefabHash';
import { PrefabEmbeddedEntityHash } from '../PrefabEmbeddedEntityHash';

type Tree = {
  [segment in keyof typeof PrefabEmbeddedEntityHash]?: EmbeddedEntities | null;
};

type EmbeddedEntities = {
  [embeddedEntity: string]: Tree;
};

export const composeTree = (tree: Tree, parentHash: number = 0): ChildPrefab => {
  const [segment, embeddedEntities] = Object.entries(tree)[0];

  return {
    parentHash,
    prefab: {
      prefabObject: {
        hash: PrefabHash[segment as keyof typeof PrefabHash]
      },
      childPrefabs:
        embeddedEntities === null
          ? []
          : Object.entries(embeddedEntities!).map(([embeddedEntity, subtree]) =>
              composeTree(subtree, PrefabEmbeddedEntityHash[segment][embeddedEntity])
            )
    }
  };
};
