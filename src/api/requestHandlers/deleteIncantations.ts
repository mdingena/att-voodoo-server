import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, spawn, spawnFrom } from '../../voodoo';
import { PrefabData } from 'att-string-transcoder';
import { selectSession } from '../../db/sql';
import { EvokeAngle, EvokeHandedness } from '../../voodoo/spellbook';

export const deleteIncantations =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) {
        return clientResponse.status(404).json({
          ok: false,
          error: 'Session not found'
        });
      }

      /* Respawn consumed weapon, if any. */
      const accountId = session.rows[0].account_id;

      if (voodoo.players[accountId].incantations[0]?.materialSpellComponent === 'hilted apparatus') {
        const { prefab } = voodoo.players[accountId].incantations[0].decodedString;
        const player = await voodoo.getPlayerDetailed({ accountId });

        if (typeof player === 'undefined') {
          return clientResponse.status(404).json({
            ok: false,
            error: 'Player not found'
          });
        }

        const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
        const { position, rotation } = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

        const respawn: PrefabData = {
          ...prefab,
          prefabObject: {
            ...prefab.prefabObject,
            position,
            rotation,
            scale: 1
          },
          components: {
            ...prefab.components,
            NetworkRigidbody: {
              ...prefab.components?.NetworkRigidbody,
              position,
              rotation
            }
          }
        };

        spawn(voodoo, accountId, respawn);
      }

      /* Clear player's incantations. */
      const incantations = voodoo.clearIncantations({ accountId });

      if (incantations.length) {
        return clientResponse.status(500).json({
          ok: false,
          error: "Couldn't clear your incantations"
        });
      }

      clientResponse.json({ ok: true, result: incantations });
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
