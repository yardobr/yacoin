import crypto from 'crypto';
import { KeyPair, generateKeyPair, sign } from './keyPair';
import { 
  TransactionData, 
  TransactionInput, 
  TransactionOutput,
  UnspentOutput
} from '@yacoin/core/src/transaction/transactionUtils';

/**
 * Type definition for a wallet
 */
export type Wallet = {
  address: string;
  keyPair: KeyPair;
};

/**
 * Creates a wallet address from public key
 * Using RIPEMD-160 of SHA-256 hash of the public key (similar to Bitcoin)
 */
export const createWalletAddress = (publicKey: string): string => {
  // First hash with SHA-256
  const publicKeyHash = crypto.createHash('sha256').update(publicKey).digest();
  
  // Then hash with RIPEMD-160
  return crypto.createHash('ripemd160').update(publicKeyHash).digest('hex');
};

/**
 * Creates a new wallet with key pair and address
 */
export const createWallet = (): Wallet => {
  const keyPair = generateKeyPair();
  const address = createWalletAddress(keyPair.publicKey);
  
  return {
    address,
    keyPair
  };
};

/**
 * Creates a transaction using the wallet's key pair
 */
export const createTransaction = (
  wallet: Wallet,
  recipientAddress: string,
  recipientPublicKey: string,
  amount: number,
  availableUtxos: UnspentOutput[]
): TransactionData | null => {
  
  // Find sufficient UTXOs that belong to this wallet
  const senderUtxos = availableUtxos.filter(utxo => utxo.address === wallet.address);
  
  const totalInputAmount = senderUtxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  
  if (totalInputAmount < amount) {
    console.error('Error: Insufficient funds in wallet.');
    return null;
  }
  
  const outputs: TransactionOutput[] = [];
  
  // Output for the recipient
  outputs.push({ 
    address: recipientAddress, 
    amount,
    publicKey: recipientPublicKey
  });
  
  // Output for change (if any)
  const changeAmount = totalInputAmount - amount;
  if (changeAmount > 0) {
    outputs.push({ 
      address: wallet.address, 
      amount: changeAmount,
      publicKey: wallet.keyPair.publicKey
    });
  }
  
  const timestamp = Date.now();
  
  // Create the unsigned transaction structure
  const txToSign = {
    inputs: senderUtxos.map(utxo => ({
      transactionOutputId: utxo.transactionOutputId,
      outputIndex: utxo.outputIndex,
    })),
    outputs,
    timestamp,
  };
  
  // Calculate transaction ID
  const txDataString = JSON.stringify(txToSign.inputs) +
                     JSON.stringify(txToSign.outputs) +
                     txToSign.timestamp;
  const txId = crypto.createHash('sha256').update(txDataString).digest('hex');
  
  // Sign each input
  const inputs: TransactionInput[] = senderUtxos.map((utxo, index) => {
    // Data to sign: txId + output reference + output amount
    const dataToSign = txId + utxo.transactionOutputId + utxo.outputIndex + utxo.amount;
    const signature = sign(dataToSign, wallet.keyPair.privateKey);
    
    return {
      transactionOutputId: utxo.transactionOutputId,
      outputIndex: utxo.outputIndex,
      signature
    };
  });
  
  return {
    id: txId,
    inputs,
    outputs,
    timestamp
  };
}; 