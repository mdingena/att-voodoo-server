import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import { VoodooServer, PreparedSpells, decodeString, parsePrefab } from '../../voodoo';

export const postIncantation =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      /* Verify player is near a Spellcrafting Conduit. */
      const { Result: nearbyPrefabs } = await voodoo.command({ accountId, command: `select find ${accountId} 4` });

      if ((nearbyPrefabs ?? []).length === 0) {
        return clientResponse.status(400).json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit',
          nearbyPrefabs
        });
      }

      const nearConduit = nearbyPrefabs.find(({ Name }: { Name: string }) => /^Green_Crystal_cluster_03.*/i.test(Name));

      if (!nearConduit) {
        return clientResponse.json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit'
        });
      }

      /* Get verbal spell component. */
      const [verbalSpellComponent, oneOfMaterialSpellComponents]: [string, string[]] = clientRequest.body;

      /* Get material spell component. */
      const beltIndex = 3 - voodoo.players[accountId].incantations.length;
      const {
        Result: [{ Belt: inventory }]
      } = await voodoo.command({ accountId, command: `player inventory ${accountId}` });
      const beltItemId: number = inventory[beltIndex]?.Identifier ?? 0;

      if (beltItemId === 0) {
        return clientResponse.json({
          ok: false,
          error: `Requires associated material spell component in belt slot ${4 - beltIndex}`
        });
      }

      /* Get belt item prefab string. */
      voodoo.command({ accountId, command: `select ${beltItemId}` });
      const { Result: encodedPrefab }: { Result: string } = await voodoo.command({
        accountId,
        command: 'select tostring'
      });

      /* Decode and parse the prefab string. */
      const decodedString = decodeString(encodedPrefab);
      const materialSpellComponent = parsePrefab(decodedString);

      if (!materialSpellComponent || !oneOfMaterialSpellComponents.includes(materialSpellComponent)) {
        return clientResponse.json({
          ok: false,
          error: `Requires associated material spell component in belt slot ${4 - beltIndex}`
        });
      }

      /* Destroy material spell component. */
      await voodoo.command({ accountId, command: `wacky destroy ${beltItemId}` });

      /* Append to player's incantations. */
      let incantations = voodoo.addIncantation({
        accountId,
        incantation: { verbalSpellComponent, materialSpellComponent, decodedString }
      });

      /* Automatically seal the spell if player has 4 incancations now. */
      if (voodoo.players[accountId].incantations.length === 4) {
        let preparedSpells: PreparedSpells = [];

        /* Search for spell in spellbook matching player's incantations. */
        const spell = voodoo.spellbook.get(incantations);

        if (spell) {
          if (spell.requiresPreparation) {
            /* Store the spell with a trigger. */
            preparedSpells = await voodoo.prepareSpell({ accountId, incantations, spell });
          } else {
            /* Cast the spell immediately. */
            spell.cast(voodoo, accountId);
          }
        } else {
          // @todo somehow feedback that there was no spell associated
        }

        /* Clear player's incantations. */
        const newIncantations = voodoo.clearIncantations({ accountId });

        if (newIncantations.length) {
          return clientResponse.status(500).json({
            ok: false,
            error: "Couldn't clear your incantations"
          });
        }

        if (preparedSpells.length) {
          clientResponse.json({ ok: true, result: { incantations, preparedSpells } });
        } else {
          clientResponse.json({ ok: true, result: { incantations } });
        }
      } else {
        clientResponse.json({ ok: true, result: { incantations } });
      }
    } catch (error) {
      voodoo.logger.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
