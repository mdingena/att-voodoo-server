import {
  Prefab,
  DurabilityModule,
  PhysicalMaterialPart,
  PhysicalMaterialPartHash,
  PrefabData
} from 'att-string-transcoder';

const IRON_HANDLES = ['Handle_Large_Cool', 'Handle_Medium_Cool', 'Handle_Short_Cool', 'Metal_Bow'];

const REDWOOD_HANDLES = [
  'Hebios_Handle_Katana',
  'Hebios_Handle_Kunai',
  'Hebios_Handle_Naginata',
  'Hebios_Handle_Wakizashi'
];

export const repairMaterial = (prefab: PrefabData, material: PhysicalMaterialPartHash, amount: number): PrefabData => {
  const durabilityModule = prefab.components?.DurabilityModule as DurabilityModule | undefined;
  const physicalMaterialPart = prefab.components?.PhysicalMaterialPart as PhysicalMaterialPart | undefined;

  if (durabilityModule) {
    if (physicalMaterialPart) {
      if (physicalMaterialPart.materialHash === material) {
        durabilityModule.integrity = Math.min(1, (durabilityModule.integrity ?? 0) + amount);
      }
    } else {
      const prefabName = Object.entries(Prefab).find(([_, value]) => value.hash === prefab.prefabObject.hash)![0];

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
