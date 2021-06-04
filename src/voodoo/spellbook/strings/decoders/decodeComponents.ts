import { transcoders, TranscoderName, TranscoderProperties } from '../components';
import { names } from '../components/components';
import { BinaryReader } from '../utils';

type EncodedProperties = string;

export type Component = {
  hash: number;
  name: string;
  size: number;
  data: TranscoderProperties | EncodedProperties;
};

export const decodeComponents = (reader: BinaryReader): Component[] => {
  const components: Component[] = [];

  /* Continue looping until we find a zero hash. */
  while (true) {
    /* Get the component hash. */
    const hash = reader.uInt();

    /* Break if we reached the end of the components loop. */
    if (hash === 0) break;

    /* Get the component's data length. */
    const size = reader.uInt();

    /* Get the component's data. */
    const componentName = names[hash] as TranscoderName;
    const data = transcoders?.[componentName] ? transcoders[componentName].decode(reader) : reader.binary(size);

    /* Save component. */
    components.push({ hash, name: names[hash], size, data });
  }

  return components;
};
