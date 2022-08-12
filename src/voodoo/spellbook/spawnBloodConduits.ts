import { createString, Prefab, PrefabData } from 'att-string-transcoder';
import type { VoodooServer } from '../createVoodooServer';
import { Object3D, Vector3 } from 'three';
import { parseVector } from './utils';

export type BloodConduits = Record<
  number,
  {
    id: number;
    key: string;
    isActivated: boolean;
  }
>;

type SpawnResult = {
  Identifier: number;
  Name: string;
};

const HEX_RADIUS = 0.3;

function hexCorner(i: number) {
  var angleDeg = 60 * i;
  var angleRad = (Math.PI / 180) * angleDeg;

  return {
    x: HEX_RADIUS * Math.cos(angleRad),
    y: HEX_RADIUS * Math.sin(angleRad)
  };
}

export const spawnBloodConduits = async (
  voodoo: VoodooServer,
  accountId: number,
  heartfruit: PrefabData,
  activated: number[] = []
) => {
  if (typeof heartfruit.prefabObject.position === 'undefined') return;

  const [player, inventory] = await Promise.all([
    voodoo.getPlayerDetailed({ accountId }),
    voodoo.getPlayerInventory({ accountId })
  ]);

  if (typeof player === 'undefined' || typeof inventory === 'undefined') return;

  const playerHeadPosition = parseVector(player.HeadPosition);
  const heartfruitPosition = parseVector(Object.values(heartfruit.prefabObject.position));

  const conduitOrigin = new Object3D();
  conduitOrigin.position.add(heartfruitPosition).setY(heartfruitPosition.y + 1);

  const conduitFacing = new Vector3().add(playerHeadPosition);
  conduitOrigin.lookAt(conduitFacing);

  const conduitStrings: string[] = [];

  for (let i = 0; i < 6; ++i) {
    const conduit = conduitOrigin.clone();
    const offset = hexCorner(i);

    conduit.translateX(offset.x);
    conduit.translateY(offset.y);

    const { x, y, z } = conduit.position;

    conduitStrings.push(
      createString({
        prefabObject: {
          hash: activated.includes(i) ? Prefab.Puzzle_Orb_1.hash : Prefab.Puzzle_Orb_2.hash,
          position: { x, y, z },
          scale: 0.5
        },
        components: {
          NetworkRigidbody: {
            position: { x, y, z },
            isKinematic: true,
            isServerSleeping: true
          }
        }
      })
    );
  }

  const [zephyrus, corus, caecias, subsolanus, vulturnus, africus] = await Promise.all(
    conduitStrings.map(async string => {
      const response = await voodoo.command<{ Result?: SpawnResult }>({
        accountId,
        command: `spawn string-raw ${string}`
      });

      return response?.Result?.Identifier;
    })
  );

  if (
    typeof zephyrus === 'undefined' ||
    typeof corus === 'undefined' ||
    typeof caecias === 'undefined' ||
    typeof subsolanus === 'undefined' ||
    typeof vulturnus === 'undefined' ||
    typeof africus === 'undefined'
  ) {
    console.error("Error: One or more blood conduits didn't spawn.");

    for (const id of [zephyrus, corus, caecias, subsolanus, vulturnus, africus]) {
      typeof id !== 'undefined' && voodoo.command({ accountId, command: `wacky destroy ${id}` });
    }

    return;
  }

  const conduits: BloodConduits = {
    [zephyrus]: {
      id: zephyrus,
      key: 'Zephyrus',
      isActivated: activated.includes(0)
    },
    [corus]: {
      id: corus,
      key: 'Corus',
      isActivated: activated.includes(1)
    },
    [caecias]: {
      id: caecias,
      key: 'Caecias',
      isActivated: activated.includes(2)
    },
    [subsolanus]: {
      id: subsolanus,
      key: 'Subsolanus',
      isActivated: activated.includes(3)
    },
    [vulturnus]: {
      id: vulturnus,
      key: 'Vulturnus',
      isActivated: activated.includes(4)
    },
    [africus]: {
      id: africus,
      key: 'Africus',
      isActivated: activated.includes(5)
    }
  };

  voodoo.setBloodConduits({ accountId, bloodConduits: conduits, heartfruit });
};
