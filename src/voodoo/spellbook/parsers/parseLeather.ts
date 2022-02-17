import { Prefab, PrefabData, PhysicalMaterialPart, PhysicalMaterialPartHash } from 'att-string-transcoder';

export const parseLeather = (prefab: PrefabData): string | undefined => {
  const component = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart;

  if (!component) return undefined;

  if (component.materialHash === PhysicalMaterialPartHash.DaisLeather) {
    switch (prefab.prefabObject.hash) {
      case Prefab.Soft_Fabric_Medium_Strips.hash:
        return 'tan leather strips';

      case Prefab.Soft_Fabric_Medium_Roll.hash:
        return 'tan leather roll';

      case Prefab.Soft_Fabric_Large_Roll.hash:
        return 'large tan leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === PhysicalMaterialPartHash.DaisRedLeather) {
    switch (prefab.prefabObject.hash) {
      case Prefab.Soft_Fabric_Medium_Strips.hash:
        return 'brown leather strips';

      case Prefab.Soft_Fabric_Medium_Roll.hash:
        return 'brown leather roll';

      case Prefab.Soft_Fabric_Large_Roll.hash:
        return 'large brown leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === PhysicalMaterialPartHash.WyrmFaceLeather) {
    switch (prefab.prefabObject.hash) {
      case Prefab.Soft_Fabric_Medium_Strips.hash:
        return 'green leather strips';

      case Prefab.Soft_Fabric_Medium_Roll.hash:
        return 'green leather roll';

      case Prefab.Soft_Fabric_Large_Roll.hash:
        return 'large green leather roll';

      default:
        return undefined;
    }
  }

  if (component.materialHash === PhysicalMaterialPartHash.UnknownLeather) {
    switch (prefab.prefabObject.hash) {
      case Prefab.Soft_Fabric_Medium_Strips.hash:
        return 'black leather strips';

      case Prefab.Soft_Fabric_Medium_Roll.hash:
        return 'black leather roll';

      case Prefab.Soft_Fabric_Large_Roll.hash:
        return 'large black leather roll';

      default:
        return undefined;
    }
  }

  return undefined;
};
