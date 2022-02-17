import { PrefabData, LiquidContainer, PresetHash } from 'att-string-transcoder';

export const parseFlask = (prefab: PrefabData): string | undefined => {
  const component = prefab.components?.LiquidContainer as LiquidContainer;

  if (!component) return undefined;

  if (!component.hasContent) return 'empty flask';

  if (component.presetHash === PresetHash.Water) return 'flask containing water';

  if (component.presetHash === PresetHash.TeleportationPotion) return 'flask containing teleportation potion';

  return undefined;
};
