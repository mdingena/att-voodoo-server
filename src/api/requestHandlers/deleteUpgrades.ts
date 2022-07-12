import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer } from '../../voodoo';
import { multiplyExperience, resetSpentExperience, selectSession } from '../../db/sql';

export const deleteUpgrades =
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
      const { Result: nearbyPrefabs } = await voodoo.command({
        accountId,
        command: `select find ${accountId} ${voodoo.config.CONDUIT_DISTANCE}`
      });

      if ((nearbyPrefabs ?? []).length === 0) {
        voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

        return clientResponse.status(406).json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit',
          nearbyPrefabs
        });
      }

      const nearConduit = nearbyPrefabs.find(({ Name }: { Name: string }) => voodoo.config.CONDUIT_PREFABS.test(Name));

      if (!nearConduit) {
        voodoo.command({ accountId, command: `player message ${accountId} "Not near a Spellcrafting Conduit" 2` });

        return clientResponse.status(406).json({
          ok: false,
          error: 'Not near a Spellcrafting Conduit'
        });
      }

      /* Verify the request. */
      const { useFreeReset } = clientRequest.body as { useFreeReset: boolean };
      const serverId = voodoo.players[accountId]?.serverId ?? 1483589932;
      const experience = await voodoo.getExperience({ accountId, serverId });
      const hasFreeResets = experience.freeResets > 0;

      if (useFreeReset && !hasFreeResets) {
        throw new Error('No free resets available.');
      }

      if (useFreeReset) {
        await db.query(resetSpentExperience, [accountId, serverId]);
      } else {
        await db.query(multiplyExperience(0.9), [accountId, serverId]);
      }

      const newExperience = await voodoo.getExperience({ accountId, serverId });

      clientResponse.json({ ok: true, result: newExperience });
    } catch (error: unknown) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: (error as Error).message });
    }
  };
