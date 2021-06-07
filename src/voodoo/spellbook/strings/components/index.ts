import * as transcoders from './transcoders';

export type ComponentName = keyof typeof transcoders;

export type KnownComponent =
  | transcoders.BasicDecay.Component
  | transcoders.DurabilityModule.Component
  | transcoders.LiquidContainer.Component
  | transcoders.NetworkRigidbody.Component
  | transcoders.PhysicalMaterialPart.Component
  | transcoders.Pickup.Component
  | transcoders.PickupDock.Component
  | transcoders.StatManager.Component;

export type UnknownComponent = { hash: number; data: string };

export type Component = KnownComponent | UnknownComponent[];

export { transcoders };
