/**
 * Core types for EVVM library
 * Re-exports from viem and wagmi for type safety
 */

// Re-export types from viem and wagmi
export type { Account, WalletClient } from 'viem';
export type { Config } from 'wagmi';

// Additional utility types
export interface SignatureResult {
  signature: `0x${string}`;
}

export interface DualSignatureResult {
  paySignature?: `0x${string}`;
  actionSignature: `0x${string}`;
}