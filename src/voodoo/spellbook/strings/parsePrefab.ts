import { DecodedString } from './decodeString';
import { PrefabHash } from './PrefabHash';
import { parseFlask, parseLeather } from './parsers';

export const parsePrefab = (decoded: DecodedString): string | undefined => {
  switch (decoded.hash) {
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
     * UNRECOGNISED
     */
    default:
      return undefined;
  }
};
