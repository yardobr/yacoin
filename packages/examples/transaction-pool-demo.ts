/**
 * YaCoin Transaction Pool Example
 * 
 * This example demonstrates:
 * 1. Creating a transaction pool
 * 2. Adding valid transactions to the pool
 * 3. Validating transactions before adding them
 * 4. Handling double-spending attempts
 */

// Import wallet first to ensure its signature verifier is registered
import { createWallet } from '../wallet/src/index';

import { 
  TransactionData, 
  UnspentOutput,
  createTransactionPool,
  addToTransactionPool,
  getTransactionsFromPool,
  removeFromTransactionPool,
  updatePoolAfterBlockAdded
} from '../core/src/transaction';
import { createTransaction } from '../wallet/src/wallet';

// Create wallets
console.log('Creating wallets...');
const alice = createWallet();
const bob = createWallet();
const charlie = createWallet();

console.log(`Alice's address: ${alice.address}`);
console.log(`Bob's address: ${bob.address}`);
console.log(`Charlie's address: ${charlie.address}`);

// Create UTXOs for testing
const aliceUtxos: UnspentOutput[] = [
  {
    transactionOutputId: 'genesis-transaction',
    outputIndex: 0,
    address: alice.address,
    amount: 50,
    publicKey: alice.keyPair.publicKey
  },
  {
    transactionOutputId: 'mining-reward-1',
    outputIndex: 0,
    address: alice.address,
    amount: 50,
    publicKey: alice.keyPair.publicKey
  }
];

// Create a transaction pool
console.log('\nCreating transaction pool...');
const txPool = createTransactionPool();

// Create a transaction from Alice to Bob
console.log('\nCreating transaction from Alice to Bob...');
const tx1 = createTransaction(
  alice,           // Sender's wallet
  bob.address,     // Recipient's address
  bob.keyPair.publicKey, // Recipient's public key
  40,              // Amount to send
  aliceUtxos       // Available UTXOs
);

if (!tx1) {
  console.error('Failed to create transaction 1');
  process.exit(1);
}

// Add the transaction to the pool
console.log('\nAdding transaction 1 to the pool...');
const success1 = addToTransactionPool(txPool, tx1, aliceUtxos);
console.log(`Transaction 1 added to pool: ${success1}`);

// Get all transactions from the pool
console.log('\nTransactions in the pool:');
const pooledTransactions = getTransactionsFromPool(txPool);
console.log(`Number of transactions: ${pooledTransactions.length}`);

// Try to add the same transaction again (should fail)
console.log('\nTrying to add the same transaction again...');
const duplicate = addToTransactionPool(txPool, tx1, aliceUtxos);
console.log(`Duplicate transaction added: ${duplicate} (should be false)`);

// Create another transaction using the same UTXO (double-spend attempt)
console.log('\nCreating a double-spend transaction...');
const tx2 = createTransaction(
  alice,           // Sender's wallet
  charlie.address, // Recipient's address
  charlie.keyPair.publicKey, // Recipient's public key
  45,              // Different amount
  aliceUtxos       // Same UTXOs (double-spend)
);

if (!tx2) {
  console.error('Failed to create transaction 2');
  process.exit(1);
}

// Try to add the double-spend to the pool (should fail)
console.log('\nTrying to add double-spend transaction to the pool...');
const success2 = addToTransactionPool(txPool, tx2, aliceUtxos);
console.log(`Double-spend transaction added: ${success2} (should be false)`);

// Remove a transaction from the pool
console.log('\nRemoving transaction 1 from the pool...');
const removed = removeFromTransactionPool(txPool, tx1.id);
console.log(`Transaction removed: ${removed}`);

// Check pool is empty
console.log('\nChecking pool after removal:');
const remainingTransactions = getTransactionsFromPool(txPool);
console.log(`Transactions in pool: ${remainingTransactions.length} (should be 0)`);

// Now the double-spend can be added (since original is removed)
console.log('\nTrying to add transaction 2 after removal of transaction 1...');
const success3 = addToTransactionPool(txPool, tx2, aliceUtxos);
console.log(`Transaction 2 added: ${success3} (should be true)`);

// Simulate a block being mined with tx2
console.log('\nSimulating a block with transaction 2 being added to the blockchain...');
const blockTransactions: TransactionData[] = [tx2];
updatePoolAfterBlockAdded(txPool, blockTransactions);

// Check pool is empty again
console.log('\nChecking pool after block added:');
const finalTransactions = getTransactionsFromPool(txPool);
console.log(`Transactions in pool: ${finalTransactions.length} (should be 0)`);

console.log('\nDemo complete!'); 