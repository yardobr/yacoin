- Current focus: Implementing the Core Blockchain Module (@yacoin/core)
- Recent decisions: 
  - Chose UTXO model over account model
  - Functional programming style
  - Using esbuild via tsx for building packages
  - Storing esbuild config in `esbuild.config.ts`
  - Organized blockchain logic into `src/blockchain` directory (blockUtils, genesis, mining)
- Open questions: Specific P2P protocol details, storage implementation details, transaction validation details.
- Next steps: 
  1. Implement chain representation (e.g., in-memory `Block[]` array in `src/blockchain/chain.ts`).
  2. Implement basic chain/block validation logic (`src/blockchain/validation.ts`). 