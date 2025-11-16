// Type definitions for EVVM ABIs

export interface ABIFunction {
  type: 'function' | 'constructor' | 'event' | 'error';
  name?: string;
  inputs: ABIParameter[];
  outputs?: ABIParameter[];
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
}

export interface ABIParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: ABIParameter[];
}

export interface ContractABI {
  abi: ABIFunction[];
}

// Specific ABI types for each contract
export type EstimatorABIType = ContractABI;
export type EvvmABIType = ContractABI;
export type NameServiceABIType = ContractABI;
export type StakingABIType = ContractABI;