// Functions to hash payment and username data for EVVM and NameService.
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";
import { DispersePayMetadata } from "../types";

// ABI parameters for encoding disperse payment data
const abiDispersePayParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

/**
 * Hash disperse payment data for multiple recipients
 * @param toData Array of payment metadata for recipients
 * @returns Hashed payment data
 */
export function hashDispersePaymentUsersToPay(toData: DispersePayMetadata[]): `0x${string}` {
  const formattedData = toData.map((item) => [
    BigInt(item.amount),
    item.to_address,
    item.to_identity,
  ]);
  return sha256(encodeAbiParameters(abiDispersePayParameters, [formattedData]));
}

/**
 * Hash pre-registered username with clown number
 * @param username Username to hash
 * @param clowNumber Unique clown number
 * @returns Hashed username data
 */
export function hashPreRegisteredUsername(username: string, clowNumber: bigint): `0x${string}` {
  return keccak256(encodePacked(["string", "uint256"], [username, clowNumber]));
}

/**
 * Hash pre-registered email with clown number
 * @param email Email to hash
 * @param clowNumber Unique clown number
 * @returns Hashed email data
 */
export function hashPreRegisteredEmail(email: string, clowNumber: bigint): `0x${string}` {
  return keccak256(encodePacked(["string", "uint256"], [email, clowNumber]));
}

/**
 * Hash pre-registered phone number with clown number
 * @param phoneNumber Phone number to hash
 * @param clowNumber Unique clown number
 * @returns Hashed phone number data
 */
export function hashPreRegisteredPhoneNumber(phoneNumber: string, clowNumber: bigint): `0x${string}` {
  return keccak256(encodePacked(["string", "uint256"], [phoneNumber, clowNumber]));
}