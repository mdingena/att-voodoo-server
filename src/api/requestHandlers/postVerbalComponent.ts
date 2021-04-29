import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer } from '../../voodoo';
import { selectSession } from '../../db/sql';

export const postVerbalComponent = (voodoo: VoodooServer): RequestHandler => async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';

  try {
    /* Verif the player. */
    const accessToken = auth.replace(/Bearer\s+/i, '');
    const session = await db.query(selectSession, [accessToken]);

    if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

    const accountId = session.rows[0].account_id;

    /* Verify player is near a Spellcrafting Conduit. */
    const { Result: surroundingPrefabs } = await voodoo.command({ accountId, command: `select find ${accountId} 4` });
    const nearConduit = surroundingPrefabs.find(
      ({ Name }: { Name: string }) => !!Name.match(/Green_Crystal_cluster_03/i)
    );

    if (!nearConduit) return clientResponse.json({ ok: false, error: 'Not near a Spellcrafting Conduit' });

    /* Get verbal spell component. */
    const { verbalComponent, requiresMaterialComponent } = clientRequest.body;

    /* Get material spell component. */
    let materialComponent: number | undefined;
    if (requiresMaterialComponent) {
      const {
        Result: { Belt: materialComponents }
      } = await voodoo.command({ accountId, command: `player inventory ${accountId}` });
      const beltIndex = 3 - voodoo.players[accountId].incantations.length;
      materialComponent = materialComponents[beltIndex]?.prefabHash;

      if (!materialComponent)
        return clientResponse.json({
          ok: false,
          error: `Requires material spell component in belt slot ${beltIndex + 1}`
        });
    }

    /* Append to player's incantations. */
    const incantations = voodoo.addIncantation({ accountId, incantation: [verbalComponent, materialComponent ?? 0] });

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
