import * as encoders from '../components';

export type ComponentName = keyof typeof encoders;
export type ComponentOptions = encoders.LiquidContainer.Options | encoders.NetworkRigidbody.Options;

type Component = {
  name: ComponentName;
  options: ComponentOptions;
};

const terminator = '0'.repeat(32);

export const encodeComponents = (components: Component[]): string => {
  const binary = components.reduce((binary: string, component: Component) => {
    try {
      const bits = encoders[component.name].encode(component.options);
      return `${binary}${bits}`;
    } catch (error) {
      throw Error(`Unrecognised component '${component.name}'`);
    }
  }, '');

  return `${binary}${terminator}`;
};
