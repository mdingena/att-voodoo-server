import { ServerConnection } from 'js-tale';
import { Vector3 } from 'three';
import { spawnFrom } from '../spawnFrom';
import { crystalWyrmSpit } from '../strings';

export const shootWyrmSpit = async (connection: ServerConnection, accountId: number): Promise<void> => {
  const response = await connection.send(`player detailed ${accountId}`);

  const [px, py, pz] = spawnFrom(response.Result, 'rightPalm', 0.4);

  const velocity = new Vector3().crossVectors(
    new Vector3(...response.Result['RightHandForward'].replace(/[()\s]/g, '').split(',')),
    new Vector3(...response.Result['RightHandUp'].replace(/[()\s]/g, '').split(','))
  );

  const transform = {
    px,
    py,
    pz,
    qx: 0,
    qy: 0,
    qz: 0,
    qw: 1,
    s: 1,
    vx: velocity.x * 30,
    vy: velocity.y * 30,
    vz: velocity.z * 30,
    avx: 0,
    avy: 0,
    avz: 0
  };

  const results = await connection.send(`spawn string-raw ${crystalWyrmSpit(transform)}`);
};
