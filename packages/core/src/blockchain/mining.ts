import { Block, Transaction } from '../types';
import { calculateBlockHash } from './blockUtils';

/**
 * Converts a hexadecimal string to its binary representation.
 * @param hexString The hexadecimal string.
 * @returns The binary string representation.
 */
const hexToBinary = (hexString: string): string => {
  return hexString
    .split('')
    .map((hexChar) => parseInt(hexChar, 16).toString(2).padStart(4, '0'))
    .join('');
};

/**
 * Checks if a hash meets the difficulty requirement (starts with enough zeros).
 * @param hash The block hash (hexadecimal).
 * @param difficulty The required number of leading zeros in the binary representation.
 * @returns True if the hash is valid, false otherwise.
 */
const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
  const hashInBinary = hexToBinary(hash);
  const requiredPrefix = '0'.repeat(difficulty);
  return hashInBinary.startsWith(requiredPrefix);
};

/**
 * Finds a nonce that results in a block hash matching the specified difficulty.
 * This is the core Proof-of-Work computation.
 *
 * @param index The index of the block to mine.
 * @param previousHash The hash of the previous block.
 * @param timestamp The timestamp for the new block.
 * @param transactions The transactions to include in the block.
 * @param difficulty The mining difficulty.
 * @returns The nonce that satisfies the difficulty requirement.
 */
const findNonce = (
  index: number,
  previousHash: string,
  timestamp: number,
  transactions: Transaction[],
  difficulty: number
): number => {
  let nonce = 0;
  while (true) {
    const hash = calculateBlockHash(
      index,
      previousHash,
      timestamp,
      transactions,
      nonce,
      difficulty
    );
    if (hashMatchesDifficulty(hash, difficulty)) {
      return nonce;
    }
    nonce++;
    
    // Log the nonce every 100000 iterations
    if (nonce % 100000 === 0) console.log(`Mining... nonce: ${nonce}`);
  }
};

/**
 * Mines a new block by finding a valid nonce and calculating the hash.
 *
 * @param index The index for the new block.
 * @param previousBlock The previous block in the chain.
 * @param transactions The transactions to include.
 * @param difficulty The current mining difficulty.
 * @returns The newly mined Block object.
 */
export const mineBlock = (
  index: number,
  previousBlock: Block,
  transactions: Transaction[],
  difficulty: number
): Block => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = findNonce(
    index,
    previousBlock.hash,
    timestamp,
    transactions,
    difficulty
  );
  const hash = calculateBlockHash(
    index,
    previousBlock.hash,
    timestamp,
    transactions,
    nonce,
    difficulty
  );

  const newBlock: Block = {
    index,
    timestamp,
    transactions,
    previousHash: previousBlock.hash,
    hash,
    nonce,
    difficulty,
  };

  console.log(`Mined block ${index} with hash ${hash} (nonce: ${nonce})`);
  return newBlock;
}; 