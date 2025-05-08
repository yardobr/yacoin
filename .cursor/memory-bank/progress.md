# Progress

Tracks what's working, what's left, current status, and known issues.

## What Works

- **Workspace Setup:** NPM workspace initialized.
- **`@yacoin/core` Package:**
    - Basic structure created (`src/`, `package.json`, `tsconfig.json`).
    - Build configured with `esbuild` (`esbuild.config.ts`) and runnable via `tsx`.
    - Core types defined (`Block`, `Transaction`, `TxIn`, `TxOut` in `src/types/`).
    - Blockchain utilities:
        - Block hashing (`calculateBlockHash` in `src/blockchain/blockUtils.ts`).
        - Genesis block creation (`createGenesisBlock` in `src/blockchain/genesis.ts`).
        - Basic Proof-of-Work mining (`mineBlock`, `hashMatchesDifficulty` in `src/blockchain/mining.ts`).
    - **Chain Representation:** Blockchain array initialized with genesis block (`blockchain` in `src/blockchain/chain.ts`).
    - **Block & Chain Validation:** Core validation functions implemented (`isValidBlockStructure`, `isValidNewBlock`, `isValidChain` in `src/blockchain/validation.ts`).
    - **Transaction System:**
        - Transaction types (`TransactionInput`, `TransactionOutput`, `Transaction`, `UnspentOutput`) defined using TypeScript types.
        - Transaction creation (`createTransaction`) implemented, including change output and placeholder signing.
        - Transaction validation:
            - Structural validation (`validateTransactionStructure`) checks all fields and nested structures.
            - Semantic validation (`validateTransactionSemantics`) checks UTXO existence, double-spending, signature placeholder, and input/output sum.

## What's Left to Build (High Level - see activeContext.md for details)

- Wallet/key management (generation, signing, verification, real cryptography).
- Adding new blocks to the chain (including mining integration).
- Mining difficulty adjustment.
- Transaction pool implementation.
- Network layer (P2P communication).
- Persistent storage.
- API/CLI for interaction.

## Current Status

- Core data structures for blocks and transactions are defined.
- Transaction creation and validation logic is implemented and tested at the type/logic level.
- The blockchain is represented as an in-memory array.
- Essential validation logic for individual blocks, the overall chain, and transactions is implemented.
- The next major steps involve implementing wallet/key management and the process of adding new, validated blocks to the chain.

## Known Issues/TODOs

- Transaction signature logic is a placeholder (needs real cryptographic signing/verification).
- Mining difficulty is currently static.
- Proof-of-Work validation in `validation.ts` uses the block's own difficulty; needs integration with dynamic difficulty adjustment logic later.
- No wallet implementation yet.
- No network layer.
- No persistence. 