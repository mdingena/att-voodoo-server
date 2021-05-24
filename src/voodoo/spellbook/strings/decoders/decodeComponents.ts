import { names } from '../components/components';
import { BinaryReader, binaryToNumber } from '../utils';

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
    const hash = binaryToNumber(hashBits);

    /* Break if we reached the end of the components loop. */
    if (hash === 0) break;

    /* Get the component's data length. */
    const sizeBits = readBinary(32);
    const size = binaryToNumber(sizeBits);

    /* Get the component's data. */
    const data = readBinary(size);

    /* Save component. */
    components.push({ hash, name: names[hash], size, data });
  }

  return components;
};
