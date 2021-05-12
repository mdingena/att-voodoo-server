import { Vector3 } from 'three';

export const parseVector = (coordinates: string): Vector3 =>
  new Vector3(
    ...coordinates
      .replace(/[()\s]/g, '')
      .split(',')
      .map(Number)
  );
