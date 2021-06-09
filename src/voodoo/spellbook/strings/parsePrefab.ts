import { DecodedString } from './decodeString';
import { PrefabHash } from './PrefabHash';
import { parseFlask, parseLeather } from './parsers';

export const parsePrefab = (decoded: DecodedString): string | undefined => {
  switch (decoded.hash) {
    /**
     * COAL
     */
    case PrefabHash.Coal:
      return 'coal';

    /**
     * SANDSTONE
     */
    case PrefabHash.Sandstone_Stone:
      return 'sandstone';

    /**
     * SALT
     */
    case PrefabHash.Salt:
      return 'salt';

    /**
     * DYNAMITE
     */
    case PrefabHash.Dynamite:
      return 'dynamite';

    /**
     * FIREWORK
     */
    case PrefabHash.Firework:
      return 'firework';

    /**
     * CRYSTAL
     */
    case PrefabHash.Crystal_Gem_Blue:
      return 'blue crystal gem';

    case PrefabHash.Crystal_Shard_Blue:
      return 'blue crystal shard';

    /**
     * FEATHER
     */
    case PrefabHash.Spriggull_Feather_Blue:
      return 'blue spriggull feather';

    case PrefabHash.Spriggull_Feather_Red:
      return 'red spriggull feather';

    /**
     * MUSHROOM
     */
    case PrefabHash.MushroomBrown_Full_Burnt:
      return 'burnt brown mushroom';

    case PrefabHash.MushroomBrown_Full_Cooked:
      return 'cooked brown mushroom';

    case PrefabHash.MushroomBrown_Full_Ripe:
      return 'ripe brown mushroom';

    case PrefabHash.MushroomCaveSmall_Full_Burnt:
      return 'burnt cave mushroom';

    case PrefabHash.MushroomCaveSmall_Full_Cooked:
      return 'cooked cave mushroom';

    case PrefabHash.MushroomCaveSmall_Full_Ripe:
      return 'ripe cave mushroom';

    case PrefabHash.MushroomGlowing_Full_Burnt:
      return 'burnt glowing mushroom';

    case PrefabHash.MushroomGlowing_Full_Cooked:
      return 'cooked glowing mushroom';

    case PrefabHash.MushroomGlowing_Full_Ripe:
      return 'ripe glowing mushroom';

    case PrefabHash.MushroomRed_Full_Burnt:
      return 'burnt red mushroom';

    case PrefabHash.MushroomRed_Full_Cooked:
      return 'cooked red mushroom';

    case PrefabHash.MushroomRed_Full_Ripe:
      return 'ripe red mushroom';

    /**
     * INGOT
     */
    case PrefabHash.Carsi_Ingot:
      return 'palladium ingot';

    case PrefabHash.Copper_Ingot:
      return 'copper ingot';

    case PrefabHash.Evinon_Steel_Ingot:
      return 'valyan ingot';

    case PrefabHash.Gold_Ingot:
      return 'gold ingot';

    case PrefabHash.Iron_Ingot:
      return 'iron ingot';

    case PrefabHash.Mythril_Ingot:
      return 'mythril ingot';

    case PrefabHash.Orchi_Ingot:
      return 'virdium ingot';

    case PrefabHash.Red_Iron_Ingot:
      return 'red iron ingot';

    case PrefabHash.Silver_Ingot:
      return 'silver ingot';

    case PrefabHash.White_Gold_Ingot:
      return 'electrum ingot';

    /**
     * HILTED APPARATUS
     */
    case PrefabHash.Curled_Wooden_Handle:
    case PrefabHash.Handle_Bow:
    case PrefabHash.Handle_Fist:
    case PrefabHash.Handle_Large_Branch:
    case PrefabHash.Handle_Large_Cool:
    case PrefabHash.Handle_Large_Standard:
    case PrefabHash.Handle_Long_Straight:
    case PrefabHash.Handle_Medium_Branch:
    case PrefabHash.Handle_Medium_Cool:
    case PrefabHash.Handle_Medium_Curved:
    case PrefabHash.Handle_Medium_Ridged:
    case PrefabHash.Handle_Medium_Standard:
    case PrefabHash.Handle_Medium_Straight:
    case PrefabHash.Handle_Round_Fist:
    case PrefabHash.Handle_Short:
    case PrefabHash.Handle_Short_C_Curve:
    case PrefabHash.Handle_Short_Cool:
    case PrefabHash.Handle_Short_Pointy_End:
    case PrefabHash.Handle_Short_S_Curve:
    case PrefabHash.Handle_Short_Taper:
    case PrefabHash.Handle_Spear:
    case PrefabHash.Handle_Tonfa:
      return 'hilted apparatus';

    /**
     * PRODUCE
     */
    case PrefabHash.Apple_Core_Burnt:
      return 'burnt apple core';

    case PrefabHash.Apple_Core_Cooked:
      return 'cooked apple core';

    case PrefabHash.Apple_Core_Ripe:
      return 'ripe apple core';

    case PrefabHash.Apple_Core_Unripe:
      return 'unripe apple core';

    case PrefabHash.Apple_Full_Burnt:
      return 'burnt apple';

    case PrefabHash.Apple_Full_Cooked:
      return 'cooked apple';

    case PrefabHash.Apple_Full_Ripe:
      return 'ripe apple';

    case PrefabHash.Apple_Full_Unripe:
      return 'unripe apple';

    case PrefabHash.Blueberry_Full_Burnt:
      return 'burnt blueberry';

    case PrefabHash.Blueberry_Full_Cooked:
      return 'cooked blueberry';

    case PrefabHash.Blueberry_Full_Ripe:
      return 'ripe blueberry';

    case PrefabHash.Blueberry_Full_Unripe:
      return 'unripe blueberry';

    case PrefabHash.Carrot_Full_Burnt:
      return 'burnt carrot';

    case PrefabHash.Carrot_Full_Cooked:
      return 'cooked carrot';

    case PrefabHash.Carrot_Full_Ripe:
      return 'ripe carrot';

    case PrefabHash.Carrot_Full_Unripe:
      return 'unripe carrot';

    case PrefabHash.Carrot_Leaves:
      return 'carrot leaves';

    case PrefabHash.Eggplant_Full_Burnt:
      return 'burnt eggplant';

    case PrefabHash.Eggplant_Full_Cooked:
      return 'cooked eggplant';

    case PrefabHash.Eggplant_Full_Ripe:
      return 'ripe eggplant';

    case PrefabHash.Eggplant_Full_Unripe:
      return 'unripe eggplant';

    case PrefabHash.Garlic_Full_Burnt:
      return 'burnt garlic';

    case PrefabHash.Garlic_Full_Cooked:
      return 'cooked garlic';

    case PrefabHash.Garlic_Full_Ripe:
      return 'ripe garlic';

    case PrefabHash.Garlic_Full_Unripe:
      return 'unripe garlic';

    case PrefabHash.Garlic_Leaves:
      return 'garlic leaves';

    case PrefabHash.Garlic_Roots:
      return 'garlic roots';

    case PrefabHash.Onion_Full_Burnt:
      return 'burnt onion';

    case PrefabHash.Onion_Full_Cooked:
      return 'cooked onion';

    case PrefabHash.Onion_Full_Ripe:
      return 'ripe onion';

    case PrefabHash.Onion_Full_Unripe:
      return 'unripe onion';

    case PrefabHash.Onion_Leaves:
      return 'onion leaves';

    case PrefabHash.Onion_Roots:
      return 'onion roots';

    case PrefabHash.Potato_Full_Burnt:
      return 'burnt potato';

    case PrefabHash.Potato_Full_Cooked:
      return 'cooked potato';

    case PrefabHash.Potato_Full_Ripe:
      return 'ripe potato';

    case PrefabHash.Potato_Full_Unripe:
      return 'unripe potato';

    case PrefabHash.Potato_Sapling:
      return 'potato sapling';

    case PrefabHash.pumpkin_full_burnt:
      return 'burnt pumpkin';

    case PrefabHash.pumpkin_full_cooked:
      return 'cooked pumpkin';

    case PrefabHash.pumpkin_full_ripe:
      return 'ripe pumpkin';

    case PrefabHash.pumpkin_full_unripe:
      return 'unripe pumpkin';

    case PrefabHash.pumpkin_piece_burnt:
      return 'burnt pumpkin piece';

    case PrefabHash.pumpkin_piece_cooked:
      return 'cooked pumpkin piece';

    case PrefabHash.pumpkin_piece_ripe:
      return 'ripe pumpkin piece';

    case PrefabHash.pumpkin_piece_unripe:
      return 'unripe pumpkin piece';

    case PrefabHash.Tomato_Full_Burnt:
      return 'burnt tomato';

    case PrefabHash.Tomato_Full_Cooked:
      return 'cooked tomato';

    case PrefabHash.Tomato_Full_Ripe:
      return 'ripe tomato';

    case PrefabHash.Tomato_Full_Unripe:
      return 'unripe tomato';

    /**
     * FLASK
     */
    case PrefabHash.Potion_Medium:
      return parseFlask(decoded.prefab);

    /**
     * LEATHER
     */
    case PrefabHash.Soft_Fabric_Medium_Strips:
    case PrefabHash.Soft_Fabric_Medium_Roll:
    case PrefabHash.Soft_Fabric_Large_Roll:
      return parseLeather(decoded.prefab);

    /**
     * UNRECOGNISED
     */
    default:
      return undefined;
  }
};
