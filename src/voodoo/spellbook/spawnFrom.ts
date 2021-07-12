import { Vector3, Object3D } from 'three';
import { parseVector } from './strings/utils/parseVector';

type Origin = 'eyes' | 'leftPalm' | 'rightPalm';

export const spawnFrom = (player: any, from: Origin, distance: number = 0) => {
  let position: Vector3, direction: Vector3, sign: 1 | -1;

  switch (from) {
    case 'leftPalm':
      position = parseVector(player['LeftHandPosition']);
      direction = new Vector3().crossVectors(parseVector(player['LeftHandForward']), parseVector(player['LeftHandUp']));
      sign = -1;
      break;

    case 'rightPalm':
      position = parseVector(player['RightHandPosition']);
      direction = new Vector3().crossVectors(
        parseVector(player['RightHandForward']),
        parseVector(player['RightHandUp'])
      );
      sign = 1;

    case 'eyes':
    default:
      position = parseVector(player['HeadPosition']);
      direction = parseVector(player['HeadForward']);
      sign = 1;
  }

  const prefab = new Object3D();
  prefab.lookAt(direction);

  return {
    position: {
      x: position.x + direction.x * sign * distance,
      y: position.y + direction.y * sign * distance,
      z: position.z + direction.z * sign * distance
    },
    rotation: {
      x: prefab.quaternion.x,
      y: prefab.quaternion.y,
      z: prefab.quaternion.z,
      w: prefab.quaternion.w
    },
    direction: {
      x: direction.x * sign,
      y: direction.y * sign,
      z: direction.z * sign
    }
  };
};
