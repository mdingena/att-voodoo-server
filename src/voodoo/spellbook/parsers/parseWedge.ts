import { PrefabData, PhysicalMaterialPart, PhysicalMaterialPartHash } from 'att-string-transcoder';

export const parseWedge = (prefab: PrefabData): string | undefined => {
  const component = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart;

  if (!component) return undefined;

  switch (component.materialHash) {
    case PhysicalMaterialPartHash.Oak:
      return 'oak wedge';

    case PhysicalMaterialPartHash.Birch:
      return 'birch wedge';

    case PhysicalMaterialPartHash.Walnut:
      return 'walnut wedge';

    case PhysicalMaterialPartHash.Ash:
      return 'ash wedge';

    case PhysicalMaterialPartHash.Redwood:
      return 'redwood wedge';

    default:
      return undefined;
  }
};
