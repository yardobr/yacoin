import { Block } from "../types";
import { calculateBlockHash } from "./blockUtils";
import { createGenesisBlock } from "./genesis";

/**
 * Validates the structure of a given block.
 * Checks if the block has all required properties and if their types are correct.
 *
 * @param block The block to validate.
 * @returns True if the block structure is valid, false otherwise.
 */
export const isValidBlockStructure = (block: Block): boolean => {
    return (
        typeof block.index === "number" &&
        typeof block.timestamp === "number" &&
        typeof block.previousHash === "string" &&
        typeof block.hash === "string" &&
        typeof block.nonce === "number" &&
        typeof block.difficulty === "number" &&
        Array.isArray(block.transactions) // Add more transaction validation later if needed
    );
};

/**
 * Checks if a given hash meets the required difficulty (starts with enough zeros).
 *
 * @param hash The hash to check.
 * @param difficulty The required difficulty (number of leading zeros).
 * @returns True if the hash meets the difficulty, false otherwise.
 */
const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
    const requiredPrefix = '0'.repeat(difficulty);
    return hash.startsWith(requiredPrefix);
};

/**
 * Validates a new block in relation to the previous block in the chain.
 *
 * @param newBlock The new block to validate.
 * @param previousBlock The previous block in the chain.
 * @returns True if the new block is valid, false otherwise.
 */
export const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (!isValidBlockStructure(newBlock)) {
        console.error("Invalid block structure");
        return false;
    }
    if (previousBlock.index + 1 !== newBlock.index) {
        console.error("Invalid index");
        return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
        console.error("Invalid previous hash");
        return false;
    }
    // Basic timestamp validation: new block's timestamp should be after the previous one
    // More sophisticated validation could be added (e.g., not too far in the future)
    if (newBlock.timestamp <= previousBlock.timestamp) {
        console.error("Invalid timestamp");
        return false;
    }

    // Calculate the hash of the new block and validate it
    const calculatedHash = calculateBlockHash(
        newBlock.index,
        newBlock.previousHash,
        newBlock.timestamp,
        newBlock.transactions,
        newBlock.nonce,
        newBlock.difficulty
    );

    if (calculatedHash !== newBlock.hash) {
        console.error(`Invalid hash: calculated ${calculatedHash}, block has ${newBlock.hash}`);
        return false;
    }

    // Validate Proof-of-Work: Check if the hash meets the difficulty target
    if (!hashMatchesDifficulty(newBlock.hash, newBlock.difficulty)) {
        console.error(`Invalid proof-of-work: difficulty ${newBlock.difficulty}, hash ${newBlock.hash}`);
        return false;
    }

    return true;
};

/**
 * Validates the integrity of the entire blockchain.
 *
 * @param chain The blockchain (array of blocks) to validate.
 * @returns True if the chain is valid, false otherwise.
 */
export const isValidChain = (chain: Block[]): boolean => {
    // Check if the chain is empty
    if (chain.length === 0) {
        console.error("Blockchain cannot be empty.");
        return false;
    }

    // Assign first block after length check to help type inference
    const firstBlock = chain[0];
    if (!firstBlock) {
        // This should theoretically be unreachable due to length check, but satisfies TS
        console.error("Chain is empty after length check?"); 
        return false;
    }

    // Check if the first block is the correct genesis block
    const genesisBlock = createGenesisBlock();
    if (JSON.stringify(firstBlock) !== JSON.stringify(genesisBlock)) {
        console.error("Invalid genesis block.");
        return false;
    }

    // Validate subsequent blocks using reduce
    const allBlocksValid = chain.slice(1).reduce((isValid, currentBlock, index) => {
        if (!isValid) {
            return false; // Stop processing if an invalid block was found
        }
        // `index` is 0-based for the sliced array (blocks from index 1 onwards).
        // The previous block in the original chain is at `index`.
        const previousBlock = chain[index]; 
        const actualCurrentBlockIndex = index + 1;

        if (!isValidNewBlock(currentBlock, previousBlock!)) {
            console.error(`Invalid block at index ${actualCurrentBlockIndex}`);
            return false;
        }
        return true;
    }, true); // Initial value: assume valid until proven otherwise

    return allBlocksValid;
}; 