// EVVM Smart Contract ABIs
import EstimatorABIFile from './Estimator.json';
import EvvmABIFile from './Evvm.json';
import NameServiceABIFile from './NameService.json';
import P2PSwapABIFile from './P2PSwap.json';
import StakingABIFile from './Staking.json';

// Extract ABIs from JSON files
const EstimatorABI = EstimatorABIFile.abi;
const EvvmABI = EvvmABIFile.abi;
const NameServiceABI = NameServiceABIFile.abi;
const P2PSwapABI = P2PSwapABIFile.abi;
const StakingABI = StakingABIFile.abi;

// Export the ABIs
export {
  EstimatorABI,
  EvvmABI,
  NameServiceABI,
  P2PSwapABI,
  StakingABI
};

// Default export with all ABIs
export default {
  Estimator: EstimatorABI,
  Evvm: EvvmABI,
  NameService: NameServiceABI,
  P2PSwap: P2PSwapABI,
  Staking: StakingABI
};

// Individual ABI exports for convenience
export const EVVM_ABIS = {
  ESTIMATOR: EstimatorABI,
  EVVM: EvvmABI,
  NAME_SERVICE: NameServiceABI,
  P2P_SWAP: P2PSwapABI,
  STAKING: StakingABI
} as const;
