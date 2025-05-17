import { CoinbaseTransaction } from './coinbase';
import { BaseTransaction, TxIn, TxOut } from './common';

/**
 * Represents a regular transaction, containing inputs and outputs.
 */
export type RegularTransaction = BaseTransaction & {
  type: 'regular';     // Type discriminator for transaction kind
  txIns: TxIn[];      // Array of transaction inputs
  txOuts: TxOut[];    // Array of transaction outputs
};

/**
 * Union type representing either a regular or coinbase transaction
 */
export type Transaction = RegularTransaction | CoinbaseTransaction;
