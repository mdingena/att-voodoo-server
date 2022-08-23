import { RequestHandler } from 'express';
import { db } from '../../db';
import {
  VoodooServer,
  PreparedSpells,
  spawn,
  spawnFrom,
  SpellpageIncantation,
  EvokeHandedness,
  EvokeAngle
} from '../../voodoo';
import { PrefabData } from 'att-string-transcoder';
import { selectSession } from '../../db/sql';

export const getSeal =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      /* Get the player's current incantations. */
      const incantations = voodoo.players[accountId].incantations.map<SpellpageIncantation>(
        ({ verbalSpellComponent, materialSpellComponent, studyFeedback }) => [
          verbalSpellComponent,
          materialSpellComponent,
          studyFeedback
        ]
      );

      if (incantations.length !== 1 || incantations[0][0] !== process.env.CONJURE_HEARTFRUIT_INCANTATION) {
        /* Verify player is near a Spellcrafting Conduit. */
        const selectFindResponse = await voodoo.command<{ Result: { Name: string; Identifier: number }[] }>({
          accountId,
          command: `select find ${accountId} ${voodoo.config.CONDUIT_DISTANCE}`
        });

        if (typeof selectFindResponse === 'undefined') {
          return clientResponse.status(500).json({ ok: false, error: 'No prefabs found' });
        }

        const { Result: nearbyPrefabs } = selectFindResponse;

        if ((nearbyPrefabs ?? []).length === 0) {
          voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

          return clientResponse.status(406).json({
            ok: false,
            error: 'Not near a Spellcrafting Conduit',
            nearbyPrefabs
          });
        }

        const nearConduit = nearbyPrefabs.find(({ Name }: { Name: string }) =>
          voodoo.config.CONDUIT_PREFABS.test(Name)
        );

        if (!nearConduit) {
          voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

          return clientResponse.status(406).json({
            ok: false,
            error: 'Not near a Spellcrafting Conduit'
          });
        }
      }

      /* Search for spell in spellbook matching player's incantations. */
      const spell = voodoo.spellbook.get(incantations);

      let preparedSpells: PreparedSpells = [];

      if (spell) {
        if (spell.key !== 'conjureHeartfruit') {
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
        }
      } else {
        if (incantations[0]?.[1] === 'hilted apparatus') {
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
        // @todo somehow feedback that there was no spell associated
      }

      /* Set Heartfruit casting state. */
      voodoo.setCastingHeartfruit({ accountId, isCastingHeartfruit: spell?.key === 'conjureHeartfruit' });

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
            preparedSpells,
            isCastingHeartfruit: spell?.key === 'conjureHeartfruit'
          }
        });
      } else {
        clientResponse.json({
          ok: true,
          result: {
            experience: voodoo.players[accountId].experience,
            incantations,
            isCastingHeartfruit: spell?.key === 'conjureHeartfruit'
          }
        });
      }
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
