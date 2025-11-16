/**
 * NameService Type Input Structures
 *
 * Type definitions for NameService input data (registration, offers, metadata, etc).
 * Used for type safety and contract interaction.
 */
export type PreRegistrationUsernameInputData = {
  user: `0x${string}`;
  hashPreRegisteredUsername: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type RegistrationUsernameInputData = {
  user: `0x${string}`;
  username: string;
  clowNumber: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type MakeOfferInputData = {
  user: `0x${string}`;
  username: string;
  expireDate: bigint;
  amount: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type WithdrawOfferInputData = {
  user: `0x${string}`;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type AcceptOfferInputData = {
  user: `0x${string}`;
  username: string;
  offerID: bigint;
  nonce: string;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type RenewUsernameInputData = {
  user: `0x${string}`;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type AddCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  value: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type RemoveCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  key: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type FlushCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type FlushUsernameInputData = {
  user: `0x${string}`;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};