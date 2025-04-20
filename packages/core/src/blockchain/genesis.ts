import { Block, Transaction } from '../types';
import { calculateBlockHash } from './blockUtils';

// Define constants for the genesis block
const GENESIS_INDEX = 0;
const GENESIS_TIMESTAMP = Math.floor(Date.now() / 1000); // Use current time, could be fixed
const GENESIS_TRANSACTIONS: Transaction[] = []; // Start with no transactions
const GENESIS_PREVIOUS_HASH = '0'.repeat(64); // Standard 64-char zero hash
const GENESIS_NONCE = 0;
const GENESIS_DIFFICULTY = 1; // Initial difficulty

/**
 * Creates and returns the genesis block for the blockchain.
 * The genesis block is the first block with fixed values.
 *
 * @returns The genesis Block object.
 */
export const createGenesisBlock = (): Block => {
  const hash = calculateBlockHash(
    GENESIS_INDEX,
    GENESIS_PREVIOUS_HASH,
    GENESIS_TIMESTAMP,
    GENESIS_TRANSACTIONS,
    GENESIS_NONCE,
    GENESIS_DIFFICULTY
  );

  const genesisBlock: Block = {
    index: GENESIS_INDEX,
    timestamp: GENESIS_TIMESTAMP,
    transactions: GENESIS_TRANSACTIONS,
    previousHash: GENESIS_PREVIOUS_HASH,
    hash: hash,
    nonce: GENESIS_NONCE,
    difficulty: GENESIS_DIFFICULTY,
  };

  return genesisBlock;
}; 