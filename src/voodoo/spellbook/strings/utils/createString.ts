import { SpawnOptions } from '..';
import { createRigidBody } from './createRigidBody';
import { bitsToUInts } from './bitsToUInts';
import { floatToUInt } from './floatToUInt';

/**
 * Byte size is the sum of:
 *
 * Prefab hash (8 bits)
 * Prefab X position (32 bits)
 * Prefab Y position (32 bits)
 * Prefab Z position (32 bits)
 * Prefab rotation X (32 bits)
 * Prefab rotation Y (32 bits)
 * Prefab rotation Z (32 bits)
 * Prefab rotation amount W (32 bits)
 * Prefab scale (32 bits)
 * RigidBody hash (32 bits)
 * RigidBody size (32 bits)
 * RigidBody X position (32 bits)
 * RigidBody Y position (32 bits)
 * RigidBody Z position (32 bits)
 * RigidBody rotation X (32 bits)
 * RigidBody rotation Y (32 bits)
 * RigidBody rotation Z (32 bits)
 * RigidBody rotation amount W (32 bits)
 * RigidBody isKinematic toggle (1 bit)          <-- bit offset occurs from here!
 * RigidBody isServerSleeping toggle (1 bit)
 * RigidBody X velocity (32 bits)
 * RigidBody Y velocity (32 bits)
 * RigidBody Z velocity (32 bits)
 * RigidBody angular X velocity (32 bits)
 * RigidBody angular Y velocity (32 bits)
 * RigidBody angular Z velocity (32 bits)
 *
 * Total bytes: 94 = 746 bits / 8 bits-per-byte  <-- rounded up
 */
const BYTE_SIZE = 94;

const RIGID_BODY_HASH = 2290978823;
const RIGID_BODY_SIZE = 418;

export const createString = (prefabHash: number) => ({
  transform,
  isKinematic = false,
  isServerSleeping = false
}: SpawnOptions) => {
  const rigidBodyBits = createRigidBody({ transform, isKinematic, isServerSleeping });

  /* Pad 418 bits with trailing zeroes to make it % 32. */
  // const paddedRigidBodyBits = rigidBodyBits.padEnd(
  //   rigidBodyBits.length + (32 - (rigidBodyBits.length % 32 === 0 ? 32 : rigidBodyBits.length % 32)),
  //   '0'
  // );
  const paddedRigidBodyBits = rigidBodyBits.padEnd(448, '0');

  return `${[
    prefabHash,
    BYTE_SIZE,
    prefabHash,
    floatToUInt(transform.px ?? 0),
    floatToUInt(transform.py ?? 0),
    floatToUInt(transform.pz ?? 0),
    floatToUInt(transform.qx ?? 0),
    floatToUInt(transform.qy ?? 0),
    floatToUInt(transform.qz ?? 0),
    floatToUInt(transform.qw ?? 1),
    floatToUInt(transform.s ?? 1),
    RIGID_BODY_HASH,
    RIGID_BODY_SIZE,
    ...bitsToUInts(paddedRigidBodyBits)
  ].join(',')},`;
};
