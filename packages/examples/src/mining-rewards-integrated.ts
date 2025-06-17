/**
 * YaCoin Integrated Mining Rewards Demo
 *
 * This example demonstrates:
 * 1. Creating blocks using the updated mining functions with automatic coinbase transactions
 * 2. Mining blocks with varying difficulty
 * 3. Validating blocks with coinbase transactions
 */

import { 
  getLatestBlock, 
  getBlockchain, 
  mineBlockAndAddToChain,
  calculateBlockReward
} from '../../core/src/blockchain';

import { createWallet } from '../../wallet/src/index';
import { Transaction } from '../../core/src/types';
import { Block } from '../../core/src/types/block';
import { isCoinbaseTransaction } from '../../core/src/transaction/coinbase';

// Constants
const INITIAL_DIFFICULTY = 2;

// Function to pretty-print blocks
const printBlock = (blockIndex: number): void => {
  const blockchain = getBlockchain();
  const block = blockchain.find((b: Block) => b.index === blockIndex);

  if (!block) {
    console.error(`Block with index ${blockIndex} not found`);
    return;
  }

  console.log(`\n=== Block #${block.index} ===`);
  console.log(`Hash: ${block.hash.substring(0, 12)}...`);
  console.log(`Previous Hash: ${block.previousHash.substring(0, 12)}...`);
  console.log(`Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}`);
  console.log(`Nonce: ${block.nonce}`);
  console.log(`Difficulty: ${block.difficulty}`);
  console.log(`Transactions: ${block.transactions.length}`);

  // If the block has a coinbase transaction, display its details
  const coinbaseTx = block.transactions.find((tx: Transaction) => 
    isCoinbaseTransaction(tx as Transaction)
  ) as Transaction | undefined;

  if (coinbaseTx && 'type' in coinbaseTx && coinbaseTx.type === 'coinbase') {
    console.log(`\nCoinbase Transaction:`);
    console.log(`  ID: ${coinbaseTx.id.substring(0, 12)}...`);
    console.log(`  Block Height: ${coinbaseTx.txIn.blockHeight}`);
    console.log(`  Reward: ${coinbaseTx.txOut.amount} coins`);
    
    // Try to parse and show miner data if available
    try {
      const data = JSON.parse(coinbaseTx.txIn.data);
      console.log(`  Miner Data: ${data.minerData || 'None'}`);
    } catch (e) {
      console.log(`  Miner Data: Unable to parse`);
    }
  }
};

// Main demo as an async function
const runDemo = async (): Promise<void> => {
  console.log('=== YaCoin Integrated Mining Rewards Demo ===');

  // Create miners
  console.log('\nCreating miners...');
  const miner1 = createWallet();
  const miner2 = createWallet();

  console.log(`Miner 1 Address: ${miner1.address.substring(0, 10)}...`);
  console.log(`Miner 2 Address: ${miner2.address.substring(0, 10)}...`);

  // Show genesis block
  console.log('\nStarting with genesis block:');
  printBlock(0);

  // Mine a series of blocks with different miners
  console.log('\n=== Mining First Block ===');
  const success1 = await mineBlockAndAddToChain(
    [], // No regular transactions
    miner1.address,
    miner1.keyPair.publicKey,
    INITIAL_DIFFICULTY,
    'First block by Miner 1'
  );

  if (success1) {
    printBlock(1);
    
    // Calculate and display the reward 
    const blockReward = calculateBlockReward(1);
    console.log(`\nMiner 1 earned ${blockReward} coins`);
  }

  console.log('\n=== Mining Second Block ===');
  const success2 = await mineBlockAndAddToChain(
    [], // No regular transactions
    miner2.address,
    miner2.keyPair.publicKey,
    INITIAL_DIFFICULTY,
    'First block by Miner 2'
  );

  if (success2) {
    printBlock(2);
    
    // Calculate and display the reward
    const blockReward = calculateBlockReward(2);
    console.log(`\nMiner 2 earned ${blockReward} coins`);
  }

  // Mine a third block with increased difficulty
  console.log('\n=== Mining Third Block with Higher Difficulty ===');
  const higherDifficulty = INITIAL_DIFFICULTY + 1;
  const success3 = await mineBlockAndAddToChain(
    [], // No regular transactions
    miner1.address,
    miner1.keyPair.publicKey,
    higherDifficulty,
    'Higher difficulty block by Miner 1'
  );

  if (success3) {
    printBlock(3);
    
    // Calculate and display the reward
    const blockReward = calculateBlockReward(3);
    console.log(`\nMiner 1 earned ${blockReward} coins`);
  }

  // Demonstrate halving - mock a high block height by calculating what the reward would be
  console.log('\n=== Mining Reward Halving Demonstration ===');
  const blockHeights = [1, 210000, 420000, 630000];

  console.log('Block Reward Halving Schedule:');
  blockHeights.forEach(height => {
    const reward = calculateBlockReward(height);
    console.log(`Block ${height}: ${reward} coins`);
  });

  // Summary
  console.log('\n=== Mining Rewards Summary ===');
  console.log(`Total blocks mined: ${getLatestBlock().index}`);

  let totalCoinbaseAmount = 0;
  getBlockchain().forEach((block: Block) => {
    const coinbaseTx = block.transactions.find((tx: Transaction) => 
      tx.type === 'coinbase'
    ) as Transaction | undefined;
    
    if (coinbaseTx && 'txOut' in coinbaseTx) {
      totalCoinbaseAmount += coinbaseTx.txOut.amount;
    }
  });

  console.log(`Total rewards issued: ${totalCoinbaseAmount} coins`);
  console.log('\nDemo completed successfully!');
};

// Run the demo and handle any errors
runDemo().catch(error => {
  console.error('Error running demo:', error);
}); 