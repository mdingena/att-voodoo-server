import { Prefab } from '../decoders/decodePrefab';
import { Component } from '../components/transcoders/physicalMaterialPart';
import { MaterialHash } from '../MaterialHash';

export const parseWedge = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.PhysicalMaterialPart as Component;

  if (!component) return undefined;

  switch (component.materialHash) {
    case MaterialHash.Oak:
      return 'oak wedge';

    case MaterialHash.Birch:
      return 'birch wedge';

    case MaterialHash.Walnut:
      return 'walnut wedge';

    case MaterialHash.Ash:
      return 'ash wedge';

    case MaterialHash.Redwood:
      return 'redwood wedge';

    default:
      return undefined;
  }
};
