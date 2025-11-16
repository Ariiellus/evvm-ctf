/**
 * P2P Swap Input structures
 *
 * Type definitions for P2PSwap order management.
 * Used for type safety and contract interaction.
 */
export type MakeOrderInputData = {
  user: `0x${string}`;
  metadata: MetadataMakeOrder;
  signature: string;
  priorityFee: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type MetadataMakeOrder = {
  nonce: bigint;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  amountA: bigint;
  amountB: bigint;
};

export type CancelOrderInputData = {
  user: `0x${string}`;
  metadata: MetadataCancelOrder;
  priorityFee: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type MetadataCancelOrder = {
  nonce: bigint;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  orderId: bigint;
  signature: string;
};

export type DispatchOrderFillPropotionalFeeInputData = {
  user: `0x${string}`;
  metadata: MetadataDispatchOrder;
  priorityFee: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type DispatchOrderFillFixedFeeInputData = {
  user: `0x${string}`;
  metadata: MetadataDispatchOrder;
  priorityFee: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
  amountOut: bigint;
};

type MetadataDispatchOrder = {
  nonce: bigint;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  orderId: bigint;
  amountOfTokenBToFill: bigint;
  signature: string;
};
