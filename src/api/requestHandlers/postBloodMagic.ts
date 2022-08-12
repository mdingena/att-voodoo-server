import { pages } from 'att-voodoo-spellbook';
import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import {
  VoodooServer,
  PreparedSpells,
  parsePrefab,
  spawn,
  spawnFrom,
  StudyFeedback,
  EvokeAngle,
  EvokeHandedness
} from '../../voodoo';
import { PrefabData, decodeString } from 'att-string-transcoder';

export const postBloodMagic =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      /* Get player inventory. */
      const inventory = await voodoo.getPlayerInventory({ accountId });

      if (typeof inventory === 'undefined')
        return clientResponse.status(500).json({ ok: false, error: 'Inventory not found' });

      /* Get player off-hand content. */
      const dexterity = voodoo.getDexterity({ accountId });
      const offHandKey = dexterity.split('/')[0] === 'rightHand' ? 'LeftHand' : 'RightHand';

      const offHandItemId = inventory[offHandKey]?.Identifier;

      if (typeof offHandItemId === 'undefined') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid conduit' });
      }

      /* Get held item prefab string. */
      voodoo.command({ accountId, command: `select ${offHandItemId}` });
      const selectTostringResponse = await voodoo.command<{ ResultString: string }>({
        accountId,
        command: 'select tostring'
      });

      if (typeof selectTostringResponse === 'undefined') {
        return clientResponse.status(404).json({ ok: false, error: 'Save string not found' });
      }

      const encodedPrefab = selectTostringResponse.ResultString;

      /* Decode and parse the prefab string. */
      const decodedString = decodeString(encodedPrefab);
      const offHandItem = parsePrefab(decodedString);

      /* Verify player is touching a Heartfruit with off-hand. */
      if (offHandItem !== 'heartfruit') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid conduit' });
      }

      /* Enable Blood Magic mode. */
      clientResponse.json({
        ok: true,
        result: true
      });
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
