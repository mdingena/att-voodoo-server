import { DecodedString, PrefabHash } from 'att-string-transcoder';
import { parseFlask, parseHiltedApparatus, parseLeather, parseWedge } from '../parsers';

export const parsePrefab = (decoded: DecodedString): string | undefined => {
  switch (decoded.hash) {
    /**
     * FUEL
     */
    case PrefabHash.Grass_Clump:
      return 'grass clump';

    case PrefabHash.Coal:
      return 'coal';

    case PrefabHash.MRK_Fuel_Core:
      return 'fuel core';

    case PrefabHash.MRK_Molten_Core:
      return 'molten core';

    /**
     * ROCK
     */
    case PrefabHash.Stone:
      return 'rock';

    /**
     * FLINT
     */
    case PrefabHash.Flint:
      return 'flint';

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
     * HEALING POD
     */
    case PrefabHash.Healing_Pod:
      return 'healing pod';

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

    case PrefabHash.Spriggull_Fletching_Blue:
      return 'blue spriggull fletching';

    case PrefabHash.Spriggull_Feather_Red:
      return 'red spriggull feather';

    case PrefabHash.Spriggull_Fletching_Red:
      return 'red spriggull fletching';

    /**
     * BONE
     */
    case PrefabHash.Small_Bone_Spike:
      return 'spriggull bone shard';

    case PrefabHash.SpriggullDrumstick_Bone:
      return 'spriggull leg bone';

    case PrefabHash.Babu_Leg_Bone:
      return 'babu leg bone';

    /**
     * TREE SEEDS
     */
    case PrefabHash.Ash_Tree_Seed:
      return 'ash tree seed';

    case PrefabHash.Birch_Tree_Seed:
      return 'birch tree seed';

    case PrefabHash.Oak_Tree_Seed:
      return 'oak tree seed';

    case PrefabHash.Redwood_Tree_Seed:
      return 'redwood tree seed';

    case PrefabHash.Wallnut_Tree_Seed:
      return 'wallnut tree seed';

    /**
     * MEAT
     */
    case PrefabHash.SpriggullDrumstick_Full_Burnt:
      return 'burnt spriggull leg';

    case PrefabHash.SpriggullDrumstick_Full_Cooked:
      return 'cooked spriggull leg';

    case PrefabHash.SpriggullDrumstick_Full_Ripe:
      return 'uncooked spriggull leg';

    case PrefabHash.SpriggullDrumstick_Half_Burnt:
      return 'burnt spriggull chop';

    case PrefabHash.SpriggullDrumstick_Half_Cooked:
      return 'cooked spriggull chop';

    case PrefabHash.SpriggullDrumstick_Half_Ripe:
      return 'uncooked spriggull chop';

    case PrefabHash.Babu_Leg_Full_Burnt:
      return 'burnt babu leg';

    case PrefabHash.Babu_Leg_Full_Cooked:
      return 'cooked babu leg';

    case PrefabHash.Babu_Leg_Full_Ripe:
      return 'uncooked babu leg';

    case PrefabHash.Babu_Leg_Half_Burnt:
      return 'burnt babu chop';

    case PrefabHash.Babu_Leg_Half_Cooked:
      return 'cooked babu chop';

    case PrefabHash.Babu_Leg_Half_Ripe:
      return 'uncooked babu chop';

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
      return 'viridium ingot';

    case PrefabHash.Red_Iron_Ingot:
      return 'red iron ingot';

    case PrefabHash.Silver_Ingot:
      return 'silver ingot';

    case PrefabHash.White_Gold_Ingot:
      return 'electrum ingot';

    /**
     * RUSTY TOOLS
     */
    case PrefabHash.Rusty_Axe:
      return 'rusty axe';

    case PrefabHash.Rusty_Pickaxe:
      return 'rusty pickaxe';

    case PrefabHash.Rusty_Short_Sword:
      return 'rusty shortsword';

    case PrefabHash.Rusty_Pitchfork:
      return 'rusty pitchfork';

    /**
     * WOODCUT WEDGE
     */
    case PrefabHash.Woodcut_Wedge:
      return parseWedge(decoded.prefab);

    /**
     * HILTED APPARATUS
     */
    case PrefabHash.Curled_Wooden_Handle:
    case PrefabHash.Gacha_Handle:
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
    case PrefabHash.Hebios_Handle_Katana:
    case PrefabHash.Hebios_Handle_Kunai:
    case PrefabHash.Hebios_Handle_Naginata:
    case PrefabHash.Hebios_Handle_Wakizashi:
    case PrefabHash.Rod_Slim_40cm:
    case PrefabHash.Rod_Medium:
    case PrefabHash.Shield_Core_Handle:
      return parseHiltedApparatus(decoded.prefab);

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
     * GOTERA
     */
    case PrefabHash.Gotera_Seedling_Orb:
      return 'gotera seedling';

    case PrefabHash.Redwood_Gotera_Core:
      return 'redwood gotera core';

    /**
     * SOULBOUND
     */
    case PrefabHash.Key_Standard:
      return 'soulbond';

    /**
     * UNRECOGNISED
     */
    default:
      return undefined;
  }
};
