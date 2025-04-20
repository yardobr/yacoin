# Active Context

This file tracks the immediate focus, recent changes, and next steps for the YaCoin project.

## Current Focus

The current focus is on building out the core blockchain mechanics within the `@yacoin/core` package.

## Recent Changes (Last Session)

- Created `packages/core/src/blockchain/chain.ts` to represent the blockchain as an array, initialized with the genesis block.
- Created `packages/core/src/blockchain/validation.ts` and implemented:
    - `isValidBlockStructure`: Checks basic block format.
    - `hashMatchesDifficulty`: Helper for PoW check.
    - `isValidNewBlock`: Validates a new block against its predecessor (index, timestamp, previousHash, calculatedHash, PoW).
    - `isValidChain`: Validates the entire blockchain integrity, starting from the genesis block and iterating through subsequent blocks.
- Resolved TypeScript type inference issues within `isValidChain`.

## Next Steps

1.  **Transaction Implementation:**
    - Define functions for creating transactions.
    - Implement transaction validation logic (e.g., signature verification - though we need wallets/keys first, input/output consistency). This might go in a new `src/transaction/` directory or `src/transaction/validation.ts`.
2.  **Adding Blocks:**
    - Implement a function to add a validated block to the `blockchain` array in `chain.ts`.
    - Integrate mining (`mineBlock` from `mining.ts`) and validation (`isValidNewBlock`) when adding new blocks.
3.  **Wallet/Keys:**
    - Implement basic public/private key generation and signing/verification logic (perhaps using `elliptic` or a similar library). This is needed for proper transaction signing and validation.
4.  **Difficulty Adjustment:**
    - Implement logic to adjust the mining `difficulty` based on block generation time (e.g., in `mining.ts` or `blockUtils.ts`).

## Active Decisions/Considerations

- Using `esbuild` for fast builds.
- Sticking to a simple in-memory array for the blockchain initially.
- Prioritizing core block and chain logic before full transaction/wallet implementation.

# Open questions: Specific P2P protocol details, storage implementation details, transaction validation details.
# Next steps: 
  1. Implement chain representation (e.g., in-memory `Block[]` array in `src/blockchain/chain.ts`).
  2. Implement basic chain/block validation logic (`src/blockchain/validation.ts`). 