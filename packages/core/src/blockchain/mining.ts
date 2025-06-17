import { Block, Transaction } from '../types';
import { calculateBlockHash } from './blockUtils';
import { createCoinbaseTransaction } from '../transaction/coinbase';
import { getLatestBlock, addBlock } from './chain';

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
 * Calculate the block reward based on block height using Bitcoin-like halving
 * @param blockHeight The height (index) of the block being mined
 * @returns The reward amount in coins
 */
export const calculateBlockReward = (blockHeight: number): number => {
  // Initial reward of 50 coins with halving every 210,000 blocks (like Bitcoin)
  const initialReward = 50;
  const halvingInterval = 210000;
  
  // Calculate number of halvings that have occurred
  const halvings = Math.floor(blockHeight / halvingInterval);
  
  // After 64 halvings, rewards effectively become zero
  if (halvings >= 64) {
    return 0;
  }
  
  // Divide initial reward by 2^halvings
  return initialReward / Math.pow(2, halvings);
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
 * Automatically includes a coinbase transaction with mining rewards.
 *
 * @param index The index for the new block.
 * @param previousBlock The previous block in the chain.
 * @param transactions The transactions to include.
 * @param difficulty The current mining difficulty.
 * @param minerAddress The miner's wallet address to receive rewards.
 * @param minerPublicKey The miner's public key.
 * @param minerData Optional data to include in the coinbase transaction.
 * @returns The newly mined Block object.
 */
export const mineBlock = (
  index: number,
  previousBlock: Block,
  transactions: Transaction[],
  difficulty: number,
  minerAddress: string,
  minerPublicKey: string,
  minerData?: string
): Block => {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Calculate the mining reward for this block height
  const reward = calculateBlockReward(index);
  
  // Create a coinbase transaction with the mining reward
  const coinbaseTransaction = createCoinbaseTransaction(
    index, 
    minerAddress,
    minerPublicKey,
    reward,
    minerData
  );
  
  // Ensure coinbase transaction is the first in the block
  const blockTransactions = [coinbaseTransaction, ...transactions];
  
  const nonce = findNonce(
    index,
    previousBlock.hash,
    timestamp,
    blockTransactions,
    difficulty
  );
  
  const hash = calculateBlockHash(
    index,
    previousBlock.hash,
    timestamp,
    blockTransactions,
    nonce,
    difficulty
  );

  const newBlock: Block = {
    index,
    timestamp,
    transactions: blockTransactions,
    previousHash: previousBlock.hash,
    hash,
    nonce,
    difficulty,
  };

  console.log(`Mined block ${index} with hash ${hash} (nonce: ${nonce}), reward: ${reward}`);
  return newBlock;
};

/**
 * Adds a delay to ensure sufficient time between blocks
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Integrated function to mine a new block and add it to the blockchain.
 * This function handles all necessary steps in one call.
 * 
 * @param transactions The transactions to include in the block (not including coinbase).
 * @param minerAddress The miner's wallet address to receive rewards.
 * @param minerPublicKey The miner's public key.
 * @param difficulty The mining difficulty.
 * @param minerData Optional data to include in the coinbase transaction.
 * @returns Promise<boolean> indicating success or failure.
 */
export const mineBlockAndAddToChain = async (
  transactions: Transaction[],
  minerAddress: string,
  minerPublicKey: string,
  difficulty: number,
  minerData?: string
): Promise<boolean> => {
  try {
    // Add a small delay to ensure timestamp will be different from previous block
    await delay(1100); // 1.1 seconds to ensure the timestamp changes (in seconds)
    
    const latestBlock = getLatestBlock();
    const newIndex = latestBlock.index + 1;
    
    // Mine the new block with automatic coinbase inclusion
    const newBlock = mineBlock(
      newIndex,
      latestBlock,
      transactions,
      difficulty,
      minerAddress,
      minerPublicKey,
      minerData
    );
    
    // Try to add the block to the chain
    const success = addBlock(newBlock);
    
    if (!success) {
      console.error("Failed to add newly mined block to the chain");
      return false;
    }
    
    // Calculate the reward for logging
    const reward = calculateBlockReward(newIndex);
    console.log(`Successfully mined and added block #${newIndex} with reward of ${reward} coins`);
    return true;
  } catch (error) {
    console.error("Error mining block:", error);
    return false;
  }
}; 