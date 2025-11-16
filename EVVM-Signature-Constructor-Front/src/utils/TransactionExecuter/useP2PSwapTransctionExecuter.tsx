/**
 * useP2PSwapTransactionExecuter
 *
 * Functions to execute P2PSwap order management transactions via smart contract.
 * Each function calls the contract for a specific P2PSwap action using wagmi's writeContract.
 * Returns a Promise that resolves on success or rejects on error.
 * Input types match the contract ABI.
 */
import { writeContract } from '@wagmi/core'
import { config } from '@/config'
import {
  CancelOrderInputData,
  DispatchOrderFillFixedFeeInputData,
  DispatchOrderFillPropotionalFeeInputData,
  MakeOrderInputData,
  P2PSwapABI,
} from '@evvm/viem-signature-library'

const executeMakeOrder = async (
  InputData: MakeOrderInputData,
  p2pSwapAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject('No data to execute order')
  }

  return writeContract(config, {
    abi: P2PSwapABI,
    address: p2pSwapAddress,
    functionName: 'makeOrder',
    args: [
      InputData.user,
      InputData.metadata,
      InputData.signature,
      InputData.priorityFee,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

const executeCancelOrder = async (
  InputData: CancelOrderInputData,
  p2pSwapAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject('No data to cancel order')
  }

  // todo: try again with fixed gasFees 
  return writeContract(config, {
    abi: P2PSwapABI,
    address: p2pSwapAddress,
    functionName: 'cancelOrder',
	gas: 1_500_000n,
    args: [
      InputData.user,
      InputData.metadata,
      InputData.priorityFee,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

const executeDispatchOrderFillPropotionalFee = async (
  InputData: DispatchOrderFillPropotionalFeeInputData,
  p2pSwapAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject('No data to dispatch order')
  }

  return writeContract(config, {
    abi: P2PSwapABI,
    address: p2pSwapAddress,
    functionName: 'dispatchOrder_fillPropotionalFee',
	gas: 1_500_000n,
    args: [
      InputData.user,
      InputData.metadata,
      InputData.priorityFee,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

const executeDispatchOrderFillFixedFee = async (
  InputData: DispatchOrderFillFixedFeeInputData,
  p2pSwapAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject('No data to dispatch order')
  }

  return writeContract(config, {
    abi: P2PSwapABI,
    address: p2pSwapAddress,
    functionName: 'dispatchOrder_fillFixedFee',
	gas: 1_500_000n,
    args: [
      InputData.user,
      InputData.metadata,
      InputData.priorityFee,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
      InputData.amountOut,
    ],
  })
    .then(() => {
      return Promise.resolve()
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

export {
  executeMakeOrder,
  executeCancelOrder,
  executeDispatchOrderFillPropotionalFee,
  executeDispatchOrderFillFixedFee,
}
