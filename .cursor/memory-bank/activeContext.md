# Active Context

This file tracks the immediate focus, recent changes, and next steps for the YaCoin project.

## Current Focus

The current focus is on building out the core blockchain mechanics within the `@yacoin/core` package, with a particular emphasis on transaction creation and validation.

## Recent Changes (Last Session)

- Created `packages/core/src/blockchain/chain.ts` to represent the blockchain as an array, initialized with the genesis block.
- Created `packages/core/src/blockchain/validation.ts` and implemented:
    - `isValidBlockStructure`: Checks basic block format.
    - `hashMatchesDifficulty`: Helper for PoW check.
    - `isValidNewBlock`: Validates a new block against its predecessor (index, timestamp, previousHash, calculatedHash, PoW).
    - `isValidChain`: Validates the entire blockchain integrity, starting from the genesis block and iterating through subsequent blocks.
- Resolved TypeScript type inference issues within `isValidChain`.
- Created `packages/core/src/transaction/transactionUtils.ts`:
    - Defined `TransactionInput`, `TransactionOutput`, `Transaction`, and `UnspentOutput` types (using only TypeScript types, no interfaces).
    - Implemented `createTransaction` to construct transactions from UTXOs, including change output and placeholder signing logic.
- Created `packages/core/src/transaction/validation.ts`:
    - Implemented `validateTransactionStructure` for deep structural checks on transactions, inputs, and outputs.
    - Implemented `validateTransactionSemantics` for semantic checks:
        - UTXO existence and unspent status
        - No double-spending within a transaction
        - Placeholder signature verification
        - Input/output sum consistency
        - Output positivity
- All validation and creation logic follows a functional, type-based style (no classes/interfaces).

## Next Steps

1.  **Wallet/Keys:**
    - Implement basic public/private key generation and signing/verification logic (e.g., using `elliptic`).
    - Integrate real cryptographic signing and signature verification into transaction creation and validation.
2.  **Adding Blocks:**
    - Implement a function to add a validated block to the `blockchain` array in `chain.ts`.
    - Integrate mining (`mineBlock` from `mining.ts`) and validation (`isValidNewBlock`) when adding new blocks.
3.  **Difficulty Adjustment:**
    - Implement logic to adjust the mining `difficulty` based on block generation time (e.g., in `mining.ts` or `blockUtils.ts`).

## Active Decisions/Considerations

- Using `esbuild` for fast builds.
- Sticking to a simple in-memory array for the blockchain initially.
- Prioritizing core block, chain, and transaction logic before full wallet implementation.
- All types are defined using `type` (not `interface`), and code is functional.

# Open questions: Specific P2P protocol details, storage implementation details, transaction pool design, and full cryptographic integration.
# Next steps: 
  1. Implement chain representation (e.g., in-memory `Block[]` array in `src/blockchain/chain.ts`).
  2. Implement basic chain/block validation logic (`src/blockchain/validation.ts`). 