import type { Dexterity, PlayerDetailed } from '../createVoodooServer';
import { Vector3, Object3D } from 'three';
import { parseVector } from './utils/parseVector';

type SpawnFrom = 'eyes' | 'mainHand' | 'offHand' | 'bothHands';

type Origin = 'eyes' | Dexterity;

export type EvokeHandedness = 'rightHand' | 'leftHand';

export type EvokeAngle = 'palm' | 'index';

export const spawnFrom = (
  player: PlayerDetailed,
  from: SpawnFrom,
  evokePreference: [EvokeHandedness, EvokeAngle],
  distance: number = 0
) => {
  if (from === 'bothHands') throw new Error("spawnFrom() should not be called with argument `from` = 'bothHands'.");

  let origin: Origin;

  switch (from) {
    case 'mainHand':
      origin = evokePreference.join('/') as Dexterity;
      break;

    case 'offHand':
      const [hand, angle] = evokePreference;
      origin = `${hand === 'rightHand' ? 'leftHand' : 'rightHand'}/${angle}`;
      break;

    case 'eyes':
    default:
      origin = 'eyes';
  }

  let position: Vector3, direction: Vector3, sign: 1 | -1;

  switch (origin) {
    case 'rightHand/palm':
      position = parseVector(player['RightHandPosition']);
      direction = new Vector3().crossVectors(
        parseVector(player['RightHandForward']),
        parseVector(player['RightHandUp'])
      );
      sign = 1;
      break;

    case 'rightHand/index':
      position = parseVector(player['RightHandPosition']);
      direction = parseVector(player['RightHandUp']);
      sign = -1;
      break;

    case 'leftHand/palm':
      position = parseVector(player['LeftHandPosition']);
      direction = new Vector3().crossVectors(parseVector(player['LeftHandForward']), parseVector(player['LeftHandUp']));
      sign = -1;
      break;

    case 'leftHand/index':
      position = parseVector(player['LeftHandPosition']);
      direction = parseVector(player['LeftHandUp']);
      sign = -1;
      break;

    case 'eyes':
    default:
      position = parseVector(player['HeadPosition']);
      direction = parseVector(player['HeadForward']);
      sign = 1;
  }

  const prefab = new Object3D();
  prefab.lookAt(new Vector3(direction.x * sign, direction.y * sign, direction.z * sign));

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
