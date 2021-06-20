import { Prefab } from '../decoders/decodePrefab';
import { PrefabHash } from '../PrefabHash';

export const parseHiltedApparatus = (prefab: Prefab): string | undefined => {
  const children = Object.keys(prefab.childPrefabs ?? []);

  if (children.length) return 'hilted apparatus';

  switch (prefab.prefabObject.hash) {
    case PrefabHash.Curled_Wooden_Handle:
      return 'curled wooden handle';

    case PrefabHash.Handle_Bow:
      return 'bow handle';

    case PrefabHash.Handle_Fist:
      return 'fist handle';

    case PrefabHash.Handle_Medium_Straight:
      return 'medium straight wooden handle';

    case PrefabHash.Handle_Short:
      return 'short wooden handle';

    case PrefabHash.Shield_Core_Handle:
      return 'shield handle';

    case PrefabHash.Hebios_Handle_Kunai:
      return 'kunai handle';

    default:
      return 'handle';
  }
};
