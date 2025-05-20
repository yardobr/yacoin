/**
 * YaCoin Mining Reward Demo
 *
 * This example demonstrates:
 * 1. Creating a block with a coinbase transaction
 * 2. Mining a block to earn rewards
 * 3. Validating coinbase transaction in a block
 * 4. Tracking spendable coinbase outputs based on maturity
 */

// Import core blockchain components
import { getLatestBlock, addBlock } from '../../core/src/blockchain/chain';
import { calculateBlockHash } from '../../core/src/blockchain/blockUtils';

// Import transaction components
import { createCoinbaseTransaction } from '../../core/src/transaction/coinbase';

// Import wallet for key generation
import { createWallet } from '../../wallet/src/index';

// Constants
const COINBASE_MATURITY = 100; // Number of blocks before coinbase can be spent
const DIFFICULTY = 2; // Mining difficulty (number of leading zeros in hash)

// Convert hex hash to binary to check difficulty
const hexToBinary = (hexString: string): string => {
  return hexString
    .split('')
    .map((hexChar) => parseInt(hexChar, 16).toString(2).padStart(4, '0'))
    .join('');
};

// Check if hash meets difficulty requirement
const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
  const requiredPrefix = '0'.repeat(difficulty);
  return hash.startsWith(requiredPrefix);
};

// Find valid nonce for a block (mining)
const mineBlock = (block: any, difficulty: number): any => {
  let nonce = 0;
  let hash = '';

  while (true) {
    hash = calculateBlockHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.transactions,
      nonce,
      difficulty
    );

    if (hashMatchesDifficulty(hash, difficulty)) {
      break;
    }

    nonce++;
    if (nonce % 100000 === 0) {
      console.log(`Still mining... nonce: ${nonce}`);
    }
  }

  return {
    ...block,
    hash,
    nonce
  };
};

// Create a new block
const createBlock = (previousHash: string, transactions: any[], index: number): any => {
  // Use timestamp with a small increment to ensure it's always greater than the previous block
  // Get the current time in seconds and add index to ensure it's always increasing
  const timestamp = Math.floor(Date.now() / 1000) + index;
  
  return {
    index,
    timestamp,
    transactions,
    previousHash,
    hash: '', // Will be calculated during mining
    nonce: 0, // Will be set during mining
    difficulty: DIFFICULTY
  };
};

// Utility function to calculate block reward based on block height
const calculateBlockReward = (blockHeight: number): number => {
  // Simple halving formula: 50 coins initial with halving every 210,000 blocks
  const halvings = Math.floor(blockHeight / 210000);
  const initialReward = 50;

  if (halvings >= 64) {
    return 0;
  }

  return initialReward / Math.pow(2, halvings);
};

// Start the demo
console.log('=== YaCoin Mining Reward Demo ===');

// Create a miner wallet
console.log('\nCreating miner wallet...');
const miner = createWallet();
console.log(`Miner's address: ${miner.address}`);

// Blockchain is already initialized with genesis block
console.log('\nInitializing blockchain...');
const genesisBlock = getLatestBlock();
console.log(`Genesis block created with index: ${genesisBlock.index}`);

// Track total rewards earned
let totalRewardsEarned = 0;

// Track coinbase outputs and their maturity
type CoinbaseOutput = {
  txId: string;
  blockHeight: number;
  amount: number;
  matureAtHeight: number;
  isSpendable: boolean;
};

const coinbaseOutputs: CoinbaseOutput[] = [];

// Mine several blocks to demonstrate rewards
console.log('\n=== Mining Blocks ===');
const blockCount = 5;

for (let i = 1; i <= blockCount; i++) {
  // Get the current state
  const currentIndex = getLatestBlock().index + 1;
  const reward = calculateBlockReward(currentIndex);

  console.log(`\nMining block #${currentIndex}...`);
  console.log(`Block reward: ${reward} coins`);

  // Create a coinbase transaction with the block reward
  const coinbaseTx = createCoinbaseTransaction(
    currentIndex,
    miner.address,
    miner.keyPair.publicKey,
    reward,
    `Block ${currentIndex} mined by YaCoin Miner`
  );

  // Create a new block with just the coinbase transaction
  const newBlock = createBlock(
    getLatestBlock().hash,
    [coinbaseTx],
    currentIndex
  );

  // Mine the block (find a valid nonce)
  console.log('Finding proof-of-work...');
  const minedBlock = mineBlock(newBlock, DIFFICULTY);
  console.log(`Block mined with hash: ${minedBlock.hash}`);
  console.log(`Nonce: ${minedBlock.nonce}`);

  // Add the block to the blockchain
  const added = addBlock(minedBlock);
  if (!added) {
    console.error('Failed to add block to blockchain!');
    continue;
  }

  // Track the coinbase output
  const matureAtHeight = currentIndex + COINBASE_MATURITY;
  coinbaseOutputs.push({
    txId: coinbaseTx.id,
    blockHeight: currentIndex,
    amount: reward,
    matureAtHeight,
    isSpendable: false
  });

  totalRewardsEarned += reward;
}

// Show reward summary
console.log('\n=== Mining Reward Summary ===');
console.log(`Total blocks mined: ${blockCount}`);
console.log(`Total rewards earned: ${totalRewardsEarned} coins`);

// Display coinbase outputs and their maturity
console.log('\n=== Coinbase Outputs ===');
console.log('Current blockchain index:', getLatestBlock().index);
console.log('\nCoinbase maturity: requires waiting', COINBASE_MATURITY, 'blocks\n');

coinbaseOutputs.forEach((output, index) => {
  // Update spendable status based on current index
  output.isSpendable = getLatestBlock().index >= output.matureAtHeight;

  console.log(`Output #${index + 1}:`);
  console.log(`- Transaction ID: ${output.txId}`);
  console.log(`- Amount: ${output.amount} coins`);
  console.log(`- Block height: ${output.blockHeight}`);
  console.log(`- Mature at height: ${output.matureAtHeight}`);
  console.log(`- Spendable: ${output.isSpendable}`);

  if (!output.isSpendable) {
    const blocksRemaining = output.matureAtHeight - getLatestBlock().index;
    console.log(`  (${blocksRemaining} more blocks needed before spendable)`);
  }
  console.log();
});

// Simulate mining more blocks to make some outputs mature
console.log('\n=== Advancing Blockchain ===');
const additionalBlocks = 95;
console.log(`Mining ${additionalBlocks} additional blocks to mature early coinbase outputs...`);

// Function to mine additional blocks
const mineAdditionalBlocks = async () => {
  // Fast-forward by mining empty blocks
  for (let i = 1; i <= additionalBlocks; i++) {
    const currentIndex = getLatestBlock().index + 1;

    // Create an empty block (with just coinbase, but we don't track these)
    const coinbaseTx = createCoinbaseTransaction(
      currentIndex,
      miner.address,
      miner.keyPair.publicKey,
      calculateBlockReward(currentIndex),
      ''
    );

    const newBlock = createBlock(
      getLatestBlock().hash,
      [coinbaseTx],
      currentIndex
    );

    const minedBlock = mineBlock(newBlock, DIFFICULTY);
    const added = addBlock(minedBlock);
    
    if (!added) {
      console.error(`Failed to add block #${currentIndex} to the chain!`);
      // Add a delay to ensure the next block has a higher timestamp
      // This helps prevent timestamp validation errors
      const delay = 1000; // 1 second
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Log progress at intervals
    if (i % 20 === 0 || i === additionalBlocks) {
      console.log(`Mined ${i} blocks, index now: ${getLatestBlock().index}`);
    }
  }
};

// Mine additional blocks
mineAdditionalBlocks();

// Show updated spendable outputs
console.log('\n=== Updated Coinbase Outputs ===');
console.log('Current blockchain index:', getLatestBlock().index);

let spendableAmount = 0;
let pendingAmount = 0;

coinbaseOutputs.forEach((output, index) => {
  // Update spendable status based on current index
  output.isSpendable = getLatestBlock().index >= output.matureAtHeight;

  if (output.isSpendable) {
    spendableAmount += output.amount;
  } else {
    pendingAmount += output.amount;
  }

  console.log(`Output #${index + 1}:`);
  console.log(`- Amount: ${output.amount} coins`);
  console.log(`- Mature at height: ${output.matureAtHeight}`);
  console.log(`- Spendable: ${output.isSpendable}`);

  if (!output.isSpendable) {
    const blocksRemaining = output.matureAtHeight - getLatestBlock().index;
    console.log(`  (${blocksRemaining} more blocks needed before spendable)`);
  }
  console.log();
});

// Show balance summary
console.log('=== Balance Summary ===');
console.log(`Spendable balance: ${spendableAmount} coins`);
console.log(`Pending (immature) balance: ${pendingAmount} coins`);
console.log(`Total balance: ${spendableAmount + pendingAmount} coins`);

console.log('\nDemo complete!');
