import {
  Prefab,
  DurabilityModule,
  PhysicalMaterialPart,
  PhysicalMaterialPartHash,
  PrefabHash
} from 'att-string-transcoder';

const IRON_HANDLES = ['Handle_Large_Cool', 'Handle_Medium_Cool', 'Handle_Short_Cool', 'Metal_Bow'];

const REDWOOD_HANDLES = [
  'Hebios_Handle_Katana',
  'Hebios_Handle_Kunai',
  'Hebios_Handle_Naginata',
  'Hebios_Handle_Wakizashi'
];

export const repairMaterial = (prefab: Prefab, material: PhysicalMaterialPartHash, amount: number): Prefab => {
  const durabilityModule = prefab.components?.DurabilityModule as DurabilityModule | undefined;
  const physicalMaterialPart = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart | undefined;

  if (durabilityModule) {
    if (physicalMaterialPart) {
      if (physicalMaterialPart.materialHash === material) {
        durabilityModule.integrity = Math.min(1, (durabilityModule.integrity ?? 0) + amount);
      }
    } else {
      const prefabName = PrefabHash[prefab.prefabObject.hash];

      if (
        (material === PhysicalMaterialPartHash.Iron && IRON_HANDLES.includes(prefabName)) ||
        (material === PhysicalMaterialPartHash.Redwood && REDWOOD_HANDLES.includes(prefabName))
      ) {
        durabilityModule.integrity = Math.min(1, (durabilityModule.integrity ?? 0) + amount);
      }
    }
  }

  for (const child of prefab.childPrefabs ?? []) {
    repairMaterial(child.prefab, material, amount);
  }

  return prefab;
};
