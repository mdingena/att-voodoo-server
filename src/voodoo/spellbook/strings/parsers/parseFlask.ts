import { Prefab } from '../decoders/decodePrefab';
import { MaterialSpellComponent } from '../MaterialSpellComponent';
import { Component } from '../components/transcoders/liquidContainer';

enum PresetHash {
  TeleportPotion = 27100,
  Water = 44872
}

export const parseFlask = (prefab: Prefab): string | undefined => {
  const component = prefab.components?.LiquidContainer as Component;

  if (!component) return undefined;

  if (!component.hasContent) return MaterialSpellComponent.FlaskEmpty;

  if (component.presetHash === PresetHash.Water) return MaterialSpellComponent.FlaskWater;

  if (component.presetHash === PresetHash.TeleportPotion) return MaterialSpellComponent.FlaskTeleportPotion;

  return undefined;
};
