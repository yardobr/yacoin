import crypto from 'crypto';
// Update import path for types
import { Block, Transaction } from '../types';

/**
 * Calculates the SHA256 hash of a block's essential data.
 * The block's own 'hash' property is NOT included in the calculation.
 *
 * @param index - The block's index.
 * @param previousHash - The hash of the previous block.
 * @param timestamp - The block's timestamp.
 * @param transactions - The transactions included in the block.
 * @param nonce - The block's nonce value.
 * @param difficulty - The block's difficulty value.
 * @returns The SHA256 hash as a hexadecimal string.
 */
export const calculateBlockHash = (
  index: number,
  previousHash: string,
  timestamp: number,
  transactions: Transaction[],
  nonce: number,
  difficulty: number
): string => {
  // Deterministically stringify transactions for hashing
  // Sorting might be needed in a real implementation for absolute determinism
  const transactionDataString = JSON.stringify(transactions);

  const dataToHash =
    index.toString() +
    previousHash +
    timestamp.toString() +
    transactionDataString +
    nonce.toString() +
    difficulty.toString();

  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return hash;
};

/**
 * Calculates the hash for a given block object by calling calculateBlockHash
 * with the block's properties.
 * @param block The block to calculate the hash for.
 * @returns The calculated SHA256 hash.
 */
export const calculateHashForBlock = (block: Block): string => {
    return calculateBlockHash(
        block.index,
        block.previousHash,
        block.timestamp,
        block.transactions,
        block.nonce,
        block.difficulty
    );
} 