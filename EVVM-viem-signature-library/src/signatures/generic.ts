/**
 * Generic Signature Builder
 *
 * Utility class for building and signing generic EVVM messages using the pattern:
 * "<evvmID>,<functionName>,<inputs>"
 * 
 * This class provides a flexible way to sign any EVVM message without needing
 * specific functions for each contract method.
 */

import type { Account, WalletClient } from 'viem';

export class GenericSignatureBuilder {
  private walletClient: WalletClient;
  private account: Account;

  constructor(walletClient: WalletClient, account: Account) {
    this.walletClient = walletClient;
    this.account = account;
  }

  /**
   * Signs a generic EIP-191 message.
   * @param message Message to sign
   * @returns Promise resolving to signature string
   */
  async signERC191Message(message: string): Promise<`0x${string}`> {
    return await this.walletClient.signMessage({
      account: this.account,
      message,
    });
  }

  /**
   * Builds a generic EVVM message using the pattern: "<evvmID>,<functionName>,<inputs>"
   * @param evvmID EVVM chain ID
   * @param functionName Name of the function to call
   * @param inputs Input string (comma-separated values)
   * @returns Formatted message string
   */
  buildGenericMessage(
    evvmID: bigint,
    functionName: string,
    inputs: string
  ): string {
    return `${evvmID.toString()},${functionName},${inputs}`;
  }

  /**
   * Signs a generic EVVM message using the standard pattern.
   * @param evvmID EVVM chain ID
   * @param functionName Name of the function to call
   * @param inputs Input string (comma-separated values)
   * @returns Promise resolving to signature string
   */
  async signGenericMessage(
    evvmID: bigint,
    functionName: string,
    inputs: string
  ): Promise<`0x${string}`> {
    const message = this.buildGenericMessage(evvmID, functionName, inputs);
    return await this.signERC191Message(message);
  }
}