/**
 * EVVM Signature Builder
 *
 * Utility class for building and signing EVVM payment and disperse payment messages.
 * Provides functions for each EVVM action, using viem for EIP-191 signatures.
 * Includes logic for single and multiple recipient payments.
 */

import type { Account, WalletClient } from 'viem';
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
  hashDispersePaymentUsersToPay,
} from '../utils';
import { DispersePayMetadata } from '../types';

export class EVVMSignatureBuilder {
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
   * Signs an EVVM payment message.
   * @param evvmID EVVM chain ID
   * @param to Recipient address or username
   * @param tokenAddress Token contract address
   * @param amount Amount to pay
   * @param priorityFee Priority fee for transaction
   * @param nonce Nonce for transaction
   * @param priorityFlag Priority flag (async/sync)
   * @param executor Executor address
   * @returns Promise resolving to signature string
   */
  async signPay(
    evvmID: bigint,
    to: string,
    tokenAddress: `0x${string}`,
    amount: bigint,
    priorityFee: bigint,
    nonce: bigint,
    priorityFlag: boolean,
    executor: `0x${string}`
  ): Promise<`0x${string}`> {
    const message = buildMessageSignedForPay(
      evvmID,
      to,
      tokenAddress,
      amount,
      priorityFee,
      nonce,
      priorityFlag,
      executor
    );

    return await this.signERC191Message(message);
  }

  /**
   * Signs an EVVM disperse payment message for multiple recipients.
   * @param evvmID EVVM chain ID
   * @param toData Array of DispersePayMetadata
   * @param tokenAddress Token contract address
   * @param amount Total amount to pay
   * @param priorityFee Priority fee for transaction
   * @param nonce Nonce for transaction
   * @param priorityFlag Priority flag (async/sync)
   * @param executor Executor address
   * @returns Promise resolving to signature string
   */
  async signDispersePay(
    evvmID: bigint,
    toData: DispersePayMetadata[],
    tokenAddress: `0x${string}`,
    amount: bigint,
    priorityFee: bigint,
    nonce: bigint,
    priorityFlag: boolean,
    executor: `0x${string}`
  ): Promise<`0x${string}`> {
    const hashedEncodedData = hashDispersePaymentUsersToPay(toData);
    const message = buildMessageSignedForDispersePay(
      evvmID,
      "0x" + hashedEncodedData.toUpperCase().slice(2),
      tokenAddress,
      amount,
      priorityFee,
      nonce,
      priorityFlag,
      executor
    );

    return await this.signERC191Message(message);
  }
}
