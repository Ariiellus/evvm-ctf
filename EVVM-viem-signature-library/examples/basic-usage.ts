/**
 * Basic usage example for EVVM TypeScript Library
 * 
 * This example shows how to use the library for signing and executing EVVM payments.
 * Note: This is for demonstration purposes only.
 */

import { 
  EVVMSignatureBuilder, 
  PayInputData 
} from '../src/index';

// Example configuration
const EVVM_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890' as const;
const EVVM_ID = 1n;

async function basicExample() {
  console.log('🚀 EVVM TypeScript Library - Basic Example');
  
  // Note: In a real application, you would use actual wallet clients
  // This is just to demonstrate the types and structure
  
  const mockAccount = {
    address: '0x742d35Cc6634C0532925a3b8D138068fd4C1B7a1' as `0x${string}`
  };

  const mockWalletClient = {
    signMessage: async ({ message }: { message: string }) => {
      console.log('📝 Signing message:', message);
      return '0x1234567890abcdef...' as `0x${string}`;
    }
  };

  const mockConfig = {};

  try {
    // 1. Create signature builder
    const signatureBuilder = new EVVMSignatureBuilder(mockWalletClient as any, mockAccount as any);
    
    // 2. Sign a payment
    console.log('✍️ Signing EVVM payment...');
    const signature = await signatureBuilder.signPay(
      EVVM_ID,
      '0x742d35Cc92d8A4bbCD07E9d4aC8b2E4c7BE7C7E3',
      '0x0000000000000000000000000000000000000000' as `0x${string}`, // Native token
      1000000000000000000n, // 1 ETH
      50000000000000000n,   // 0.05 ETH priority fee
      1n,                   // nonce
      false,                // priority flag
      mockAccount.address   // executor
    );
    
    console.log('✅ Payment signature generated:', signature);

    // 3. Create payment input data
    const payInputData: PayInputData = {
      from: mockAccount.address,
      to_address: '0x742d35Cc92d8A4bbCD07E9d4aC8b2E4c7BE7C7E3',
      to_identity: '',
      token: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      amount: 1000000000000000000n,
      priorityFee: 50000000000000000n,
      nonce: 1n,
      priority: false,
      executor: mockAccount.address,
      signature,
    };

    // 4. Execute transaction (mock)
    console.log('🔄 Payment data prepared for execution');
    console.log('📊 Payment details:');
    console.log('  - From:', payInputData.from);
    console.log('  - To:', payInputData.to_address);
    console.log('  - Amount:', payInputData.amount.toString(), 'wei');
    console.log('  - Priority Fee:', payInputData.priorityFee.toString(), 'wei');
    
    console.log('✨ Example completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in basic example:', error);
  }
}

// Export for potential use
export { basicExample };

// Run if this file is executed directly
if (require.main === module) {
  basicExample();
}