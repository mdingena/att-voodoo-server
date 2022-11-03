import { Vector3 } from 'three';

export const parseVector = (coordinates: number[]): Vector3 => new Vector3(...coordinates);
