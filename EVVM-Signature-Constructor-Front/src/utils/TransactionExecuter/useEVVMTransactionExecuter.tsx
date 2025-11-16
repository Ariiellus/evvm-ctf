/**
 * useEVVMTransactionExecuter
 *
 * Functions to execute EVVM payment and disperse payment transactions via smart contract.
 * Each function calls the contract for a specific EVVM action using wagmi's writeContract.
 * Returns a Promise that resolves on success or rejects on error.
 * Input types match the contract ABI.
 */
import { writeContract } from "@wagmi/core";
import {
  DispersePayInputData,
  PayInputData,
} from "@evvm/viem-signature-library";
import { config } from "@/config";
import { EvvmABI } from "@evvm/viem-signature-library";

const executePay = async (
  InputData: PayInputData,
  evvmAddress: `0x${string}`,
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  return writeContract(config, {
    abi: EvvmABI,
    address: evvmAddress,
    functionName: "pay",
    args: [
      InputData.from,
      InputData.to_address,
      InputData.to_identity,
      InputData.token,
      InputData.amount,
      InputData.priorityFee,
      InputData.nonce,
      InputData.priority,
      InputData.executor,
      InputData.signature,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executeDispersePay = async (
  InputData: DispersePayInputData,
  evvmAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: EvvmABI,
    address: evvmAddress,
    functionName: "dispersePay",
    args: [
      InputData.from,
      InputData.toData,
      InputData.token,
      InputData.amount,
      InputData.priorityFee,
      InputData.nonce,
      InputData.priority,
      InputData.executor,
      InputData.signature,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executePayMultiple = async (
  InputData: PayInputData[],
  evvmAddress: `0x${string}`
) => {
  if (!InputData || InputData.length === 0) {
    return Promise.reject("No data to execute multiple payments");
  }
  writeContract(config, {
    abi: EvvmABI,
    address: evvmAddress,
    functionName: "payMultiple",
    args: InputData.map((data) => [
      data.from,
      data.to_address,
      data.to_identity,
      data.token,
      data.amount,
      data.priorityFee,
      data.nonce,
      data.executor,
      data.signature,
    ]),
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export { executePay, executeDispersePay, executePayMultiple };
