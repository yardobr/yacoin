# Active Context

This file tracks the immediate focus, recent changes, and next steps for the YaCoin project.

## Current Focus

The current focus is on implementing the remaining core cryptocurrency functionality, specifically focusing on mining rewards, network layer, and enhancing transaction validation.

## Recent Changes (Last Session)

- Improved the UTXO model to store public keys:
  - Added `publicKey` field to `UnspentOutput` and `TransactionOutput` types in `packages/core/src/transaction/transactionUtils.ts`
  - Updated transaction creation functions to include public keys for proper verification
  - Modified examples to work with the updated UTXO model

- Integrated wallet signature verification into the core transaction validation:
  - Implemented a dependency inversion architecture to avoid direct dependency of core on wallet
  - Created `verification.ts` with a `SignatureVerifier` interface in the core package
  - Updated the validation.ts to use the signature verifier interface
  - Made the wallet package register its verifier implementation with the core

- Implemented a transaction pool (mempool) for unconfirmed transactions:
  - Created `transactionPool.ts` with functions to manage unconfirmed transactions
  - Implemented double-spend prevention within the pool using efficient Set data structure
  - Added functions to add, remove, and validate transactions
  - Created functionality to update the pool when blocks are added to the chain
  - Added a demo example for the transaction pool

- Fixed architectural issues:
  - Inverted dependencies so the core package doesn't depend on the wallet
  - Optimized `hasDoubleSpendInPool` from O(n²m) to O(n+m) complexity using Sets
  - Renamed `Transaction` to `TransactionData` to resolve type conflicts
  - Updated package exports and imports for better organization

## Next Steps

1. **Mining Reward Mechanism:**
   - ✅ Created coinbase transaction structure in `packages/core/src/types/coinbase.ts`
   - ✅ Implemented coinbase transaction creation and validation in `packages/core/src/transaction/coinbase.ts`
   - ✅ Implemented mining rewards calculation with Bitcoin-like halving approach in example files
   - 🔄 Integrate mining rewards with core block creation process
   - 🔄 Update mining functions to automatically include coinbase transactions

2. **Difficulty Adjustment:**
   - Implement logic to adjust the mining `difficulty` based on block generation time
   - Add time-based rules to ensure steady block production

3. **Network Layer:**
   - Design and implement the P2P network protocol
   - Add node discovery and blockchain synchronization
   - Create transaction broadcasting functionality

4. **Storage Implementation:**
   - Design a persistent storage solution for the blockchain
   - Create serialization/deserialization methods for blocks and transactions
   - Implement database operations for saving and loading the chain

5. **CLI/API Interface:**
   - Create command-line tools for node operations
   - Add wallet management commands
   - Implement transaction creation/mining commands

## Active Decisions/Considerations

- Using dependency inversion for crypto functionality to maintain proper package dependencies
- Optimizing data structures for performance (Sets for transaction pool validation)
- Maintaining proper package separation: core should not depend on higher-level packages
- Using registration pattern for connecting wallet functionality to core
- Following functional programming principles for all code
- All types defined using `type` (not `interface`)

# Open questions: Specific P2P protocol details, storage implementation details, transaction pool design, and full cryptographic integration.
# Next steps: 
  1. Integrate mining rewards directly into the core mining process.
  2. Update block mining to automatically include coinbase transactions. 