import crypto from 'crypto';
import { CoinbaseTransaction, CoinbaseData, CoinbaseTxIn } from '../types/coinbase';
import { TxOut } from '../types/common';

// Maximum length for coinbase data (100 bytes)
const MAX_COINBASE_DATA_LENGTH = 100;

// Calculates the transaction ID for a coinbase transaction
const calculateCoinbaseTransactionId = (
  blockHeight: number,
  coinbaseData: string,
  txOut: TxOut,
  timestamp: number
): string => {
  const data = `${blockHeight}:${coinbaseData}:${JSON.stringify(txOut)}:${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Creates a coinbase transaction for a given block height and reward amount
export const createCoinbaseTransaction = (
  blockHeight: number,
  minerAddress: string,
  minerPublicKey: string,
  rewardAmount: number,
  minerData?: string
): CoinbaseTransaction => {
  // Prepare coinbase data
  const normalizedMinerData = minerData?.slice(0, MAX_COINBASE_DATA_LENGTH) || '';
  const coinbaseData = JSON.stringify({
    blockHeight,
    minerData: normalizedMinerData
  });

  // Create the output containing the block reward
  const txOut: TxOut = {
    address: minerAddress,
    amount: rewardAmount,
    publicKey: minerPublicKey
  };

  const timestamp = Date.now();

  // Create the coinbase input
  const txIn: CoinbaseTxIn = {
    blockHeight,
    data: coinbaseData
  };

  // Calculate transaction ID
  const id = calculateCoinbaseTransactionId(blockHeight, coinbaseData, txOut, timestamp);

  // Return the complete coinbase transaction
  return {
    id,
    type: 'coinbase',
    txIn,
    txOut,
    timestamp
  };
};

// Validates the basic structure of a coinbase transaction
export const isCoinbaseTransaction = (tx: any): tx is CoinbaseTransaction => {
  return (
    tx &&
    tx.type === 'coinbase' &&
    typeof tx.id === 'string' &&
    typeof tx.txIn?.blockHeight === 'number' &&
    typeof tx.txIn?.data === 'string' &&
    typeof tx.txOut?.address === 'string' &&
    typeof tx.txOut?.amount === 'number' &&
    typeof tx.txOut?.publicKey === 'string' &&
    typeof tx.timestamp === 'number'
  );
};

// Utility function to extract the block height from a coinbase transaction
export const getCoinbaseBlockHeight = (tx: CoinbaseTransaction): number => {
  return tx.txIn.blockHeight;
};

// Utility function to extract miner data from a coinbase transaction
export const getCoinbaseMinerData = (tx: CoinbaseTransaction): string | undefined => {
  try {
    const data = JSON.parse(tx.txIn.data) as CoinbaseData;
    return data.minerData;
  } catch {
    return undefined;
  }
};
