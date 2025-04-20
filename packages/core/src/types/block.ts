import { Transaction } from './transactions';

/**
 * Represents a block in the blockchain.
 */
export type Block = {
  index: number;          // Position in the chain
  timestamp: number;        // Creation time (Unix timestamp)
  transactions: Transaction[]; // Data payload (list of transactions)
  previousHash: string;     // Hash of the preceding block
  hash: string;             // Hash of this block
  nonce: number;            // Number for Proof-of-Work
  difficulty: number;       // The difficulty level for mining this block
}; 