# MATE Name Service dApp

A decentralized application (dApp) for registering usernames in the MATE Name Service on the EVVM ecosystem.

## Features

- 🔐 **Secure Pre-Registration**: Commit-reveal scheme prevents front-running attacks
- ⏱️ **30-Minute Waiting Period**: Security measure to prevent abuse
- 💰 **EVVM Payment Integration**: Seamless payment processing through EVVM
- 🎨 **Modern UI**: Beautiful, responsive interface built with React
- 🔗 **Wallet Integration**: Connect with MetaMask or any injected wallet

## How It Works

1. **Pre-Register**: Commit to a username hash with a secret number (clowNumber)
2. **Wait**: 30-minute security waiting period
3. **Register**: Reveal your username and secret number to complete registration

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- A Web3 wallet (MetaMask recommended)
- Sepolia testnet configured in your wallet

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Configuration

Contract addresses and configuration are in `src/config.ts`:

- **EVVM Address**: `0x9902984d86059234c3B6e11D5eAEC55f9627dD0f`
- **Name Service Address**: `0x93DFFaEd15239Ec77aaaBc79DF3b9818dD3E406A`
- **EVVM ID**: 2
- **Network**: Sepolia Testnet

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Navigate to the "Pre-Register" tab
3. Enter your desired username and a secret number (auto-generated if left empty)
4. Click "Pre-Register Username" and sign the messages
5. Wait 30 minutes
6. Navigate to the "Complete Registration" tab
7. Enter your pre-registered username
8. Click "Complete Registration" and sign the messages
9. Pay the registration fee via EVVM

## Technical Details

### Signature Structure

The dApp implements EIP-191 signatures for all operations:

- **Pre-Registration**: `{evvmID},preRegistrationUsername,{hashUsername},{nameServiceNonce}`
- **Registration**: `{evvmID},registrationUsername,{username},{clowNumber},{nameServiceNonce}`
- **Payment**: `{evvmID},pay,{to_address},{to_identity},{token},{amount},{priorityFee},{nonce},{priority},{executor}`

### Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **wagmi v2**: Ethereum wallet integration
- **viem**: Ethereum library
- **Vite**: Build tool

## License

MIT
