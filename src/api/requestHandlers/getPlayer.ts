import { RequestHandler } from 'express';
import { db } from '../../db';
import { VoodooServer, PreparedSpells, Experience, Dexterity } from '../../voodoo';
import { selectSession, selectPreparedSpells, selectExperience, selectUser } from '../../db/sql';

export const getPlayer =
  (voodoo: VoodooServer): RequestHandler =>
  async (clientRequest, clientResponse) => {
    const auth = clientRequest.headers.authorization ?? '';

    try {
      /* Verify the player. */
      const accessToken = auth.replace(/Bearer\s+/i, '');
      const session = await db.query(selectSession, [accessToken]);

      if (!session.rows.length) return clientResponse.status(404).json({ ok: false, error: 'Session not found' });

      /* Get player details. */
      const accountId = session.rows[0].account_id;
      const { serverId } = voodoo.players[accountId];

      let player: {
        preparedSpells: PreparedSpells;
        experience: Experience;
        dexterity: Dexterity;
      };

      if (accountId && serverId) {
        const [preparedSpells, experience, user] = await Promise.all([
          db.query(selectPreparedSpells, [accountId, serverId]),
          db.query(selectExperience, [accountId, serverId]),
          db.query(selectUser, [accountId])
        ]);

        player = {
          preparedSpells: JSON.parse(preparedSpells.rows[0]?.prepared_spells ?? '[]'),
          experience: {
            upgrades: JSON.parse(experience.rows[0]?.upgrades ?? '{}'),
            abjurationXpTotal: experience.rows[0]?.abjuration_xp_total ?? 0,
            abjurationXpSpent: experience.rows[0]?.abjuration_xp_spent ?? 0,
            conjurationXpTotal: experience.rows[0]?.conjuration_xp_total ?? 0,
            conjurationXpSpent: experience.rows[0]?.conjuration_xp_spent ?? 0,
            evocationXpTotal: experience.rows[0]?.evocation_xp_total ?? 0,
            evocationXpSpent: experience.rows[0]?.evocation_xp_spent ?? 0,
            transmutationXpTotal: experience.rows[0]?.transmutation_xp_total ?? 0,
            transmutationXpSpent: experience.rows[0]?.transmutation_xp_spent ?? 0
          },
          dexterity: user.rows[0]?.dexterity ?? 'rightHand/palm'
        };
      } else {
        player = {
          preparedSpells: [],
          experience: {
            upgrades: {},
            abjurationXpTotal: 0,
            abjurationXpSpent: 0,
            conjurationXpTotal: 0,
            conjurationXpSpent: 0,
            evocationXpTotal: 0,
            evocationXpSpent: 0,
            transmutationXpTotal: 0,
            transmutationXpSpent: 0
          },
          dexterity: 'rightHand/palm'
        };
      }

      clientResponse.json({ ok: true, result: player });
    } catch (error: unknown) {
      console.error(error);
      clientResponse.status(500).json({ ok: false, error: (error as Error).message });
    }
  };
