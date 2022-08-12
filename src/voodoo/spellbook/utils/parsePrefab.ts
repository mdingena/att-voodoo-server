import { DecodedString, Prefab } from 'att-string-transcoder';
import { parseFlask, parseHiltedApparatus, parseLeather, parseWedge } from '../parsers';

export const parsePrefab = (decoded: DecodedString): string | undefined => {
  switch (decoded.hash) {
    /**
     * FUEL
     */
    case Prefab.Grass_Clump.hash:
      return 'grass clump';

    case Prefab.Coal.hash:
      return 'coal';

    case Prefab.MRK_Fuel_Core.hash:
      return 'fuel core';

    case Prefab.MRK_Molten_Core.hash:
      return 'molten core';

    /**
     * ROCK
     */
    case Prefab.Stone.hash:
      return 'rock';

    /**
     * FLINT
     */
    case Prefab.Flint.hash:
      return 'flint';

    /**
     * SANDSTONE
     */
    case Prefab.Sandstone_Stone.hash:
      return 'sandstone';

    /**
     * SALT
     */
    case Prefab.Salt.hash:
      return 'salt';

    /**
     * DYNAMITE
     */
    case Prefab.Dynamite.hash:
      return 'dynamite';

    /**
     * FIREWORK
     */
    case Prefab.Firework.hash:
      return 'firework';

    /**
     * HEALING POD
     */
    case Prefab.Healing_Pod.hash:
      return 'healing pod';

    /**
     * ARROW
     */
    case Prefab.Arrow.hash:
      return 'rusty arrow';

    case Prefab.Ka_Karimata_Arrow.hash:
      return 'karimata arrow';

    /**
     * CRYSTAL
     */
    case Prefab.Crystal_Gem_Blue.hash:
      return 'blue crystal gem';

    case Prefab.Crystal_Shard_Blue.hash:
      return 'blue crystal shard';

    /**
     * FEATHER
     */
    case Prefab.Spriggull_Feather_Blue.hash:
      return 'blue spriggull feather';

    case Prefab.Spriggull_Fletching_Blue.hash:
      return 'blue spriggull fletching';

    case Prefab.Spriggull_Feather_Red.hash:
      return 'red spriggull feather';

    case Prefab.Spriggull_Fletching_Red.hash:
      return 'red spriggull fletching';

    /**
     * BONE
     */
    case Prefab.Small_Bone_Spike.hash:
      return 'spriggull bone shard';

    case Prefab.SpriggullDrumstick_Bone.hash:
      return 'spriggull leg bone';

    case Prefab.Babu_Leg_Bone.hash:
      return 'babu leg bone';

    /**
     * TREE SEEDS
     */
    case Prefab.Ash_Tree_Seed.hash:
      return 'ash tree seed';

    case Prefab.Birch_Tree_Seed.hash:
      return 'birch tree seed';

    case Prefab.Oak_Tree_Seed.hash:
      return 'oak tree seed';

    case Prefab.Redwood_Tree_Seed.hash:
      return 'redwood tree seed';

    case Prefab.Walnut_Tree_Seed.hash:
      return 'walnut tree seed';

    /**
     * MEAT
     */
    case Prefab.SpriggullDrumstick_Full_Burnt.hash:
      return 'burnt spriggull leg';

    case Prefab.SpriggullDrumstick_Full_Cooked.hash:
      return 'cooked spriggull leg';

    case Prefab.SpriggullDrumstick_Full_Ripe.hash:
      return 'uncooked spriggull leg';

    case Prefab.SpriggullDrumstick_Half_Burnt.hash:
      return 'burnt spriggull chop';

    case Prefab.SpriggullDrumstick_Half_Cooked.hash:
      return 'cooked spriggull chop';

    case Prefab.SpriggullDrumstick_Half_Ripe.hash:
      return 'uncooked spriggull chop';

    case Prefab.Babu_Leg_Full_Burnt.hash:
      return 'burnt babu leg';

    case Prefab.Babu_Leg_Full_Cooked.hash:
      return 'cooked babu leg';

    case Prefab.Babu_Leg_Full_Ripe.hash:
      return 'uncooked babu leg';

    case Prefab.Babu_Leg_Half_Burnt.hash:
      return 'burnt babu chop';

    case Prefab.Babu_Leg_Half_Cooked.hash:
      return 'cooked babu chop';

    case Prefab.Babu_Leg_Half_Ripe.hash:
      return 'uncooked babu chop';

    case Prefab.Dais_Meat_Full_Burnt.hash:
      return 'burnt dais leg';

    case Prefab.Dais_Meat_Full_Cooked.hash:
      return 'cooked dais leg';

    case Prefab.Dais_Meat_Full_Ripe.hash:
      return 'uncooked dais leg';

    case Prefab.Dais_Meat_Half_Burnt.hash:
      return 'burnt dais chop';

    case Prefab.Dais_Meat_Half_Cooked.hash:
      return 'cooked dais chop';

    case Prefab.Dais_Meat_Half_Ripe.hash:
      return 'uncooked dais chop';

    /**
     * MUSHROOM
     */
    case Prefab.MushroomBrown_Full_Burnt.hash:
      return 'burnt brown mushroom';

    case Prefab.MushroomBrown_Full_Cooked.hash:
      return 'cooked brown mushroom';

    case Prefab.MushroomBrown_Full_Ripe.hash:
      return 'ripe brown mushroom';

    case Prefab.MushroomCaveSmall_Full_Burnt.hash:
      return 'burnt cave mushroom';

    case Prefab.MushroomCaveSmall_Full_Cooked.hash:
      return 'cooked cave mushroom';

    case Prefab.MushroomCaveSmall_Full_Ripe.hash:
      return 'ripe cave mushroom';

    case Prefab.MushroomGlowing_Full_Burnt.hash:
      return 'burnt glowing mushroom';

    case Prefab.MushroomGlowing_Full_Cooked.hash:
      return 'cooked glowing mushroom';

    case Prefab.MushroomGlowing_Full_Ripe.hash:
      return 'ripe glowing mushroom';

    case Prefab.MushroomRed_Full_Burnt.hash:
      return 'burnt red mushroom';

    case Prefab.MushroomRed_Full_Cooked.hash:
      return 'cooked red mushroom';

    case Prefab.MushroomRed_Full_Ripe.hash:
      return 'ripe red mushroom';

    /**
     * INGOT
     */
    case Prefab.Carsi_Ingot.hash:
      return 'palladium ingot';

    case Prefab.Copper_Ingot.hash:
      return 'copper ingot';

    case Prefab.Evinon_Steel_Ingot.hash:
      return 'valyan ingot';

    case Prefab.Gold_Ingot.hash:
      return 'gold ingot';

    case Prefab.Iron_Ingot.hash:
      return 'iron ingot';

    case Prefab.Mythril_Ingot.hash:
      return 'mythril ingot';

    case Prefab.Orchi_Ingot.hash:
      return 'viridium ingot';

    case Prefab.Red_Iron_Ingot.hash:
      return 'red iron ingot';

    case Prefab.Silver_Ingot.hash:
      return 'silver ingot';

    case Prefab.White_Gold_Ingot.hash:
      return 'electrum ingot';

    /**
     * RUSTY TOOLS
     */
    case Prefab.Rusty_Axe.hash:
      return 'rusty axe';

    case Prefab.Rusty_Pickaxe.hash:
      return 'rusty pickaxe';

    case Prefab.Rusty_Short_Sword.hash:
      return 'rusty shortsword';

    case Prefab.Rusty_Pitchfork.hash:
      return 'rusty pitchfork';

    /**
     * WOODCUT WEDGE
     */
    case Prefab.Woodcut_Wedge.hash:
      return parseWedge(decoded.prefab);

    /**
     * HILTED APPARATUS
     */
    case Prefab.Arrow_Shaft_Wooden.hash:
    case Prefab.Curled_Wooden_Handle.hash:
    case Prefab.Gacha_Handle_.hash:
    case Prefab.Handle_Bow.hash:
    case Prefab.Handle_Fist.hash:
    case Prefab.Handle_Large_Branch.hash:
    case Prefab.Handle_Large_Cool.hash:
    case Prefab.Handle_Large_Standard.hash:
    case Prefab.Handle_Long_Straight.hash:
    case Prefab.Handle_Medium_Branch.hash:
    case Prefab.Handle_Medium_Cool.hash:
    case Prefab.Handle_Medium_Curved.hash:
    case Prefab.Handle_Medium_Ridged.hash:
    case Prefab.Handle_Medium_Standard.hash:
    case Prefab.Handle_Medium_Straight.hash:
    case Prefab.Handle_Round_Fist.hash:
    case Prefab.Handle_Short.hash:
    case Prefab.Handle_Short_C_Curve.hash:
    case Prefab.Handle_Short_Cool.hash:
    case Prefab.Handle_Short_Pointy_End.hash:
    case Prefab.Handle_Short_S_Curve.hash:
    case Prefab.Handle_Short_Taper.hash:
    case Prefab.Handle_Spear.hash:
    case Prefab.Handle_Tonfa.hash:
    case Prefab.Hebios_Handle_Katana.hash:
    case Prefab.Hebios_Handle_Kunai.hash:
    case Prefab.Hebios_Handle_Naginata.hash:
    case Prefab.Hebios_Handle_Wakizashi.hash:
    case Prefab.Rod_Slim_40cm.hash:
    case Prefab.Rod_Medium.hash:
    case Prefab.Shield_Core_Handle.hash:
      return parseHiltedApparatus(decoded.prefab);

    /**
     * PRODUCE
     */
    case Prefab.Apple_Core_Burnt.hash:
      return 'burnt apple core';

    case Prefab.Apple_Core_Cooked.hash:
      return 'cooked apple core';

    case Prefab.Apple_Core_Ripe.hash:
      return 'ripe apple core';

    case Prefab.Apple_Core_Unripe.hash:
      return 'unripe apple core';

    case Prefab.Apple_Full_Burnt.hash:
      return 'burnt apple';

    case Prefab.Apple_Full_Cooked.hash:
      return 'cooked apple';

    case Prefab.Apple_Full_Ripe.hash:
      return 'ripe apple';

    case Prefab.Apple_Full_Unripe.hash:
      return 'unripe apple';

    case Prefab.Blueberry_Full_Burnt.hash:
      return 'burnt blueberry';

    case Prefab.Blueberry_Full_Cooked.hash:
      return 'cooked blueberry';

    case Prefab.Blueberry_Full_Ripe.hash:
      return 'ripe blueberry';

    case Prefab.Blueberry_Full_Unripe.hash:
      return 'unripe blueberry';

    case Prefab.Carrot_Full_Burnt.hash:
      return 'burnt carrot';

    case Prefab.Carrot_Full_Cooked.hash:
      return 'cooked carrot';

    case Prefab.Carrot_Full_Ripe.hash:
      return 'ripe carrot';

    case Prefab.Carrot_Full_Unripe.hash:
      return 'unripe carrot';

    case Prefab.Carrot_Leaves.hash:
      return 'carrot leaves';

    case Prefab.Eggplant_Full_Burnt.hash:
      return 'burnt eggplant';

    case Prefab.Eggplant_Full_Cooked.hash:
      return 'cooked eggplant';

    case Prefab.Eggplant_Full_Ripe.hash:
      return 'ripe eggplant';

    case Prefab.Eggplant_Full_Unripe.hash:
      return 'unripe eggplant';

    case Prefab.Garlic_Full_Burnt.hash:
      return 'burnt garlic';

    case Prefab.Garlic_Full_Cooked.hash:
      return 'cooked garlic';

    case Prefab.Garlic_Full_Ripe.hash:
      return 'ripe garlic';

    case Prefab.Garlic_Full_Unripe.hash:
      return 'unripe garlic';

    case Prefab.Garlic_Leaves.hash:
      return 'garlic leaves';

    case Prefab.Garlic_Roots.hash:
      return 'garlic roots';

    case Prefab.Onion_Full_Burnt.hash:
      return 'burnt onion';

    case Prefab.Onion_Full_Cooked.hash:
      return 'cooked onion';

    case Prefab.Onion_Full_Ripe.hash:
      return 'ripe onion';

    case Prefab.Onion_Full_Unripe.hash:
      return 'unripe onion';

    case Prefab.Onion_Leaves.hash:
      return 'onion leaves';

    case Prefab.Onion_Roots.hash:
      return 'onion roots';

    case Prefab.Potato_Full_Burnt.hash:
      return 'burnt potato';

    case Prefab.Potato_Full_Cooked.hash:
      return 'cooked potato';

    case Prefab.Potato_Full_Ripe.hash:
      return 'ripe potato';

    case Prefab.Potato_Full_Unripe.hash:
      return 'unripe potato';

    case Prefab.Potato_Sapling.hash:
      return 'potato sapling';

    case Prefab.pumpkin_piece_burnt.hash:
      return 'burnt pumpkin piece';

    case Prefab.pumpkin_piece_cooked.hash:
      return 'cooked pumpkin piece';

    case Prefab.pumpkin_piece_ripe.hash:
      return 'ripe pumpkin piece';

    case Prefab.pumpkin_piece_unripe.hash:
      return 'unripe pumpkin piece';

    case Prefab.Tomato_Full_Burnt.hash:
      return 'burnt tomato';

    case Prefab.Tomato_Full_Cooked.hash:
      return 'cooked tomato';

    case Prefab.Tomato_Full_Ripe.hash:
      return 'ripe tomato';

    case Prefab.Tomato_Full_Unripe.hash:
      return 'unripe tomato';

    /**
     * FLASK
     */
    case Prefab.Potion_Medium.hash:
      return parseFlask(decoded.prefab);

    /**
     * LEATHER
     */
    case Prefab.Soft_Fabric_Medium_Strips.hash:
    case Prefab.Soft_Fabric_Medium_Roll.hash:
    case Prefab.Soft_Fabric_Large_Roll.hash:
      return parseLeather(decoded.prefab);

    /**
     * GOTERA
     */
    case Prefab.Gotera_Seedling_Orb.hash:
      return 'gotera seedling';

    case Prefab.Redwood_Gotera_Core.hash:
      return 'redwood gotera core';

    /**
     * SOULBOUND
     */
    case Prefab.DebugPlayerStone.hash:
      return 'soulbond';

    /**
     * BLOOD MAGIC
     */
    case Prefab.Heart_Receptacle.hash:
      return 'heartfruit';

    case Prefab.Puzzle_Orb_1.hash:
      return 'active blood conduit';

    case Prefab.Puzzle_Orb_2.hash:
      return 'inactive blood conduit';

    /**
     * UNRECOGNISED
     */
    default:
      return undefined;
  }
};
