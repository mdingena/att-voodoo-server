import { transcoders, Component } from '../components';

const terminator = '0'.repeat(32);

export const encodeComponents = (components: Component[]): string => {
  const binary = components.reduce((binary: string, component: Component) => {
    try {
      const bits = transcoders[component.name].encode(component.properties);
      return `${binary}${bits}`;
    } catch (error) {
      throw Error(`Unrecognised component '${component.name}'`);
    }
  }, '');

  return `${binary}${terminator}`;
};
