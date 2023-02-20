import { ConjureHeartfruitWord, HEART, reduceHealth } from 'att-voodoo-book-of-blood';
import { HEARTFRUIT_SECRET, verifyHeartfruitIncantation } from 'att-voodoo-book-of-blood';
import { RequestHandler } from 'express';
import { db } from '../../db';
import { selectSession } from '../../db/sql';
import { VoodooServer } from '../../voodoo';
import { conjureHeartfruit } from '../../voodoo/spellbook/spells/conjureHeartfruit';

export const postHeartfruit =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      const accountId = session.rows[0].account_id;

      const isCastingHeartfruit = voodoo.players[accountId].isCastingHeartfruit;

      if (!isCastingHeartfruit) {
        return clientResponse.status(403).json({ ok: false, error: 'Incorrect sequence' });
      }

      voodoo.setCastingHeartfruit({ accountId, isCastingHeartfruit: false });
      const cooldownRemaining = voodoo.setHeartfruitCastTime({ accountId });

      const incantation: ConjureHeartfruitWord[] = clientRequest.body;

      const verifiedIncantation = verifyHeartfruitIncantation(incantation, HEARTFRUIT_SECRET);

      if (!verifiedIncantation) {
        if (cooldownRemaining > 0) {
          const hungerResponse = await voodoo.command<{ Result?: { Value: number } }>({
            accountId,
            command: `player check-stat ${accountId} hunger`
          });

          const currentHunger = hungerResponse?.Result?.Value ?? 0.15;
          const targetHunger = Math.min(currentHunger, 0.15);

          reduceHealth(voodoo, accountId, [HEART, 0]);
          voodoo.command({ accountId, command: `player set-stat ${accountId} fullness 5` });
          voodoo.command({ accountId, command: `player set-stat ${accountId} hunger ${targetHunger}` });
          voodoo.command({ accountId, command: `player message ${accountId} "You feel exhausted." 3` });

          return clientResponse
            .status(429)
            .set('Retry-After', Math.ceil(cooldownRemaining / 1000).toString())
            .json({ ok: false, error: 'Rate limiting' });
        } else {
          reduceHealth(voodoo, accountId, [HEART, 0]);
          voodoo.command({
            accountId,
            command: `player message ${accountId} "Your words failed to attune the weave." 3`
          });

          return clientResponse.status(412).json({ ok: false, error: 'Incorrect incantations' });
        }
      }

      console.log(`Heartfruit verified for ${voodoo.players[accountId].name} using ${verifiedIncantation}.`);

      conjureHeartfruit(voodoo, accountId, {});

      clientResponse.json({ ok: true });
    } catch (error: any) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: error.message });
    }
  };
