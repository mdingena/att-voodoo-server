import { Prefab } from '../decoders/decodePrefab';
import { MaterialComponent } from '../MaterialComponent';
import { Component } from '../components/transcoders/liquidContainer';

enum PresetHash {
  TeleportPotion = 27100
}

export const parseFlask = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.LiquidContainer as Component;

  if (!component) return undefined;

  if (!component.hasContent) return MaterialComponent.FlaskEmpty;

  if (component.presetHash === PresetHash.TeleportPotion) return MaterialComponent.FlaskTeleportPotion;

  return undefined;
};
