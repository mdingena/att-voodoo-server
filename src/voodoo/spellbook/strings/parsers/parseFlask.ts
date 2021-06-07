import { Prefab } from '../decoders/decodePrefab';
import { Component } from '../components/transcoders/liquidContainer';
import { PresetHash } from '../PresetHash';

export const parseFlask = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.LiquidContainer as Component;

  if (!component) return undefined;

  if (!component.hasContent) return 'empty flask';

  if (component.presetHash === PresetHash.Water) return 'flask containing water';

  if (component.presetHash === PresetHash.TeleportPotion) return 'flask containing teleportation potion';

  return undefined;
};
