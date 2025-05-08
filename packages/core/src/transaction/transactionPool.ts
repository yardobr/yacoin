/**
 * Transaction Pool (mempool) implementation.
 * Stores and manages unconfirmed transactions.
 */

import { TransactionData } from './transactionUtils';
import { validateTransactionStructure, validateTransactionSemantics } from './validation';
import { UTXOSet } from './validation';

/**
 * Transaction pool (mempool) type
 */
export type TransactionPool = {
  transactions: TransactionData[];
};

/**
 * Create a new empty transaction pool
 */
export const createTransactionPool = (): TransactionPool => {
  return {
    transactions: []
  };
};

/**
 * Add a transaction to the pool if valid
 * Returns true if successful, false otherwise
 */
export const addToTransactionPool = (
  txPool: TransactionPool,
  tx: TransactionData, 
  utxoSet: UTXOSet
): boolean => {
  // Check if transaction is already in the pool
  const existingTx = txPool.transactions.find(t => t.id === tx.id);
  if (existingTx) {
    console.log(`Transaction ${tx.id} already exists in the pool.`);
    return false;
  }
  
  // Validate transaction structure
  if (!validateTransactionStructure(tx)) {
    console.error(`Transaction ${tx.id} has invalid structure.`);
    return false;
  }
  
  // Validate transaction semantics (including checking UTXOs)
  if (!validateTransactionSemantics(tx, utxoSet)) {
    console.error(`Transaction ${tx.id} has invalid semantics.`);
    return false;
  }
  
  // Check for double spending within the pool
  if (hasDoubleSpendInPool(txPool, tx)) {
    console.error(`Transaction ${tx.id} attempts to double spend in the pool.`);
    return false;
  }
  
  // All validation passed, add to pool
  txPool.transactions.push(tx);
  console.log(`Transaction ${tx.id} added to the pool.`);
  return true;
};

/**
 * Check if a transaction attempts to spend outputs that are already being spent
 * by transactions in the pool
 */
const hasDoubleSpendInPool = (txPool: TransactionPool, tx: TransactionData): boolean => {
  // Create a set of all outputs being spent in the pool (outputId:index)
  const spentOutputsInPool = new Set<string>();
  
  // Collect all spent outputs from existing pool transactions
  for (const poolTx of txPool.transactions) {
    for (const input of poolTx.inputs) {
      const key = `${input.transactionOutputId}:${input.outputIndex}`;
      spentOutputsInPool.add(key);
    }
  }
  
  // Check if any input of the new transaction is already spent in the pool
  for (const input of tx.inputs) {
    const key = `${input.transactionOutputId}:${input.outputIndex}`;
    if (spentOutputsInPool.has(key)) {
      return true; // Double spending detected
    }
  }
  
  return false;
};

/**
 * Remove a transaction from the pool
 */
export const removeFromTransactionPool = (
  txPool: TransactionPool,
  txId: string
): boolean => {
  const initialLength = txPool.transactions.length;
  txPool.transactions = txPool.transactions.filter(tx => tx.id !== txId);
  return txPool.transactions.length < initialLength;
};

/**
 * Get all transactions from the pool
 */
export const getTransactionsFromPool = (txPool: TransactionPool): TransactionData[] => {
  return [...txPool.transactions];
};

/**
 * Get a specific transaction from the pool
 */
export const getTransactionFromPool = (
  txPool: TransactionPool,
  txId: string
): TransactionData | undefined => {
  return txPool.transactions.find(tx => tx.id === txId);
};

/**
 * Update the transaction pool by removing transactions that use UTXOs
 * which have been spent in the newly added block
 */
export const updatePoolAfterBlockAdded = (
  txPool: TransactionPool,
  blockTransactions: TransactionData[]
): void => {
  // Collect all inputs from the block transactions
  const spentOutputs = new Set<string>();
  
  for (const tx of blockTransactions) {
    for (const input of tx.inputs) {
      const key = `${input.transactionOutputId}:${input.outputIndex}`;
      spentOutputs.add(key);
    }
  }
  
  // Remove transactions that try to spend outputs now in the blockchain
  txPool.transactions = txPool.transactions.filter(tx => {
    // Check if any input of this tx is now spent in the blockchain
    for (const input of tx.inputs) {
      const key = `${input.transactionOutputId}:${input.outputIndex}`;
      if (spentOutputs.has(key)) {
        console.log(`Removing tx ${tx.id} from pool as its inputs are now spent`);
        return false;
      }
    }
    return true;
  });
  
  // Also remove transactions that are now in the blockchain
  const blockTxIds = new Set(blockTransactions.map(tx => tx.id));
  txPool.transactions = txPool.transactions.filter(tx => !blockTxIds.has(tx.id));
};

/**
 * Clear the transaction pool
 */
export const clearTransactionPool = (txPool: TransactionPool): void => {
  txPool.transactions = [];
}; 