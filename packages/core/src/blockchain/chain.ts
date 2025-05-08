import { Block } from "../types/block";
import { createGenesisBlock } from "./genesis";
import { isValidNewBlock } from "./validation";

export const blockchain: Block[] = [createGenesisBlock()];

/**
 * Adds a new block to the blockchain if it's valid
 * @param newBlock The new block to add to the chain
 * @returns boolean indicating success or failure
 */
export const addBlock = (newBlock: Block): boolean => {
  if (blockchain.length === 0) {
    console.error('Error: Blockchain is empty');
    return false;
  }
  
  const previousBlock = blockchain[blockchain.length - 1]!;
  
  // Validate the new block against the previous block
  if (!isValidNewBlock(newBlock, previousBlock)) {
    console.error('Error: Invalid block, not added to the chain');
    return false;
  }
  
  // If valid, add to the blockchain
  blockchain.push(newBlock);
  console.log(`Block #${newBlock.index} added to the blockchain`);
  return true;
};

/**
 * Gets the latest block in the blockchain
 * @returns The latest block
 */
export const getLatestBlock = (): Block => {
  if (blockchain.length === 0) {
    // This should never happen as we initialize with genesis block,
    // but adding for type safety
    throw new Error('Blockchain is empty');
  }
  return blockchain[blockchain.length - 1]!;
};

/**
 * Gets the entire blockchain
 * @returns A copy of the blockchain array
 */
export const getBlockchain = (): Block[] => {
  return [...blockchain];
};

/**
 * Replace our blockchain with the provided blockchain if it's valid and longer than ours
 * @param newChain The new blockchain to potentially replace ours
 * @returns boolean indicating success or failure
 */
export const replaceChain = (newChain: Block[]): boolean => {
  // To be implemented later with full chain validation
  return false;
}; 