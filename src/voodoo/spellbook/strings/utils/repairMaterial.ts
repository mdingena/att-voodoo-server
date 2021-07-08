import { Prefab } from '../decoders';
import { MaterialHash } from '../MaterialHash';
import { DurabilityModule, PhysicalMaterialPart } from '../components/transcoders';

export const repairMaterial = (prefab: Prefab, material: MaterialHash, amount: number): Prefab => {
  const durabilityModule = prefab.components?.DurabilityModule as DurabilityModule.Component;
  const physicalMaterialPart = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart.Component;

  if (durabilityModule && physicalMaterialPart && physicalMaterialPart.materialHash === material) {
    durabilityModule.integrity = Math.min(1, (durabilityModule.integrity ?? 0) + amount);
  }

  for (const child of prefab.childPrefabs ?? []) {
    repairMaterial(child.prefab, material, amount);
  }

  return prefab;
};
