import { transcoders, Components, ComponentName, UnknownComponent } from '../components';
import { ComponentHash } from '../ComponentHash';
import { BinaryReader } from '../utils';

export const decodeComponents = (reader: BinaryReader): Components => {
  const components: Components = {
    Unknown: []
  };

  /* Continue looping until we find a zero hash. */
  while (true) {
    /* Get the component hash. */
    const hash = reader.uInt();

    /* Break if we reached the end of the components loop. */
    if (hash === 0) break;

    /* Get the component's data length. */
    const size = reader.uInt();

    /* Get the component's name. */
    const componentName = ComponentHash[hash] as ComponentName | undefined;

    /* Save the component's data. */
    if (componentName) {
      components[componentName] = transcoders[componentName].decode(reader);
    } else {
      (components.Unknown as UnknownComponent[]).push({ hash, data: reader.binary(size) });
    }
  }

  return components;
};
