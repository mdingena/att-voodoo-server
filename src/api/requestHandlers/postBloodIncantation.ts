import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import { VoodooServer, PreparedSpells, parsePrefab } from '../../voodoo';
import { decodeString } from 'att-string-transcoder';
import { HEART_COST, reduceHealth, SanguinemMagicaeWord } from 'att-voodoo-book-of-blood';

export const postBloodIncantation =
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

      /* Get off-hand item prefab string. */
      voodoo.command({ accountId, command: `select ${offHandItemId}` });
      const offHandTostringResponse = await voodoo.command<{ ResultString: string }>({
        accountId,
        command: 'select tostring'
      });

      if (typeof offHandTostringResponse === 'undefined') {
        return clientResponse.status(404).json({ ok: false, error: 'Save string not found' });
      }

      const encodedOffHandPrefab = offHandTostringResponse.ResultString;

      /* Decode and parse the prefab string. */
      const decodedOffHandString = decodeString(encodedOffHandPrefab);
      const offHandItem = parsePrefab(decodedOffHandString);

      /* Verify player is touching a Heartfruit with off-hand. */
      if (offHandItem !== 'heartfruit') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid conduit' });
      }

      /* Get player main hand content. */
      const mainHandKey = dexterity.split('/')[0] === 'rightHand' ? 'RightHand' : 'LeftHand';

      const mainHandItemId = inventory[mainHandKey]?.Identifier;

      if (typeof mainHandItemId === 'undefined') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid conduit' });
      }

      /* Get main hand item prefab string. */
      voodoo.command({ accountId, command: `select ${mainHandItemId}` });
      const mainHandTostringResponse = await voodoo.command<{ ResultString: string }>({
        accountId,
        command: 'select tostring'
      });

      if (typeof mainHandTostringResponse === 'undefined') {
        return clientResponse.status(404).json({ ok: false, error: 'Save string not found' });
      }

      const encodedMainHandPrefab = mainHandTostringResponse.ResultString;

      /* Decode and parse the prefab string. */
      const decodedMainHandString = decodeString(encodedMainHandPrefab);
      const mainHandItem = parsePrefab(decodedMainHandString);

      /* Verify player is touching a Blood Conduit with main hand. */
      if (mainHandItem !== 'inactive blood conduit') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid conduit' });
      }

      /* Get verbal spell component. */
      const [verbalSpellComponent]: [SanguinemMagicaeWord] = clientRequest.body;

      if (typeof HEART_COST[verbalSpellComponent] === 'undefined') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid incantation' });
      }

      /* Pay cost of verbal component. */
      const reducedHealth = reduceHealth(voodoo, accountId, HEART_COST[verbalSpellComponent]);

      if (!reducedHealth) {
        return clientResponse.status(402).json({ ok: false, error: 'Could not pay cost' });
      }

      /* Activate Blood Conduit. */
      const conduitKey = await voodoo.activateBloodConduit({ accountId, conduitId: mainHandItemId });

      if (typeof conduitKey === 'undefined') {
        return clientResponse.status(500).json({ ok: false, error: 'Problem activating conduit' });
      }

      /* Append to player's incantations. */
      let incantations = voodoo.addIncantation({
        accountId,
        incantation: {
          verbalSpellComponent,
          materialSpellComponent: conduitKey,
          decodedString: decodedMainHandString,
          studyFeedback: undefined
        }
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
            await spell.cast(voodoo, accountId);
          }

          /* Spawn any "side-effect prefabs", such as returning an empty flask for Abjuration spells. */
          await spell.spawn(voodoo, accountId);

          /* Pay casting cost. */
          if (typeof spell.preparationHeartCost !== 'undefined') {
            reduceHealth(voodoo, accountId, spell.preparationHeartCost);
          }
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
          clientResponse.json({
            ok: true,
            result: {
              experience: voodoo.players[accountId].experience,
              incantations,
              preparedSpells
            }
          });
        } else {
          clientResponse.json({
            ok: true,
            result: {
              experience: voodoo.players[accountId].experience,
              incantations
            }
          });
        }
      } else {
        clientResponse.json({
          ok: true,
          result: {
            experience: voodoo.players[accountId].experience,
            incantations: incantations.map(incantation => [incantation[0], incantation[1], undefined])
          }
        });
      }
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
