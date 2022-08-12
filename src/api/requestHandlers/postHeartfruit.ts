import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import {
  VoodooServer,
  parsePrefab,
  spawnBloodConduits,
  HEARTFRUIT_SECRET,
  spawnFrom,
  EvokeHandedness,
  EvokeAngle,
  spawn
} from '../../voodoo';
import { decodeString, Prefab } from 'att-string-transcoder';
import { Object3D, Vector3 } from 'three';

export const postHeartfruit =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      const incantation: string[] = clientRequest.body;

      if (incantation.length !== HEARTFRUIT_SECRET.length) {
        return clientResponse.status(412).json({ ok: false, error: 'Incorrect incantations' });
      }

      for (let i = 0; i < incantation.length; ++i) {
        if (incantation[i] !== HEARTFRUIT_SECRET[i]) {
          return clientResponse.status(403).json({ ok: false, error: 'Incorrect incantations' });
        }
      }

      /* Get player details. */
      const player = await voodoo.getPlayerDetailed({ accountId });
      const dexterity = voodoo.getDexterity({ accountId }).split('/') as [EvokeHandedness, EvokeAngle];

      if (typeof player === 'undefined') {
        return clientResponse.status(404).json({ ok: false, error: 'Player not found' });
      }

      const { position, direction } = spawnFrom(player, 'mainHand', dexterity, 1);

      const orientation = new Object3D();
      orientation.lookAt(new Vector3(-direction.x, 0, -direction.z));

      spawn(voodoo, accountId, {
        prefabObject: {
          hash: Prefab.Heart_Receptacle.hash,
          position: {
            x: position.x,
            y: position.y + 2,
            z: position.z
          },
          rotation: {
            x: orientation.quaternion.x,
            y: orientation.quaternion.y,
            z: orientation.quaternion.z,
            w: orientation.quaternion.w
          }
        }
      });

      voodoo.command({ accountId, command: `select snap-ground` });

      clientResponse.json({ ok: true });
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
