import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { PrefabHash } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const ANAMNESIS_MAP = new Map([
  [PrefabHash.Apple_Core_Burnt, PrefabHash.Apple_Core_Cooked],
  [PrefabHash.Apple_Core_Cooked, PrefabHash.Apple_Core_Ripe],
  [PrefabHash.Apple_Core_Ripe, PrefabHash.Apple_Core_Unripe],
  [PrefabHash.Apple_Full_Burnt, PrefabHash.Apple_Full_Cooked],
  [PrefabHash.Apple_Full_Cooked, PrefabHash.Apple_Full_Ripe],
  [PrefabHash.Apple_Full_Ripe, PrefabHash.Apple_Full_Unripe],
  [PrefabHash.Blueberry_Full_Burnt, PrefabHash.Blueberry_Full_Cooked],
  [PrefabHash.Blueberry_Full_Cooked, PrefabHash.Blueberry_Full_Ripe],
  [PrefabHash.Blueberry_Full_Ripe, PrefabHash.Blueberry_Full_Unripe],
  [PrefabHash.Carrot_Full_Burnt, PrefabHash.Carrot_Full_Cooked],
  [PrefabHash.Carrot_Full_Cooked, PrefabHash.Carrot_Full_Ripe],
  [PrefabHash.Carrot_Full_Ripe, PrefabHash.Carrot_Full_Unripe],
  [PrefabHash.Eggplant_Full_Burnt, PrefabHash.Eggplant_Full_Cooked],
  [PrefabHash.Eggplant_Full_Cooked, PrefabHash.Eggplant_Full_Ripe],
  [PrefabHash.Eggplant_Full_Ripe, PrefabHash.Eggplant_Full_Unripe],
  [PrefabHash.Garlic_Full_Burnt, PrefabHash.Garlic_Full_Cooked],
  [PrefabHash.Garlic_Full_Cooked, PrefabHash.Garlic_Full_Ripe],
  [PrefabHash.Garlic_Full_Ripe, PrefabHash.Garlic_Full_Unripe],
  [PrefabHash.Garlic_Full_Unripe, PrefabHash.Garlic_Roots],
  [PrefabHash.Onion_Full_Burnt, PrefabHash.Onion_Full_Cooked],
  [PrefabHash.Onion_Full_Cooked, PrefabHash.Onion_Full_Ripe],
  [PrefabHash.Onion_Full_Ripe, PrefabHash.Onion_Full_Unripe],
  [PrefabHash.Onion_Full_Unripe, PrefabHash.Onion_Roots],
  [PrefabHash.Potato_Full_Burnt, PrefabHash.Potato_Full_Cooked],
  [PrefabHash.Potato_Full_Cooked, PrefabHash.Potato_Full_Ripe],
  [PrefabHash.Potato_Full_Ripe, PrefabHash.Potato_Full_Unripe],
  [PrefabHash.Potato_Full_Unripe, PrefabHash.Potato_Sapling],
  [PrefabHash.pumpkin_piece_burnt, PrefabHash.pumpkin_piece_cooked],
  [PrefabHash.pumpkin_piece_cooked, PrefabHash.pumpkin_piece_ripe],
  [PrefabHash.pumpkin_piece_ripe, PrefabHash.pumpkin_piece_unripe],
  [PrefabHash.Tomato_Full_Burnt, PrefabHash.Tomato_Full_Cooked],
  [PrefabHash.Tomato_Full_Cooked, PrefabHash.Tomato_Full_Ripe],
  [PrefabHash.Tomato_Full_Ripe, PrefabHash.Tomato_Full_Unripe]
]);

export const anamnesis =
  (prefabObjectHash: number): SpellFunction =>
  async (voodoo, accountId, upgradeConfigs) => {
    const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'anamnesis' });
    const attributes = getSpellAttributes(upgrades, upgradeConfigs);

    const player = await voodoo.getPlayerDetailed({ accountId });
    const rightHand = spawnFrom(player, 'rightPalm', 0.05);

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: prefabObjectHash,
        position: rightHand.position,
        rotation: rightHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: rightHand.position,
          rotation: rightHand.rotation,
          velocity: spawnVelocity(rightHand.direction, attributes.velocity)
        }
      }
    });
  };
