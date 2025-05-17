/**
 * YaCoin Coinbase Transaction Example
 * 
 * This example demonstrates:
 * 1. Creating a coinbase transaction for block rewards
 * 2. Validating coinbase transactions
 * 3. Extracting coinbase data and block height
 * 4. Simulating the coinbase maturity period
 */

// Import wallet for key generation
import { createWallet } from '../wallet/src/index';

// Import coinbase-related functions from core
import { 
  createCoinbaseTransaction,
  isCoinbaseTransaction,
  getCoinbaseBlockHeight,
  getCoinbaseMinerData
} from '../core/src/transaction/coinbase';

// Utility function to calculate block reward based on block height
const calculateBlockReward = (blockHeight: number): number => {
  // Simple halving formula: 50 coins with halving every 210,000 blocks
  // This is similar to Bitcoin's reward schedule
  const halvings = Math.floor(blockHeight / 210000);
  const initialReward = 50;
  
  // No reward after 64 halvings (when reward would be less than 1 satoshi in Bitcoin)
  if (halvings >= 64) {
    return 0;
  }
  
  // Halve the reward for each halving that has occurred
  return initialReward / Math.pow(2, halvings);
};

// Create a miner wallet
console.log('Creating miner wallet...');
const miner = createWallet();
console.log(`Miner's address: ${miner.address}`);

// Simulate mining blocks at different heights
const blockHeights = [1, 100, 210000, 420000];

console.log('\n=== Creating Coinbase Transactions ===');
const coinbaseTransactions = blockHeights.map(height => {
  // Calculate appropriate reward for this height
  const reward = calculateBlockReward(height);
  
  // Create coinbase transaction
  const minerMessage = `Mined by YaCoin Miner - Block ${height}`;
  const coinbaseTx = createCoinbaseTransaction(
    height,
    miner.address,
    miner.keyPair.publicKey,
    reward,
    minerMessage
  );
  
  console.log(`\nBlock ${height} coinbase transaction created:`);
  console.log(`- Transaction ID: ${coinbaseTx.id}`);
  console.log(`- Block reward: ${reward} coins`);
  console.log(`- Miner address: ${coinbaseTx.txOut.address}`);
  
  return coinbaseTx;
});

// Validate the coinbase transactions
console.log('\n=== Validating Coinbase Transactions ===');
coinbaseTransactions.forEach((tx, index) => {
  const isValid = isCoinbaseTransaction(tx);
  console.log(`Coinbase transaction ${index} is valid: ${isValid}`);
  
  if (isValid) {
    // Extract coinbase data
    const blockHeight = getCoinbaseBlockHeight(tx);
    const minerData = getCoinbaseMinerData(tx);
    
    console.log(`- Block height: ${blockHeight}`);
    console.log(`- Miner data: ${minerData}`);
  }
});

// Simulate the coinbase maturity period
console.log('\n=== Simulating Coinbase Maturity ===');

// Create a simulated blockchain state
const currentBlockHeight = 120;
const COINBASE_MATURITY = 100; // Blocks that must pass before coinbase can be spent

// Check if the coinbase from the first block is mature enough to spend
const firstCoinbase = coinbaseTransactions[0];
const coinbaseHeight = getCoinbaseBlockHeight(firstCoinbase);
const blocksPassedSinceCreation = currentBlockHeight - coinbaseHeight;
const isMature = blocksPassedSinceCreation >= COINBASE_MATURITY;

console.log(`Current blockchain height: ${currentBlockHeight}`);
console.log(`Coinbase from block ${coinbaseHeight}:`);
console.log(`- Blocks passed since creation: ${blocksPassedSinceCreation}`);
console.log(`- Required maturity period: ${COINBASE_MATURITY} blocks`);
console.log(`- Is mature and spendable: ${isMature}`);

if (!isMature) {
  console.log(`- Blocks remaining until spendable: ${COINBASE_MATURITY - blocksPassedSinceCreation}`);
}

// Demonstrate validation with an invalid coinbase transaction
console.log('\n=== Testing Invalid Coinbase ===');

// Create an invalid coinbase by modifying a valid one
const invalidCoinbase = { ...coinbaseTransactions[0], txOut: { ...coinbaseTransactions[0].txOut, amount: -10 } };
const isValidCoinbase = isCoinbaseTransaction(invalidCoinbase);
console.log(`Invalid coinbase passes validation: ${isValidCoinbase} (should be false)`);

// Demonstrate checking for a specific block header within coinbase data
console.log('\n=== Extracting Block Information ===');
const blockToCheck = 210000;
const targetCoinbase = coinbaseTransactions.find(tx => getCoinbaseBlockHeight(tx) === blockToCheck);

if (targetCoinbase) {
  console.log(`Found coinbase for block ${blockToCheck}:`);
  console.log(`- Transaction ID: ${targetCoinbase.id}`);
  console.log(`- Reward amount: ${targetCoinbase.txOut.amount} coins`);
  console.log(`- Miner message: ${getCoinbaseMinerData(targetCoinbase)}`);
} else {
  console.log(`No coinbase found for block ${blockToCheck}`);
}

console.log('\nDemo complete!');