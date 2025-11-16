


# @evvm/viem-signature-library

A TypeScript library for EVVM blockchain interactions, signature building, and transaction execution. Includes payments, staking, NameService, and utilities for EVVM contracts.

## Features

- **EIP-191 Signatures** for payments, staking, and NameService
- **Single and multiple (disperse) payments**
- **Staking**: golden, presale, public, service
- **NameService**: registration, offers, metadata
- **Integration with wagmi/viem**
- **Modular and fully typed**

## Installation

```bash
npm install @evvm/viem-signature-library viem wagmi
```

### Peer Dependencies

```bash
npm install viem@^2.0.0 wagmi@^2.0.0
```

## Requirements

- Node.js >= 18
- npm >= 8

## Project Structure

```
src/
├── abi/            # EVVM contract ABIs
├── signatures/     # Signature builder classes (EVVM, NameService, Staking)
├── types/          # TypeScript types for payments, staking, NameService
├── utils/          # Utilities: hash, message construction
├── __tests__/      # Unit tests
├── index.ts        # Main export
examples/
└── basic-usage.ts  # Basic usage example
```

## Basic Example

```typescript
import { EVVMSignatureBuilder, PayInputData } from '@evvm/viem-signature-library';

const mockAccount = {
  address: '0x742d35Cc6634C0532925a3b8D138068fd4C1B7a1' as `0x${string}`
};
const mockWalletClient = {
  signMessage: async ({ message }: { message: string }) => {
    return '0x1234567890abcdef...' as `0x${string}`;
  }
};

const signatureBuilder = new EVVMSignatureBuilder(mockWalletClient as any, mockAccount as any);
const signature = await signatureBuilder.signPay(
  1n,
  '0x742d35Cc92d8A4bbCD07E9d4aC8b2E4c7BE7C7E3',
  '0x0000000000000000000000000000000000000000',
  1000000000000000000n,
  50000000000000000n,
  1n,
  false,
  mockAccount.address
);

const payInputData: PayInputData = {
  from: mockAccount.address,
  to_address: '0x742d35Cc92d8A4bbCD07E9d4aC8b2E4c7BE7C7E3',
  to_identity: '',
  token: '0x0000000000000000000000000000000000000000',
  amount: 1000000000000000000n,
  priorityFee: 50000000000000000n,
  nonce: 1n,
  priority: false,
  executor: mockAccount.address,
  signature,
};
```

## Automation & Publishing to npm

This repository includes a GitHub Actions workflow to automatically publish to npm on every push to `main`. The version is bumped automatically using the short commit hash:

```yaml
name: Publish to npm

permissions:
  contents: write

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org/'
      - name: Install dependencies
        run: npm ci
      - name: Build package
        run: npm run build
      - name: Get short commit hash
        id: vars
        run: echo "commit_hash=$(git rev-parse --short HEAD)" >> $GITHUB_ENV
      - name: Bump version (prerelease with commit hash)
        run: npm version prerelease --preid ${{ env.commit_hash }} --no-git-tag-version
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - name: Create GitHub Release (optional)
        if: success()
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ github.run_number }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Setting up NPM_TOKEN

1. Go to https://www.npmjs.com/ and log in.
2. In your profile, go to "Access Tokens" and generate a new "Automation" token.
3. Copy the token and add it as a secret in your GitHub repo (`NPM_TOKEN`).

## Dependencies

- `viem` >= 2.0.0
- `wagmi` >= 2.0.0

## Useful Scripts

- `npm run build` — Build the package
- `npm test` — Run tests
- `npm run lint` — Linting
- `npm run typecheck` — Type checking
- `npm run example` — Run the basic example

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE)

## Support

- Email: support@evvm.org
- Documentation: [docs.evvm.org](https://evvm.info)

### Execute Transaction

```typescript
import { createConfig } from 'wagmi';
import { EVVMTransactionExecutor, PayInputData } from '@evvm/ts-library';

const config = createConfig({
  // your wagmi config
});

const executor = new EVVMTransactionExecutor(config);

const paymentData: PayInputData = {
  from: '0x742d35Cc6634C0532925a3b8D138068fd4C1B7a1',
  to_address: '0x456...',
  to_identity: 'username.evvm',
  token: '0x0000000000000000000000000000000000000000',
  amount: 1000000000000000000n,
  priorityFee: 50000000000000000n,
  nonce: 1n,
  priority: true,
  executor: '0x742d35Cc6634C0532925a3b8D138068fd4C1B7a1',
  signature: signature,
};

const txHash = await executor.executePay(
  paymentData,
  '0xEVVMContractAddress' as `0x${string}`
);
```

## API Reference

### Signature Builders

#### EVVMSignatureBuilder

Handles EVVM payment signatures:

- `signPay()` - Single payment signature
- `signDispersePay()` - Multiple recipient payment signature
- `signERC191Message()` - Generic EIP-191 message signing

#### NameServiceSignatureBuilder

Handles name service operations:

- `signPreRegistrationUsername()` - Pre-register username
- `signRegistrationUsername()` - Register username
- `signMakeOffer()` - Make offer for username
- `signWithdrawOffer()` - Withdraw offer
- `signAcceptOffer()` - Accept offer
- `signRenewUsername()` - Renew username
- `signAddCustomMetadata()` - Add custom metadata
- `signRemoveCustomMetadata()` - Remove custom metadata
- `signFlushCustomMetadata()` - Flush all metadata
- `signFlushUsername()` - Flush username

#### StakingSignatureBuilder

Handles staking operations:

- `signGoldenStaking()` - Golden staking (single signature)
- `signPresaleStaking()` - Presale staking (dual signature)
- `signPublicStaking()` - Public staking (dual signature)

### Transaction Executors

#### EVVMTransactionExecutor

Execute EVVM transactions:

- `executePay()` - Execute single payment
- `executeDispersePay()` - Execute multiple recipient payment
- `executePayMultiple()` - Execute multiple payments in one call

#### NameServiceTransactionExecutor

Execute name service transactions:

- `executePreRegistrationUsername()`
- `executeRegistrationUsername()`
- And more...

#### StakingTransactionExecutor

Execute staking transactions:

- `executeGoldenStaking()`
- `executePresaleStaking()`
- `executePublicStaking()`
- `executePublicServiceStaking()`

### Utility Functions

#### Hash Tools

- `hashDispersePaymentUsersToPay()` - Hash payment data for multiple recipients
- `hashPreRegisteredUsername()` - Hash username with clown number

#### Message Construction

- `buildMessageSignedForPay()` - Build payment message
- `buildMessageSignedForDispersePay()` - Build disperse payment message
- `buildMessageSignedForPublicStaking()` - Build staking message
- And many more message builders for different contract functions...

### Type Definitions

The library provides comprehensive TypeScript types:

- `PayInputData` - Single payment data structure
- `DispersePayInputData` - Multiple payment data structure
- `DispersePayMetadata` - Individual recipient data
- `GoldenStakingInputData` - Golden staking data
- `PresaleStakingInputData` - Presale staking data
- `PublicStakingInputData` - Public staking data
- `PublicServiceStakingInputData` - Service staking data
- Name service types: `PreRegistrationUsernameInputData`, `RegistrationUsernameInputData`, etc.

## Examples

### Disperse Payment

```typescript
import { DispersePayMetadata } from '@evvm/ts-library';

const recipients: DispersePayMetadata[] = [
  {
    amount: 500000000000000000n, // 0.5 ETH
    to_address: '0x123...',
    to_identity: 'alice.evvm'
  },
  {
    amount: 500000000000000000n, // 0.5 ETH
    to_address: '0x456...',
    to_identity: 'bob.evvm'
  }
];

const signature = await signatureBuilder.signDispersePay(
  1n, // evvmID
  recipients,
  '0x0000000000000000000000000000000000000000', // native token
  1000000000000000000n, // total amount (1 ETH)
  50000000000000000n, // priority fee
  1n, // nonce
  true, // priority flag
  executor
);
```

### Name Service Registration

```typescript
const { paySignature, actionSignature } = await nameServiceBuilder.signRegistrationUsername(
  1n, // evvmID
  '0xNameServiceAddress' as `0x${string}`,
  'myusername', // username
  12345n, // clown number
  1n, // nonce
  100000000000000000n, // priority fee (0.1 ETH)
  2n, // EVVM nonce
  true // priority flag
);
```

### Staking Operations

```typescript
// Golden staking (single signature)
const goldenSignature = await stakingBuilder.signGoldenStaking(
  1n, // evvmID
  '0xStakingAddress' as `0x${string}`,
  5083000000000000000000n, // 5083 EVVM
  1n, // nonce
  true // priority flag
);

// Public staking (dual signature)
const { paySignature, stakingSignature } = await stakingBuilder.signPublicStaking(
  1n, // evvmID
  '0xStakingAddress' as `0x${string}`,
  true, // is staking
  1000000000000000000n, // staking amount
  1n, // staking nonce
  1000000000000000000n, // total price
  50000000000000000n, // priority fee
  2n, // EVVM nonce
  true // priority flag
);
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
src/
├── types/           # TypeScript type definitions
│   ├── evvm.ts     # EVVM payment types
│   ├── nameService.ts # Name service types
│   ├── staking.ts  # Staking types
│   └── index.ts    # Type exports
├── utils/          # Utility functions
│   ├── hashTools.ts # Hashing utilities
│   ├── constructMessage.ts # Message builders
│   └── index.ts    # Utility exports
├── signatures/     # Signature building classes
│   ├── evvm.ts     # EVVM signature builder
│   ├── nameService.ts # Name service signature builder
│   ├── staking.ts  # Staking signature builder
│   └── index.ts    # Signature exports
├── executors/      # Transaction execution classes
│   ├── evvm.ts     # EVVM transaction executor
│   ├── nameService.ts # Name service transaction executor
│   ├── staking.ts  # Staking transaction executor
│   └── index.ts    # Executor exports
└── index.ts        # Main library export
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@evvm.org
- 💬 Discord: [EVVM Community](https://discord.gg/evvm)
- 📖 Documentation: [docs.evvm.org](https://docs.evvm.org)
- 🐛 Issues: [GitHub Issues](https://github.com/EVVM-org/EVVM_ts_library/issues)

## Changelog

### v1.0.0

- Initial release with complete EVVM ecosystem support
- Signature building for payments, staking, and name service
- Transaction execution utilities
- Comprehensive TypeScript support
- Full test coverage and documentation