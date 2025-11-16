/**
 * NameService Transaction Executor
 * 
 * This module provides functions to execute NameService smart contract transactions using wagmi's writeContract.
 * Each function corresponds to a specific NameService action (registration, offer, metadata, etc).
 * All functions return a Promise that resolves on success or rejects on error.
 * 
 * Input types are imported from TypeInputStructures and match the contract ABI.
 */
/**
 * Executes pre-registration of a username in NameService contract.
 * @param InputData PreRegistrationUsernameInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes registration of a username in NameService contract.
 * @param InputData RegistrationUsernameInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes making an offer for a username in NameService contract.
 * @param InputData MakeOfferInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes withdrawal of an offer for a username in NameService contract.
 * @param InputData WithdrawOfferInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes acceptance of an offer for a username in NameService contract.
 * @param InputData AcceptOfferInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes renewal of a username in NameService contract.
 * @param InputData RenewUsernameInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes addition of custom metadata for a username in NameService contract.
 * @param InputData AddCustomMetadataInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes removal of custom metadata for a username in NameService contract.
 * @param InputData RemoveCustomMetadataInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes flush of all custom metadata for a username in NameService contract.
 * @param InputData FlushCustomMetadataInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
/**
 * Executes flush of a username in NameService contract.
 * @param InputData FlushUsernameInputData
 * @param nameServiceAddress Contract address
 * @returns Promise<void>
 */
import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import {NameServiceABI } from "@evvm/viem-signature-library";
import {
  PreRegistrationUsernameInputData,
  RegistrationUsernameInputData,
  MakeOfferInputData,
  WithdrawOfferInputData,
  AcceptOfferInputData,
  RenewUsernameInputData,
  AddCustomMetadataInputData,
  RemoveCustomMetadataInputData,
  FlushCustomMetadataInputData,
  FlushUsernameInputData,
} from "@evvm/viem-signature-library";

// TODO: These types should be added to @evvm/viem-signature-library
export type EmailRegistrationInputData = {
  user: `0x${string}`;
  nonce: bigint;
  email: string;
  timestampUser: bigint;
  signatureUser: `0x${string}`;
  timestampAuthority: bigint;
  signatureAuthority: `0x${string}`;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: `0x${string}`;
};

export type PhoneRegistrationInputData = {
  user: `0x${string}`;
  nonce: bigint;
  phone: string;
  timestampUser: bigint;
  signatureUser: `0x${string}`;
  timestampAuthority: bigint;
  signatureAuthority: `0x${string}`;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: `0x${string}`;
};

const executePreRegistrationUsername = async (
  InputData: PreRegistrationUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "preRegistrationUsername",
    args: [
      InputData.user,
      InputData.hashPreRegisteredUsername,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeRegistrationUsername = async (
  InputData: RegistrationUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "registrationUsername",
    args: [
      InputData.user,
      InputData.username,
      InputData.clowNumber,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeEmailRegistration = async (
  InputData: EmailRegistrationInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "registrationEmail",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.email,
      InputData.timestampUser,
      InputData.signatureUser,
      InputData.timestampAuthority,
      InputData.signatureAuthority,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executePhoneRegistration = async (
  InputData: PhoneRegistrationInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "registrationPhoneNumber",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.phone,
      InputData.timestampUser,
      InputData.signatureUser,
      InputData.timestampAuthority,
      InputData.signatureAuthority,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeMakeOffer = async (
  InputData: MakeOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "makeOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.expireDate,
      InputData.amount,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeWithdrawOffer = async (
  InputData: WithdrawOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "withdrawOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.offerID,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeAcceptOffer = async (
  InputData: AcceptOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "acceptOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.offerID,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeRenewUsername = async (
  InputData: RenewUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "renewUsername",
    args: [
      InputData.user,
      InputData.username,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeAddCustomMetadata = async (
  InputData: AddCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  console.log("Executing addCustomMetadata with InputData:", InputData);

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "addCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
      InputData.value,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeRemoveCustomMetadata = async (
  InputData: RemoveCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "removeCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
      InputData.key,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeFlushCustomMetadata = async (
  InputData: FlushCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "flushCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeFlushUsername = async (
  InputData: FlushUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameServiceABI,
    address: nameServiceAddress,
    functionName: "flushUsername",
    args: [
      InputData.user,
      InputData.username,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

/**
 * Exports all NameService transaction executor functions.
 */
export {
  executePreRegistrationUsername, // Pre-register username
  executeRegistrationUsername,    // Register username
  executeEmailRegistration,       // Register email
  executePhoneRegistration,       // Register phone
  executeMakeOffer,               // Make offer for username
  executeWithdrawOffer,           // Withdraw offer for username
  executeAcceptOffer,             // Accept offer for username
  executeRenewUsername,           // Renew username
  executeAddCustomMetadata,       // Add custom metadata
  executeRemoveCustomMetadata,    // Remove custom metadata
  executeFlushCustomMetadata,     // Flush all custom metadata
  executeFlushUsername,           // Flush username
};
