import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, Incantation } from '../../voodoo';
import { selectSession } from '../../db/sql';

export const postIncantation = (voodoo: VoodooServer): RequestHandler => async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';

  try {
    /* Verif the player. */
    const accessToken = auth.replace(/Bearer\s+/i, '');
    const session = await db.query(selectSession, [accessToken]);

    if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

    const accountId = session.rows[0].account_id;

    /* Verify player is near a Spellcrafting Conduit. */
    const findResponse = await voodoo.command({ accountId, command: `select find ${accountId} 4` });

    if (!findResponse.ok) return clientResponse.status(400).json(findResponse);

    const nearConduit = findResponse.result.find(
      ({ Name }: { Name: string }) => !!Name.match(/Green_Crystal_cluster_03/i)
    );

    if (!nearConduit) return clientResponse.json({ ok: false, error: 'Not near a Spellcrafting Conduit' });

    /* Get verbal spell component. */
    const [verbalComponent, materialComponent]: Incantation = clientRequest.body;

    /* Get material spell component. */
    if (materialComponent > 0) {
      const {
        result: { Belt: materialComponents }
      } = await voodoo.command({ accountId, command: `player inventory ${accountId}` });
      const beltIndex = 3 - voodoo.players[accountId].incantations.length;

      if (materialComponent !== materialComponents[beltIndex]?.prefabHash ?? 0)
        return clientResponse.json({
          ok: false,
          error: `Requires material spell component in belt slot ${beltIndex + 1}`
        });
    }

    /* Append to player's incantations. */
    const incantations = voodoo.addIncantation({ accountId, incantation: [verbalComponent, materialComponent] });

    /* Search for spell in spellbook matching player's incantations. */
    const spell = voodoo.spellbook.get(incantations);

    /* Cast the spell. */
    if (spell) {
      await spell(voodoo.players[accountId].serverConnection, accountId);
      voodoo.clearIncantations({ accountId });
    } else if (voodoo.players[accountId].incantations.length === 4) {
      voodoo.clearIncantations({ accountId });
    }

    clientResponse.json({ ok: true, result: incantations });
  } catch (error) {
    clientResponse.status(500).json({ ok: false, error });
  }
};
