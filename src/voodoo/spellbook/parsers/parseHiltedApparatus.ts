import { Prefab, PrefabData } from 'att-string-transcoder';

export const parseHiltedApparatus = (prefab: PrefabData): string | undefined => {
  const children = Object.keys(prefab.childPrefabs ?? []);

  if (children.length) return 'hilted apparatus';

  switch (prefab.prefabObject.hash) {
    case Prefab.Arrow_Shaft_Wooden.hash:
      return 'arrow shaft';

    case Prefab.Curled_Wooden_Handle.hash:
      return 'curled wooden handle';

    case Prefab.Handle_Bow.hash:
      return 'bow handle';

    case Prefab.Handle_Fist.hash:
      return 'fist handle';

    case Prefab.Handle_Medium_Straight.hash:
      return 'medium straight wooden handle';

    case Prefab.Handle_Short.hash:
      return 'short wooden handle';

    case Prefab.Shield_Core_Handle.hash:
      return 'shield handle';

    case Prefab.Hebios_Handle_Kunai.hash:
      return 'kunai handle';

    default:
      return 'handle';
  }
};
