/**
 * P2PSwap Signature Builder
 *
 * Utility class for building and signing P2PSwap order transactions.
 * Provides functions for each P2PSwap action, using viem for EIP-191 signatures.
 */

import type { Account, WalletClient } from "viem";
import {
  buildMessageSignedForCancelOrder,
  buildMessageSignedForDispatchOrder,
  buildMessageSignedForMakeOrder,
} from "../utils";

export class P2PSwapSignatureBuilder {
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
   * Signs a token swap order creation message
   * @param evvmID EVVM chain ID
   * @param nonce Nonce for transaction
   * @param tokenA Token being offered by the order creator
   * @param tokenB Token being requested in exchange
   * @param amountA Amount of tokenA being offered
   * @param amountB Amount of tokenB being requested
   * @returns Promise resolving to signature string
   */
  async makeOrder(
    evvmID: bigint,
    nonce: bigint,
    tokenA: `0x${string}`,
    tokenB: `0x${string}`,
    amountA: `0x${string}`,
    amountB: `0x${string}`,
  ): Promise<`0x${string}`> {
    const message = buildMessageSignedForMakeOrder(
      evvmID,
      nonce,
      tokenA,
      tokenB,
      amountA,
      amountB,
    );

    return await this.signERC191Message(message);
  }

  /**
   * Signs a token swap order cancellation message
   * @param evvmID EVVM chain ID
   * @param nonce Nonce for transaction
   * @param tokenA Token that was offered in the original order
   * @param tokenB Token that was requested in the original order
   * @param orderId The ID of the order to be cancelled
   * @returns Promise resolving to signature string
   */
  async cancelOrder(
    evvmID: bigint,
    nonce: bigint,
    tokenA: `0x${string}`,
    tokenB: `0x${string}`,
    orderId: bigint,
  ): Promise<`0x${string}`> {
    const message = buildMessageSignedForCancelOrder(
      evvmID,
      nonce,
      tokenA,
      tokenB,
      orderId,
    );

    return await this.signERC191Message(message);
  }

  /**
   * Signs an authorization message for dispatching an order
   * @param evvmID EVVM chain ID
   * @param nonce Nonce for transaction
   * @param tokenA Token that was offered in the original order
   * @param tokenB Token that was requested in the original order
   * @param orderId The ID of the order to be dispatched
   * @returns Promise resolving to signature string
   */
  async dispatchOrder(
    evvmID: bigint,
    nonce: bigint,
    tokenA: `0x${string}`,
    tokenB: `0x${string}`,
    orderId: bigint,
  ): Promise<`0x${string}`> {
    const message = buildMessageSignedForDispatchOrder(
      evvmID,
      nonce,
      tokenA,
      tokenB,
      orderId,
    );

    return await this.signERC191Message(message);
  }
}
