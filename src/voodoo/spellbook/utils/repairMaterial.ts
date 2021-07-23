import { Prefab, DurabilityModule, PhysicalMaterialPart, PhysicalMaterialPartHash } from 'att-string-transcoder';

export const repairMaterial = (prefab: Prefab, material: PhysicalMaterialPartHash, amount: number): Prefab => {
  const durabilityModule = prefab.components?.DurabilityModule as DurabilityModule;
  const physicalMaterialPart = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart;

  if (durabilityModule && physicalMaterialPart && physicalMaterialPart.materialHash === material) {
    durabilityModule.integrity = Math.min(1, (durabilityModule.integrity ?? 0) + amount);
  }

  for (const child of prefab.childPrefabs ?? []) {
    repairMaterial(child.prefab, material, amount);
  }

  return prefab;
};
