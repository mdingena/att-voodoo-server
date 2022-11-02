import { SpellFunction } from '../spellbook';
// import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { DecodedString, decodeString, NetworkRigidbody } from 'att-string-transcoder';
import { spawn } from '../spawn';
import { db } from '../../../db';
import { upsertUserSetting } from '../../../db/sql';

export const pocketDimension: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  // const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'pocketDimension' });
  // const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const [player, user, inventory] = await Promise.all([
    voodoo.getPlayerDetailed({ accountId }),
    voodoo.getPlayer({ accountId }),
    voodoo.getPlayerInventory({ accountId })
  ]);

  if (typeof player === 'undefined' || typeof inventory === 'undefined') return;

  /* Remember current position and orientation. */
  const dexterity = voodoo.getDexterity({ accountId }).split('/') as [EvokeHandedness, EvokeAngle];
  const mainHand = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

  /* Get player main hand content. */
  const mainHandKey = dexterity[0] === 'rightHand' ? 'RightHand' : 'LeftHand';
  const mainHandItemId = inventory[mainHandKey]?.Identifier;

  /* Store the held item prefab. */
  let encodedPrefab: string | null = null;
  let decodedString: DecodedString | null = null;
  if (typeof mainHandItemId !== 'undefined') {
    voodoo.command({ accountId, command: `select ${mainHandItemId}` });
    const response = (await voodoo.command({
      accountId,
      command: 'select tostring'
    })) as { ResultString: string };

    /* Decode the prefab string. */
    encodedPrefab = response.ResultString;
    decodedString = decodeString(encodedPrefab);

    const isPickup = !!decodedString.prefab.components?.Pickup;

    if (!isPickup) {
      encodedPrefab = null;
      decodedString = null;
    }
  }

  if (encodedPrefab !== null) {
    db.query(upsertUserSetting('pocket_dimension'), [accountId, encodedPrefab]);
  }

  /* Spawn pocketed item in hand. */
  if (user.pocketDimension !== null) {
    const pocketItem = decodeString(user.pocketDimension);

    spawn(voodoo, accountId, {
      ...pocketItem.prefab,
      prefabObject: {
        ...pocketItem.prefab.prefabObject,
        position: decodedString?.prefab.prefabObject.position ?? mainHand.position,
        rotation: decodedString?.prefab.prefabObject.rotation ?? mainHand.rotation
      },
      components: {
        ...pocketItem.prefab.components,
        NetworkRigidbody: {
          ...pocketItem.prefab.components?.NetworkRigidbody,
          position:
            (decodedString?.prefab.components?.NetworkRigidbody as NetworkRigidbody | undefined)?.position ??
            mainHand.position,
          rotation:
            (decodedString?.prefab.components?.NetworkRigidbody as NetworkRigidbody | undefined)?.rotation ??
            mainHand.rotation,
          isKinematic: true
        }
      }
    });
  }

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Pocket Dimension`);
};
