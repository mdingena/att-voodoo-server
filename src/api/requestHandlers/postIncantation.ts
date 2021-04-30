import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import { VoodooServer } from '../../voodoo';

export const postIncantation = (voodoo: VoodooServer): RequestHandler => async (clientRequest, clientResponse) => {
  const auth = clientRequest.headers.authorization ?? '';

  try {
    /* Verify the player. */
    const accessToken = auth.replace(/Bearer\s+/i, '');
    const session = await db.query(selectSession, [accessToken]);

    if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

    const accountId = session.rows[0].account_id;

    /* Verify player is near a Spellcrafting Conduit. */
    const findResponse = await voodoo.command({ accountId, command: `select find ${accountId} 4` });

    if (!findResponse.ok) return clientResponse.status(400).json(findResponse);

    const nearConduit = findResponse.result.find(({ Name }: { Name: string }) =>
      /Green_Crystal_cluster_03/i.test(Name)
    );

    if (!nearConduit) return clientResponse.json({ ok: false, error: 'Not near a Spellcrafting Conduit' });

    /* Get verbal spell component. */
    const [verbalComponent, oneOfMaterialComponents]: [string, number[]] = clientRequest.body;

    /* Get material spell component. */
    const beltIndex = 3 - voodoo.players[accountId].incantations.length;
    let materialComponent: number = 0;
    let inventory = [];
    if (oneOfMaterialComponents.length) {
      const {
        result: { Belt }
      } = await voodoo.command({ accountId, command: `player inventory ${accountId}` });
      inventory = Belt;

      if (!oneOfMaterialComponents.includes(inventory[beltIndex]?.PrefabHash ?? 0)) {
        return clientResponse.json({
          ok: false,
          error: `Requires material spell component in belt slot ${beltIndex + 1}`
        });
      }

      materialComponent = inventory[beltIndex]?.PrefabHash ?? 0;
    }

    /* Append to player's incantations. */
    const incantations = voodoo.addIncantation({ accountId, incantation: [verbalComponent, materialComponent] });

    /* Remove material component */
    if (materialComponent > 0) {
      const networkId = inventory[beltIndex]?.Identifier ?? 0;

      if (networkId) {
        await voodoo.command({ accountId, command: `select ${networkId}` });
        await voodoo.command({ accountId, command: `select destroy` }); // @todo Very risky! See if we can get a select destroy <networkid> command
      }
    }

    /* Automatically seal the spell if player has 4 incancations now. */
    if (voodoo.players[accountId].incantations.length === 4) {
      /* Search for spell in spellbook matching player's incantations. */
      const spell = voodoo.spellbook.get(incantations);

      if (spell) {
        if (spell.requiresPreparation) {
          /* Store the spell with a trigger. */
          await voodoo.prepareSpell({ accountId, incantations, spell });
        } else {
          /* Cast the spell immediately. */
          spell.cast(voodoo, accountId);
        }
      }

      /* Clear player's incantations. */
      voodoo.clearIncantations({ accountId });
    }

    clientResponse.json({ ok: true, result: incantations });
  } catch (error) {
    clientResponse.status(500).json({ ok: false, error });
  }
};
