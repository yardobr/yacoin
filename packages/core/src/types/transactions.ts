/**
 * Represents a transaction output.
 */
export type TxOut = {
  address: string; // Recipient public key address
  amount: number;  // Amount of coins
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
 * Represents a transaction, containing inputs and outputs.
 */
export type Transaction = {
  id: string;      // Transaction ID (hash of its contents)
  txIns: TxIn[];   // Array of transaction inputs
  txOuts: TxOut[]; // Array of transaction outputs
}; 