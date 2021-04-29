import { ServerConnection } from 'js-tale';
import { spawnFrom, potionEmpty } from '../strings';

export const craftFlask = async (connection: ServerConnection, accountId: number) => {
  const { result: player } = await connection.send(`player detailed ${accountId}`);
  const [px, py, pz] = spawnFrom(player, 'rightPalm', 0.3);

  // some quaternion stuff here?

  const transform = { px, py, pz, qx: 0, qy: 0, qz: 0, qw: 1, s: 1 };

  const results = await connection.send(`spawn exact ${potionEmpty(transform)}`);
};
