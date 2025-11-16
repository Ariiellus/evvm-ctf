/**
 * Staking Signature Builder
 *
 * Utility class for building and signing Staking messages (golden, presale, public, service).
 * Provides functions for each staking action, using viem for EIP-191 signatures.
 * Includes logic for single and dual signature staking flows.
 */

import type { Account, WalletClient } from "viem";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPublicStaking,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStake,
} from "../utils";

export interface StakingDualSignatureResult {
  paySignature?: string;
  actionSignature: string;
}

export class StakingSignatureBuilder {
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
   * Signs a golden staking message (single signature, 5083 EVVM per stake).
   * @param evvmID EVVM chain ID
   * @param stakingAddress Staking contract address
   * @param totalPrice Total price for staking
   * @param nonceEVVM Nonce for staking
   * @param priorityFlag Priority flag (async/sync)
   * @returns Promise resolving to signature string
   */
  async signGoldenStaking(
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    totalPrice: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean
  ): Promise<`0x${string}`> {
    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001" as `0x${string}`, // Native token
      totalPrice,
      0n,
      nonceEVVM,
      priorityFlag,
      stakingAddress
    );

    return await this.signERC191Message(payMessage);
  }

  /**
   * Signs a presale staking message (dual signature: payment + staking).
   */
  async signPresaleStaking(
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    isStaking: boolean,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    totalPrice: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<StakingDualSignatureResult> {
    const stakingMessage = buildMessageSignedForPresaleStaking(
      evvmID,
      isStaking,
      totalPrice,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking ? totalPrice : BigInt(0),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      stakingAddress
    );

    const actionSignature = await this.signERC191Message(stakingMessage);
    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a public staking message (dual signature: payment + staking).
   */
  async signPublicStaking(
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    isStaking: boolean,
    stakingAmount: bigint,
    nonceStaking: bigint,
    totalPrice: bigint,
    priorityFee: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean
  ): Promise<StakingDualSignatureResult> {
    const stakingMessage = buildMessageSignedForPublicStaking(
      evvmID,
      isStaking,
      stakingAmount,
      nonceStaking
    );

    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking ? totalPrice : BigInt(0),
      priorityFee,
      nonceEVVM,
      priorityFlag,
      stakingAddress
    );

    const actionSignature = await this.signERC191Message(stakingMessage);

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }


}
