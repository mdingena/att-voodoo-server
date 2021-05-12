export type Transform = {
  [key: string]: number | undefined;
  px: number;
  py: number;
  pz: number;
  qx?: number;
  qy?: number;
  qz?: number;
  qw?: number;
  s?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  avx?: number;
  avy?: number;
  avz?: number;
};

export interface SpawnOptions {
  transform: Transform;
  isKinematic?: boolean;
  isServerSleeping?: boolean;
}

export * from './created';
export * from './captured';
