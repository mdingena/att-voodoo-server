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

const HEX_RADIUS = 0.25;

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

  const player = await voodoo.getPlayerDetailed({ accountId });

  if (typeof player === 'undefined') return;

  const playerHeadPosition = parseVector(player.HeadPosition);
  const playerHeadForward = parseVector(player.HeadForward);
  const heartfruitPosition = parseVector(Object.values(heartfruit.prefabObject.position));

  const conduitOrigin = new Object3D();
  conduitOrigin.position.add(heartfruitPosition).setY(playerHeadPosition.y);

  const conduitFacing = new Vector3().add(conduitOrigin.position).add(playerHeadForward);
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
          scale: 0.1
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

  const [zero, one, two, three, four, five] = await Promise.all(
    conduitStrings.map(string => voodoo.command<SpawnResult>({ accountId, command: `spawn string-raw ${string}` }))
  );

  if (
    typeof zero === 'undefined' ||
    typeof one === 'undefined' ||
    typeof two === 'undefined' ||
    typeof three === 'undefined' ||
    typeof four === 'undefined' ||
    typeof five === 'undefined'
  ) {
    console.error("Error: One or more blood conduits didn't spawn.");

    for (const result of [zero, one, two, three, four, five]) {
      typeof result !== 'undefined' && voodoo.command({ accountId, command: `wacky destroy ${result.Identifier}` });
    }

    return;
  }

  const conduits: BloodConduits = {
    [zero.Identifier]: {
      id: zero.Identifier,
      key: 'zero',
      isActivated: activated.includes(0)
    },
    [one.Identifier]: {
      id: one.Identifier,
      key: 'one',
      isActivated: activated.includes(1)
    },
    [two.Identifier]: {
      id: two.Identifier,
      key: 'two',
      isActivated: activated.includes(2)
    },
    [three.Identifier]: {
      id: three.Identifier,
      key: 'three',
      isActivated: activated.includes(3)
    },
    [four.Identifier]: {
      id: four.Identifier,
      key: 'four',
      isActivated: activated.includes(4)
    },
    [five.Identifier]: {
      id: five.Identifier,
      key: 'five',
      isActivated: activated.includes(5)
    }
  };

  voodoo.setBloodConduits({ accountId, bloodConduits: conduits });
};
