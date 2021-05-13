import { SpawnOptions } from '..';
import { numberToBinary } from './numberToBinary';
import { floatToBinary } from './floatToBinary';

export const createPrefabObject = (prefabHash: number, { transform }: SpawnOptions): string =>
  [
    numberToBinary(prefabHash),
    floatToBinary(transform.px ?? 0),
    floatToBinary(transform.py ?? 0),
    floatToBinary(transform.pz ?? 0),
    floatToBinary(transform.qx ?? 0),
    floatToBinary(transform.qy ?? 0),
    floatToBinary(transform.qz ?? 0),
    floatToBinary(transform.qw ?? 1),
    floatToBinary(transform.s ?? 1)
  ].join('');
