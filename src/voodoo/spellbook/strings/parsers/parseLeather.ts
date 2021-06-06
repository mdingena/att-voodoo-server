import { Prefab } from '../decoders/decodePrefab';
import { Component } from '../components/transcoders/physicalMaterialPart';
import { PrefabHash } from '../PrefabHash';
import { MaterialHash } from '../MaterialHash';

export const parseLeather = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.PhysicalMaterialPart as Component;

  if (!component) return undefined;

  if (component.materialHash === MaterialHash.DaisLeather) {
    switch (prefab.prefabObject.hash) {
      case PrefabHash.Soft_Fabric_Medium_Strips:
        return 'tan leather strips';

      case PrefabHash.Soft_Fabric_Medium_Roll:
        return 'tan leather roll';

      case PrefabHash.Soft_Fabric_Large_Roll:
        return 'large tan leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === MaterialHash.DaisRedLeather) {
    switch (prefab.prefabObject.hash) {
      case PrefabHash.Soft_Fabric_Medium_Strips:
        return 'brown leather strips';

      case PrefabHash.Soft_Fabric_Medium_Roll:
        return 'brown leather roll';

      case PrefabHash.Soft_Fabric_Large_Roll:
        return 'large brown leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === MaterialHash.WyrmFaceLeather) {
    switch (prefab.prefabObject.hash) {
      case PrefabHash.Soft_Fabric_Medium_Strips:
        return 'green leather strips';

      case PrefabHash.Soft_Fabric_Medium_Roll:
        return 'green leather roll';

      case PrefabHash.Soft_Fabric_Large_Roll:
        return 'large green leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === MaterialHash.UnknownLeather) {
    switch (prefab.prefabObject.hash) {
      case PrefabHash.Soft_Fabric_Medium_Strips:
        return 'black leather strips';

      case PrefabHash.Soft_Fabric_Medium_Roll:
        return 'black leather roll';

      case PrefabHash.Soft_Fabric_Large_Roll:
        return 'large black leather roll';

      default:
        return undefined;
    }
  }

  return undefined;
};
