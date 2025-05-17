/**
 * Common types shared between regular and coinbase transactions.
 * @module types/common
 */

/**
 * Represents a transaction output.
 * Common structure used by both regular and coinbase transactions.
 */
export type TxOut = {
  address: string;         // Recipient public key address
  amount: number;         // Amount of coins
  publicKey: string;      // Public key corresponding to the address
};

/**
 * Represents a transaction input.
 * References a previous unspent transaction output (UTXO).
 */
export type TxIn = {
  txOutId: string;      // The ID of the transaction containing the referenced UTXO
  txOutIndex: number;   // The index of the specific UTXO within the transaction's outputs
  signature: string;    // Signature to prove ownership (simplified as string for now)
};

/**
 * Base type for all transactions.
 * Contains fields common to both regular and coinbase transactions.
 */
export type BaseTransaction = {
  id: string;          // Transaction ID (hash of its contents)
  timestamp: number;   // Transaction creation timestamp
};
