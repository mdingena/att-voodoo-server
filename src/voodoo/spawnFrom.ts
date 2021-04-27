import { Vector3 } from 'three';

export const spawnFrom = (player: any, from: string, distance: number = 0) => {
  let position: Vector3, direction: Vector3, sign: 1 | -1;

  switch (from) {
    case 'leftPalm':
      position = new Vector3(
        ...player['LeftHandPosition']
          .replace(/[()\s]/g, '')
          .split(',')
          .map(Number)
      );
      direction = new Vector3().crossVectors(
        new Vector3(
          ...player['LeftHandForward']
            .replace(/[()\s]/g, '')
            .split(',')
            .map(Number)
        ),
        new Vector3(
          ...player['LeftHandUp']
            .replace(/[()\s]/g, '')
            .split(',')
            .map(Number)
        )
      );
      sign = -1;
      break;

    case 'rightPalm':
    default:
      position = new Vector3(
        ...player['RightHandPosition']
          .replace(/[()\s]/g, '')
          .split(',')
          .map(Number)
      );
      direction = new Vector3().crossVectors(
        new Vector3(
          ...player['RightHandForward']
            .replace(/[()\s]/g, '')
            .split(',')
            .map(Number)
        ),
        new Vector3(
          ...player['RightHandUp']
            .replace(/[()\s]/g, '')
            .split(',')
            .map(Number)
        )
      );
      sign = 1;
  }

  return [
    position.x + direction.x * distance * sign,
    position.y + direction.y * distance * sign,
    position.z + direction.z * distance * sign
  ];
};
