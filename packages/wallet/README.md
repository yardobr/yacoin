# YaCoin Wallet Package

This package provides wallet functionality for the YaCoin cryptocurrency.

## Features

- Key pair generation using elliptic curve cryptography (secp256k1)
- Digital signatures and signature verification
- Wallet address creation
- Transaction creation with real cryptographic signatures
- Integration with the YaCoin core package

## Usage

```typescript
import { createWallet, createTransaction } from '@yacoin/wallet';

// Create a new wallet
const wallet = createWallet();

// Log wallet details
console.log('Wallet address:', wallet.address);
console.log('Public key:', wallet.keyPair.publicKey);
console.log('Private key:', wallet.keyPair.privateKey);

// Create a transaction
const transaction = createTransaction(
  wallet,
  'recipient-address',
  100,
  availableUtxos
);

// The transaction is now properly signed and ready to be broadcast
```

## Installation

```bash
npm install @yacoin/wallet
```

## Dependencies

- `@yacoin/core`: For transaction types and utilities
- `elliptic`: For elliptic curve cryptography

## Building

```bash
npm run build
```

## Security Notes

- The private key must be kept secure and should never be shared
- All transaction signing is done locally before being broadcast
- Wallet addresses are derived from public keys using SHA-256 and RIPEMD-160 hashing 