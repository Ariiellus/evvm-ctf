/**
 * Staking Type Input Structures
 *
 * Type definitions for Staking input data (golden, presale, public, service).
 * Used for type safety and contract interaction.
 */
export type GoldenStakingInputData = {
  isStaking: boolean;
  amountOfStaking: bigint;
  signature_EVVM: string;
};

export type PresaleStakingInputData = {
  user: `0x${string}`;
  isStaking: boolean;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type PublicStakingInputData = {
  user: `0x${string}`;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type PublicServiceStakingInputData = {
  user: `0x${string}`;
  service: `0x${string}`;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};