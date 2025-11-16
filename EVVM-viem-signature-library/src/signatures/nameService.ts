/**
 * NameService Signature Builder
 *
 * Utility class for building and signing NameService messages (offers, registration, metadata, etc).
 * Provides functions for each NameService action, using viem for EIP-191 signatures.
 * Includes dual-signature logic for priority fee payments.
 */

import type { Account, WalletClient } from "viem";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPreRegistrationUsername,
  buildMessageSignedForRegistrationUsername,
  buildMessageSignedForMakeOffer,
  buildMessageSignedForWithdrawOffer,
  buildMessageSignedForAcceptOffer,
  buildMessageSignedForRenewUsername,
  buildMessageSignedForAddCustomMetadata,
  buildMessageSignedForRemoveCustomMetadata,
  buildMessageSignedForFlushCustomMetadata,
  buildMessageSignedForFlushUsername,
  buildMessageSignedForRegistrationEmail,
  buildMessageSignedForRegistrationPhoneNumber,
  hashPreRegisteredUsername,
  hashPreRegisteredEmail,
  hashPreRegisteredPhoneNumber,
} from "../utils";

export interface DualSignatureResult {
  paySignature?: `0x${string}`;
  actionSignature: `0x${string}`;
}

export class NameServiceSignatureBuilder {
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
   * Signs a NameService username pre-registration message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   */
  async signPreRegistrationUsername(
    evvmId: bigint,
    addressNameService: `0x${string}`,
    username: string,
    clowNumber: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const hashPreReg = hashPreRegisteredUsername(username, clowNumber);
    const preRegistrationMessage = buildMessageSignedForPreRegistrationUsername(
      evvmId,
      hashPreReg,
      nonce
    );

    const actionSignature = await this.signERC191Message(
      preRegistrationMessage
    );

    let paySignature: `0x${string}` | undefined;
    if (priorityFee_EVVM > 0n) {
      const payMessage = buildMessageSignedForPay(
        evvmId,
        addressNameService,
        "0x0000000000000000000000000000000000000001", // Native token
        0n,
        priorityFee_EVVM,
        nonce_EVVM,
        priorityFlag_EVVM,
        addressNameService
      );
      paySignature = await this.signERC191Message(payMessage);
    }

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService username registration message.
   */
  async signRegistrationUsername(
    evvmId: bigint,
    addressNameService: `0x${string}`,
    username: string,
    clowNumber: bigint,
    nonce: bigint,
    mateReward: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const registrationMessage = buildMessageSignedForRegistrationUsername(
      evvmId,
      username,
      clowNumber,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmId,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      mateReward * BigInt(100),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(registrationMessage);

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService username registration message.
   */
  async signRegistrationEmail(
    evvmId: bigint,
    addressNameService: `0x${string}`,
    email: string,
    clowNumber: bigint,
    nonce: bigint,
    mateReward: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const registrationMessage = buildMessageSignedForRegistrationEmail(
      evvmId,
      email,
      clowNumber,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmId,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      mateReward * BigInt(100),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(registrationMessage);

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService phone number registration message.
   */
  async signRegistrationPhoneNumber(
    evvmId: bigint,
    addressNameService: `0x${string}`,
    phoneNumber: string,
    clowNumber: bigint,
    nonce: bigint,
    mateReward: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const registrationMessage = buildMessageSignedForRegistrationPhoneNumber(
      evvmId,
      phoneNumber,
      clowNumber,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmId,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      mateReward * BigInt(100),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(registrationMessage);

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService make offer message.
   */
  async signMakeOffer(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    expirationDate: bigint,
    amount: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const makeOfferMessage = buildMessageSignedForMakeOffer(
      evvmID,
      username,
      expirationDate,
      amount,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      amount,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(makeOfferMessage);
    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService withdraw offer message.
   */
  async signWithdrawOffer(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    offerId: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const withdrawOfferMessage = buildMessageSignedForWithdrawOffer(
      evvmID,
      username,
      offerId,
      nonce
    );

    const actionSignature = await this.signERC191Message(withdrawOfferMessage);

    let paySignature: `0x${string}` | undefined;
    if (priorityFee_EVVM > 0n) {
      const payMessage = buildMessageSignedForPay(
        evvmID,
        addressNameService,
        "0x0000000000000000000000000000000000000001",
        0n,
        priorityFee_EVVM,
        nonce_EVVM,
        priorityFlag_EVVM,
        addressNameService
      );
      paySignature = await this.signERC191Message(payMessage);
    }

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService accept offer message.
   */
  async signAcceptOffer(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    offerId: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const acceptOfferMessage = buildMessageSignedForAcceptOffer(
      evvmID,
      username,
      offerId,
      nonce
    );

    const actionSignature = await this.signERC191Message(acceptOfferMessage);

    let paySignature: `0x${string}` | undefined;
    if (priorityFee_EVVM > 0n) {
      const payMessage = buildMessageSignedForPay(
        evvmID,
        addressNameService,
        "0x0000000000000000000000000000000000000001",
        0n,
        priorityFee_EVVM,
        nonce_EVVM,
        priorityFlag_EVVM,
        addressNameService
      );
      paySignature = await this.signERC191Message(payMessage);
    }

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService renew username message.
   */
  async signRenewUsername(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    nonce: bigint,
    amountToRenew: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const renewUsernameMessage = buildMessageSignedForRenewUsername(
      evvmID,
      username,
      nonce
    );
    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      amountToRenew,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(renewUsernameMessage);
    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService add custom metadata message.
   */
  async signAddCustomMetadata(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    nonce: bigint,
    identity: string,
    value: string,
    amountToAddCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const addCustomMetadataMessage = buildMessageSignedForAddCustomMetadata(
      evvmID,
      identity,
      value,
      nonce
    );
    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      amountToAddCustomMetadata,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(
      addCustomMetadataMessage
    );

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService remove custom metadata message.
   */
  async signRemoveCustomMetadata(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    identity: string,
    key: bigint,
    nonce: bigint,
    amountToRemoveCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const removeCustomMetadataMessage =
      buildMessageSignedForRemoveCustomMetadata(evvmID, identity, key, nonce);

    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      amountToRemoveCustomMetadata,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(
      removeCustomMetadataMessage
    );

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService flush custom metadata message.
   */
  async signFlushCustomMetadata(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    identity: string,
    nonce: bigint,
    priceToFlushCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const flushCustomMetadataMessage = buildMessageSignedForFlushCustomMetadata(
      evvmID,
      identity,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      priceToFlushCustomMetadata,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(
      flushCustomMetadataMessage
    );

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }

  /**
   * Signs a NameService flush username message.
   */
  async signFlushUsername(
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    nonce: bigint,
    priceToFlushUsername: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean
  ): Promise<DualSignatureResult> {
    const flushUsernameMessage = buildMessageSignedForFlushUsername(
      evvmID,
      username,
      nonce
    );

    const payMessage = buildMessageSignedForPay(
      evvmID,
      addressNameService,
      "0x0000000000000000000000000000000000000001",
      priceToFlushUsername,
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      addressNameService
    );

    const actionSignature = await this.signERC191Message(flushUsernameMessage);

    const paySignature = await this.signERC191Message(payMessage);

    return {
      paySignature,
      actionSignature,
    };
  }
}
