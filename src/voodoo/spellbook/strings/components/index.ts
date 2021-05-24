import * as transcoders from './transcoders';

export type TranscoderName = keyof typeof transcoders;
export type TranscoderProperties =
  //  | transcoders.LiquidContainer.Properties
  transcoders.NetworkRigidbody.Properties | transcoders.PickupDock.Properties | transcoders.StatManager.Properties;

export type Component = {
  name: TranscoderName;
  properties: TranscoderProperties;
};

export { transcoders };
