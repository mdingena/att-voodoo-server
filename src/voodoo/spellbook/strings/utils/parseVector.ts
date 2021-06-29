import { Vector3 } from 'three';

export const parseVector = (coordinates: string | number[]): Vector3 =>
  typeof coordinates === 'string'
    ? new Vector3(
        ...(coordinates as string)
          .replace(/[()\s]/g, '')
          .split(',')
          .map(Number)
      )
    : new Vector3(...(coordinates as number[]));
