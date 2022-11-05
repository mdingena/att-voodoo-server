import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness } from '../spawnFrom';
import { parsePrefab, repairMaterial } from '../utils';
import { decodeString, PhysicalMaterialPartHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const repairWalnutDevice: SpellFunction = async (voodoo, accountId, upgradeConfigs) => {
  const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'repairWalnutDevice' });
  const attributes = getSpellAttributes(upgrades, upgradeConfigs);

  const [player, inventory] = await Promise.all([
    voodoo.getPlayerDetailed({ accountId }),
    voodoo.getPlayerInventory({ accountId })
  ]);

  if (typeof player === 'undefined' || typeof inventory === 'undefined') return;

  /* Get player main hand content. */
  const dexterity = voodoo.getDexterity({ accountId }).split('/') as [EvokeHandedness, EvokeAngle];
  const mainHandKey = dexterity[0] === 'rightHand' ? 'RightHand' : 'LeftHand';
  const mainHandItemId = inventory[mainHandKey]?.Identifier;

  if (typeof mainHandItemId === 'undefined') return;

  voodoo.command({ accountId, command: `select ${mainHandItemId}` });
  const { ResultString: encodedPrefab } = (await voodoo.command({
    accountId,
    command: 'select tostring'
  })) as { ResultString: string };

  /* Decode and parse the prefab string. */
  const decodedString = decodeString(encodedPrefab);
  const mainHandItem = parsePrefab(decodedString);

  if (mainHandItem !== 'hilted apparatus') return;

  /* Repair device. */
  const hiltedApparatus = decodedString.prefab;
  const repairAmount = attributes.reconstructor / 100;
  const repairedApparatus = repairMaterial(hiltedApparatus, PhysicalMaterialPartHash.Walnut, repairAmount);

  /* Replace device. */
  voodoo.command({ accountId, command: `wacky destroy ${mainHandItemId}` });
  spawn(voodoo, accountId, {
    ...repairedApparatus,
    components: {
      ...repairedApparatus.components,
      NetworkRigidbody: {
        ...repairedApparatus.components?.NetworkRigidbody,
        isKinematic: true
      }
    }
  });

  const { name, serverId, serverName } = voodoo.players[accountId];
  console.log(`[${serverName ?? serverId} | ${name}] cast Repair Walnut Device`);
};
