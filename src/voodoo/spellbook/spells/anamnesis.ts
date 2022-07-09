import { SpellFunction } from '../spellbook';
import { getSpellAttributes } from '../experience';
import { EvokeAngle, EvokeHandedness, spawnFrom } from '../spawnFrom';
import { spawnVelocity } from '../spawnVelocity';
import { Prefab } from 'att-string-transcoder';
import { spawn } from '../spawn';

export const ANAMNESIS_MAP = new Map([
  [Prefab.Apple_Core_Burnt.hash, Prefab.Apple_Core_Cooked.hash],
  [Prefab.Apple_Core_Cooked.hash, Prefab.Apple_Core_Ripe.hash],
  [Prefab.Apple_Core_Ripe.hash, Prefab.Apple_Core_Unripe.hash],
  [Prefab.Apple_Full_Burnt.hash, Prefab.Apple_Full_Cooked.hash],
  [Prefab.Apple_Full_Cooked.hash, Prefab.Apple_Full_Ripe.hash],
  [Prefab.Apple_Full_Ripe.hash, Prefab.Apple_Full_Unripe.hash],
  [Prefab.Blueberry_Full_Burnt.hash, Prefab.Blueberry_Full_Cooked.hash],
  [Prefab.Blueberry_Full_Cooked.hash, Prefab.Blueberry_Full_Ripe.hash],
  [Prefab.Blueberry_Full_Ripe.hash, Prefab.Blueberry_Full_Unripe.hash],
  [Prefab.Carrot_Full_Burnt.hash, Prefab.Carrot_Full_Cooked.hash],
  [Prefab.Carrot_Full_Cooked.hash, Prefab.Carrot_Full_Ripe.hash],
  [Prefab.Carrot_Full_Ripe.hash, Prefab.Carrot_Full_Unripe.hash],
  [Prefab.Eggplant_Full_Burnt.hash, Prefab.Eggplant_Full_Cooked.hash],
  [Prefab.Eggplant_Full_Cooked.hash, Prefab.Eggplant_Full_Ripe.hash],
  [Prefab.Eggplant_Full_Ripe.hash, Prefab.Eggplant_Full_Unripe.hash],
  [Prefab.Garlic_Full_Burnt.hash, Prefab.Garlic_Full_Cooked.hash],
  [Prefab.Garlic_Full_Cooked.hash, Prefab.Garlic_Full_Ripe.hash],
  [Prefab.Garlic_Full_Ripe.hash, Prefab.Garlic_Full_Unripe.hash],
  [Prefab.Garlic_Full_Unripe.hash, Prefab.Garlic_Roots.hash],
  [Prefab.Onion_Full_Burnt.hash, Prefab.Onion_Full_Cooked.hash],
  [Prefab.Onion_Full_Cooked.hash, Prefab.Onion_Full_Ripe.hash],
  [Prefab.Onion_Full_Ripe.hash, Prefab.Onion_Full_Unripe.hash],
  [Prefab.Onion_Full_Unripe.hash, Prefab.Onion_Roots.hash],
  [Prefab.Potato_Full_Burnt.hash, Prefab.Potato_Full_Cooked.hash],
  [Prefab.Potato_Full_Cooked.hash, Prefab.Potato_Full_Ripe.hash],
  [Prefab.Potato_Full_Ripe.hash, Prefab.Potato_Full_Unripe.hash],
  [Prefab.Potato_Full_Unripe.hash, Prefab.Potato_Sapling.hash],
  [Prefab.pumpkin_piece_burnt.hash, Prefab.pumpkin_piece_cooked.hash],
  [Prefab.pumpkin_piece_cooked.hash, Prefab.pumpkin_piece_ripe.hash],
  [Prefab.pumpkin_piece_ripe.hash, Prefab.pumpkin_piece_unripe.hash],
  [Prefab.Tomato_Full_Burnt.hash, Prefab.Tomato_Full_Cooked.hash],
  [Prefab.Tomato_Full_Cooked.hash, Prefab.Tomato_Full_Ripe.hash],
  [Prefab.Tomato_Full_Ripe.hash, Prefab.Tomato_Full_Unripe.hash]
]);

export const anamnesis =
  (prefabObjectHash: number): SpellFunction =>
  async (voodoo, accountId, upgradeConfigs) => {
    const upgrades = voodoo.getSpellUpgrades({ accountId, spell: 'anamnesis' });
    const attributes = getSpellAttributes(upgrades, upgradeConfigs);

    const player = await voodoo.getPlayerDetailed({ accountId });
    const dexterity = voodoo.players[accountId].dexterity.split('/') as [EvokeHandedness, EvokeAngle];
    const mainHand = spawnFrom(player, 'mainHand', [dexterity[0], 'palm'], 0.05);

    spawn(voodoo, accountId, {
      prefabObject: {
        hash: prefabObjectHash,
        position: mainHand.position,
        rotation: mainHand.rotation
      },
      components: {
        NetworkRigidbody: {
          position: mainHand.position,
          rotation: mainHand.rotation,
          velocity: spawnVelocity(mainHand.direction, attributes.velocity)
        }
      }
    });
  };
