import { Prefab, PhysicalMaterialPart, PhysicalMaterialPartHash, PrefabHash } from 'att-string-transcoder';

export const parseLeather = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart;

  if (!component) return undefined;

  if (component.materialHash === PhysicalMaterialPartHash.DaisLeather) {
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

  if (component.materialHash === PhysicalMaterialPartHash.DaisRedLeather) {
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

  if (component.materialHash === PhysicalMaterialPartHash.WyrmFaceLeather) {
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

  if (component.materialHash === PhysicalMaterialPartHash.UnknownLeather) {
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
