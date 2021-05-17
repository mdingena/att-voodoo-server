import { BinaryReader, componentMap } from '../utils';

export type Component = {
  hash: number;
  name: string;
  size: number;
  data: string;
};

export const decodeComponents = (readBinary: BinaryReader): Component[] => {
  const components: Component[] = [];

  /* Continue looping until we find a zero hash. */
  while (true) {
    /* Get the component hash. */
    const hashBits = readBinary(32);
    const hash = Number(`0b${hashBits}`);

    /* Break if we reached the end of the components loop. */
    if (hash === 0) break;

    /* Get the component's data length. */
    const sizeBits = readBinary(32);
    const size = Number(`0b${sizeBits}`);

    /* Get the component's data. */
    const data = readBinary(size);

    /* Save component. */
    components.push({ hash, name: componentMap[hash], size, data });
  }

  return components;
};
