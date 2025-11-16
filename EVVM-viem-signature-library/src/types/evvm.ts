/**
 * EVVM Type Input Structures
 *
 * Type definitions for EVVM payment and disperse payment input data.
 * Used for type safety and contract interaction.
 */
export type PayInputData = {
  from: `0x${string}`;
  to_address: `0x${string}`;
  to_identity: string;
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  nonce: bigint;
  priority: boolean;
  executor: string;
  signature: string;
};

export type DispersePayMetadata = {
  amount: bigint;
  to_address: `0x${string}`;
  to_identity: string;
};

export type DispersePayInputData = {
  from: `0x${string}`;
  toData: DispersePayMetadata[];
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  priority: boolean;
  nonce: bigint;
  executor: string;
  signature: string;
};