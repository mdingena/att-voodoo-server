import { Vector3, Object3D } from 'three';
import { parseVector } from './strings/utils/parseVector';

type Origin = 'leftPalm' | 'rightPalm';

export const spawnFrom = (player: any, from: Origin, distance: number = 0) => {
  let position: Vector3, direction: Vector3, sign: 1 | -1;

  switch (from) {
    case 'leftPalm':
      position = parseVector(player['LeftHandPosition']);
      direction = new Vector3().crossVectors(parseVector(player['LeftHandForward']), parseVector(player['LeftHandUp']));
      sign = -1;
      break;

    case 'rightPalm':
    default:
      position = parseVector(player['RightHandPosition']);
      direction = new Vector3().crossVectors(
        parseVector(player['RightHandForward']),
        parseVector(player['RightHandUp'])
      );
      sign = 1;
  }

  const prefab = new Object3D();
  prefab.lookAt(direction);

  return {
    px: position.x + direction.x * sign * distance,
    py: position.y + direction.y * sign * distance,
    pz: position.z + direction.z * sign * distance,
    qx: prefab.quaternion.x,
    qy: prefab.quaternion.y,
    qz: prefab.quaternion.z,
    qw: prefab.quaternion.w,
    dx: direction.x * sign,
    dy: direction.y * sign,
    dz: direction.z * sign
  };
};
