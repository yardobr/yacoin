/**
 * Specialized types for coinbase transactions which create new coins in the blockchain.
 * @module types/coinbase
 */

import { BaseTransaction, TxOut } from './common';

/**
 * Special data type for the coinbase transaction's arbitrary data field.
 */
export type CoinbaseData = {
  blockHeight: number;        // Required: height of the block this coinbase is for
  minerData?: string;        // Optional: arbitrary data from miner (like pool name, etc)
};

/**
 * Represents a coinbase transaction input.
 * Has no previous output reference, but contains block and miner data.
 */
export type CoinbaseTxIn = {
  blockHeight: number;      // Height of the block containing this coinbase
  data: string;            // Arbitrary data, serialized
};

/**
 * Represents a coinbase transaction that creates new coins.
 * Can only appear as the first transaction in a block.
 */
export type CoinbaseTransaction = BaseTransaction & {
  type: 'coinbase';        // Type discriminator for transaction kind
  txIn: CoinbaseTxIn;     // Single coinbase input with height and data
  txOut: TxOut;          // Single output containing block reward
};
