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
  EvokeHandedness,
  SelectFindResponse
} from '../../voodoo';
import { PrefabData, decodeString } from 'att-string-transcoder';
import { HEART_COST, SanguinemMagicaeWord } from 'att-voodoo-book-of-blood';

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

      /* Get spell components. */
      const [verbalSpellComponent, oneOfMaterialSpellComponents, studiedSpellKey]: [string, string[], string | null] =
        clientRequest.body;

      if (typeof HEART_COST[verbalSpellComponent as SanguinemMagicaeWord] !== 'undefined') {
        return clientResponse.status(406).json({ ok: false, error: 'Invalid incantation' });
      }

      if (verbalSpellComponent !== process.env.CONJURE_HEARTFRUIT_INCANTATION) {
        /* Verify player is near a Spellcrafting Conduit. */
        const selectFindResponse = await voodoo.command<SelectFindResponse>({
          accountId,
          command: `select find ${accountId} ${voodoo.config.CONDUIT_DISTANCE}`
        });

        if (typeof selectFindResponse === 'undefined') {
          return clientResponse.status(406).json({
            ok: false,
            error: 'Not near a Spellcrafting Conduit'
          });
        }

        const nearbyPrefabs = selectFindResponse.Result;

        if ((nearbyPrefabs ?? []).length === 0) {
          voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

          return clientResponse.status(406).json({
            ok: false,
            error: 'Not near a Spellcrafting Conduit',
            nearbyPrefabs
          });
        }

        const nearConduit = nearbyPrefabs.find(({ Name }) => voodoo.config.CONDUIT_PREFABS.test(Name));

        if (!nearConduit) {
          voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

          return clientResponse.status(406).json({ ok: false, error: 'Not near a Spellcrafting Conduit' });
        }
      }

      /* Get material spell component. */
      const beltIndex = 3 - voodoo.players[accountId].incantations.length;
      const playerInventory = await voodoo.getPlayerInventory({ accountId });

      if (typeof playerInventory === 'undefined') {
        return clientResponse.status(404).json({ ok: false, error: 'Inventory not found' });
      }

      const beltItemId: number = playerInventory.Belt[beltIndex]?.Identifier ?? 0;

      if (beltItemId === 0) {
        return clientResponse.json({
          ok: false,
          error: `Requires associated material spell component in belt slot ${4 - beltIndex}`
        });
      }

      /* Get belt item prefab string. */
      voodoo.command({ accountId, command: `select ${beltItemId}` });
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
      const materialSpellComponent = parsePrefab(decodedString);

      if (!materialSpellComponent || !oneOfMaterialSpellComponents.includes(materialSpellComponent)) {
        return clientResponse.json({
          ok: false,
          error: `Requires associated material spell component in belt slot ${4 - beltIndex}`
        });
      }

      /* Destroy material spell component. */
      await voodoo.command({ accountId, command: `wacky destroy ${beltItemId}` });

      /* Assign studied spell hint. */
      let studyFeedback: StudyFeedback | undefined;
      if (studiedSpellKey !== null) {
        const studiedSpell = pages[studiedSpellKey];
        const nextIncantationIndex = voodoo.players[accountId]?.incantations.length ?? 0;
        const studiedSpellIncantation = studiedSpell?.incantations[nextIncantationIndex];
        const studiedSpellVerbalComponent = studiedSpellIncantation?.[0] ?? ' of ';
        const [studiedVerbalProperty, studiedVerbalSource] = studiedSpellVerbalComponent.split(' of ');
        const [incantedVerbalProperty, incantedVerbalSource] = verbalSpellComponent.split(' of ');
        const matchVerbalProperty = studiedVerbalProperty === incantedVerbalProperty;
        const matchVerbalSource = studiedVerbalSource === incantedVerbalSource;
        const matchMaterialComponent = studiedSpellIncantation?.[1] === materialSpellComponent;

        if (matchVerbalProperty && matchVerbalSource && matchMaterialComponent) {
          studyFeedback = StudyFeedback.Match;
        } else if (matchVerbalProperty || matchVerbalSource || matchMaterialComponent) {
          studyFeedback = StudyFeedback.Partial;
        } else {
          studyFeedback = StudyFeedback.Mismatch;
        }
      }

      /* Append to player's incantations. */
      let incantations = voodoo.addIncantation({
        accountId,
        incantation: { verbalSpellComponent, materialSpellComponent, decodedString, studyFeedback }
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

          /* Award XP. */
          await spell.xp(voodoo, accountId);
        } else {
          if (incantations[0]?.[1] === 'hilted apparatus') {
            const { prefab } = voodoo.players[accountId].incantations[0].decodedString;
            const player = await voodoo.getPlayerDetailed({ accountId });

            if (typeof player === 'undefined') {
              return clientResponse.status(404).json({ ok: false, error: 'Player not found' });
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
