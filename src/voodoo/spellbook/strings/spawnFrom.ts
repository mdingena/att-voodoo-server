import { Quaternion, Vector3 } from 'three';

export const spawnFrom = (player: any, from: string, distance: number = 0) => {
  let position: Vector3, direction: Vector3, sign: 1 | -1;
  const quaternion: Quaternion = new Quaternion();

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

  quaternion.setFromAxisAngle(direction, Math.PI / 2);

  return {
    px: position.x + direction.x * sign * distance,
    py: position.y + direction.y * sign * distance,
    pz: position.z + direction.z * sign * distance,
    qx: quaternion.x,
    qy: quaternion.y,
    qz: quaternion.z,
    qw: quaternion.w,
    dx: direction.x * sign,
    dy: direction.y * sign,
    dz: direction.z * sign
  };
};
