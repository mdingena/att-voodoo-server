import { Vector3 } from 'three';
import { spawnFrom, crystalCrystalWyrmSpit } from '../strings';
import { VoodooServer } from '../../index';

export const castCrystalWyrmSpit = async (voodoo: VoodooServer, accountId: number): Promise<void> => {
  try {
    const response = await voodoo.command({ accountId, command: `player detailed ${accountId}` });

    if (!response.ok) throw Error(response.error);

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

    const results = await voodoo.command({
      accountId,
      command: `spawn string-raw ${crystalCrystalWyrmSpit(transform)}`
    });

    if (!results.ok) throw Error(results.error);

    return results;
  } catch (error) {
    voodoo.logger.error(error);
  }
};
