import * as transcoders from './transcoders';

export type ComponentName = keyof typeof transcoders;

export type KnownComponent =
  | transcoders.LiquidContainer.Component
  | transcoders.NetworkRigidbody.Component
  | transcoders.PickupDock.Component
  | transcoders.StatManager.Component;

export type UnknownComponent = { hash: number; data: string };

export type Component = KnownComponent | UnknownComponent[];

export type Components = {
  [key in ComponentName | 'Unknown']?: Component;
};

export { transcoders };
