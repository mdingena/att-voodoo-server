import { transcoders, Components, KnownComponent, UnknownComponent, ComponentName } from '../components';
import { uIntToBinary } from '../utils/uIntToBinary';
import { numberToBinaryUInt } from '../utils/numberToBinaryUInt';

const terminator = '0'.repeat(32);

export const encodeComponents = (components: Components = {}): string => {
  let binary = '';

  for (const [key, value] of Object.entries(components)) {
    const componentName = key as ComponentName | 'Unknown';

    if (componentName === 'Unknown') {
      const unknownComponents = value as UnknownComponent[];
      binary += unknownComponents
        .map(({ hash, data }) => [uIntToBinary(hash), numberToBinaryUInt(data.length), data].join(''))
        .join('');
    } else {
      try {
        const knownComponent = value as KnownComponent;
        binary += transcoders[componentName].encode(knownComponent);
      } catch (error) {
        throw Error(`Cannot encode unsupported component '${componentName}'`);
      }
    }
  }

  return `${binary}${terminator}`;
};
