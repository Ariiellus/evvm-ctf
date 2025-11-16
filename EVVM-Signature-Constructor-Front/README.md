# EVVM Signature Constructor

A Next.js-based web application for constructing and signing EVVM (Ethereum Virtual Virtual Machine) transactions using Reown AppKit and Wagmi. This tool provides a user-friendly interface for creating payment and staking signatures for the EVVM ecosystem.

## Getting Started

### Prerequisites
- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd front-tool
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Get your Project ID from [Reown Cloud](https://cloud.reown.com) and add it to `.env`:
```env
NEXT_PUBLIC_PROJECT_ID=your_project_id_here
```

5. Run the development server:
```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.



## Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button
2. Select your preferred wallet from the Reown AppKit modal
3. Approve the connection in your wallet

### Creating Payment Signatures

#### Single Payment
1. Navigate to the "Payment signatures" section
2. Choose between username or address for the recipient
3. Enter the recipient information
4. Fill in token address, amount, and priority fee
5. Generate a random nonce or enter a custom one
6. Select priority (Low for synchronous, High for asynchronous)
7. Click "Create signature" and approve in your wallet

#### Disperse Payment
1. Select the number of recipients (1-5)
2. For each recipient, choose username/address and enter details
3. Set token address, total amount, and priority fee
4. Configure executor settings if needed
5. Generate signature and approve in wallet

### Creating Staking Signatures

#### Golden Staking
1. Navigate to "Staking signatures"
2. Select staking or unstaking action
3. Enter staking address and amount
4. Generate nonce and set priority
5. Create signature

#### Presale Staking
1. Choose staking/unstaking action
2. Enter staking address and amount
3. Generate both EVVM and staking nonces
4. Set priority fee and priority level
5. Create dual signatures (EVVM + staking)

## Configuration

### Supported Networks
- Ethereum Mainnet
- Arbitrum

### Environment Variables
- `NEXT_PUBLIC_PROJECT_ID`: Your Reown Cloud project ID

## Key Components

### Message Construction
The [`constructMessage.tsx`](src/utils/constructMessage.tsx) utility handles building properly formatted messages for different signature types:

- `buildMessageSignedForPay`: Single payment signatures
- `buildMessageSignedForDispersePay`: Batch payment signatures  
- `buildMessageSignedForPresaleStaking`: Presale staking signatures
- `buildMessageSignedForPublicStaking`: Public staking signatures

### Data Hashing
The [`hashData.tsx`](src/utils/hashData.tsx) utility provides:

- `hashPreregisteredUsername`: Username hashing with clown numbers
- `hashDispersePaymentUsersToPay`: Payment data hashing for disperse operations

### Nonce Generation
Random nonce generation using Mersenne Twister algorithm for secure, non-predictable values.

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Resources

- [Reown Documentation](https://docs.reown.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)
- [EVVM Documentation](https://www.evvm.org/docs/SignatureStructures/)


## Usage

1. Go to [Reown Cloud](https://cloud.reown.com) and create a new project.
2. Copy your `Project ID`
3. Rename `.env.example` to `.env` and paste your `Project ID` as the value for `NEXT_PUBLIC_PROJECT_ID`
4. Run `pnpm install` to install dependencies
5. Run `pnpm run dev` to start the development server

## Resources

- [Reown — Docs](https://docs.reown.com)
- [Next.js — Docs](https://nextjs.org/docs)
