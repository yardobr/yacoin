import crypto from 'crypto';

// Basic structure for transaction creation

export type TransactionInput = {
  transactionOutputId: string; // Reference to the transaction containing the UTXO
  outputIndex: number; // Index of the specific UTXO in the referenced transaction
  signature: string; // Proof that the owner authorized this spend
};

export type TransactionOutput = {
  address: string; // Address of the recipient
  amount: number; // Amount of coins
  publicKey: string; // Public key corresponding to the address
};

export type TransactionData = {
  id: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  timestamp: number;
};

// Rename the type alias to avoid conflicts with the imported type
type Transaction = TransactionData;

// Represents an Unspent Transaction Output available to be used as input
export type UnspentOutput = {
  transactionOutputId: string; // ID of the transaction where this output exists
  outputIndex: number; // Index of this output in that transaction
  address: string; // Address that owns this output
  amount: number; // Amount of coins in this output
  publicKey: string; // Public key corresponding to the address (for signature verification)
};

// Type for transaction data before ID calculation and signing
type UnsignedTransactionData = {
    inputs: Omit<TransactionInput, 'signature'>[];
    outputs: TransactionOutput[];
    timestamp: number;
};

// Placeholder function for transaction ID generation
const calculateTransactionId = (transactionData: UnsignedTransactionData): string => {
  const data = JSON.stringify(transactionData.inputs) +
               JSON.stringify(transactionData.outputs) +
               transactionData.timestamp;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Placeholder for signing - replace with actual crypto logic later
const signInput = (transaction: TransactionData, inputIndex: number, privateKey: string, utxo: UnspentOutput): string => {
  // In reality, you'd sign a hash of the relevant transaction data
  console.log(`Signing input ${inputIndex} for tx ${transaction.id} with key ${privateKey} for UTXO ${utxo.transactionOutputId}:${utxo.outputIndex}`);
  return `signed_placeholder_${inputIndex}`;
}

export const createTransaction = (
  recipientAddress: string,
  amount: number,
  senderUtxos: UnspentOutput[],
  senderPrivateKey: string, // Placeholder - Replace with actual key type
  senderAddress: string,
  senderPublicKey: string,
  recipientPublicKey: string
): TransactionData | null => {

  const totalInputAmount = senderUtxos.reduce((sum, utxo) => sum + utxo.amount, 0);

  if (totalInputAmount < amount) {
    console.error('Error: Insufficient funds from provided UTXOs.');
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
      address: senderAddress, 
      amount: changeAmount,
      publicKey: senderPublicKey 
    });
  }

  const timestamp = Date.now();

  // Create the unsigned inputs structure
  const unsignedInputs: Omit<TransactionInput, 'signature'>[] = senderUtxos.map(utxo => ({
    transactionOutputId: utxo.transactionOutputId,
    outputIndex: utxo.outputIndex,
  }));

  // Create transaction data object for ID calculation
  const unsignedTransactionData: UnsignedTransactionData = {
      inputs: unsignedInputs,
      outputs,
      timestamp,
  };
  const txId = calculateTransactionId(unsignedTransactionData);

  // Now create the final inputs with signatures
  const inputs: TransactionInput[] = [];
  const finalTransactionForSigning: TransactionData = { // Need full tx structure for signing context
    id: txId,
    inputs: [], // Will be populated below
    outputs,
    timestamp
  };

  let inputIndex = 0;
  for (const utxo of senderUtxos) {
      const signature = signInput(finalTransactionForSigning, inputIndex, senderPrivateKey, utxo);
      inputs.push({
          transactionOutputId: utxo.transactionOutputId,
          outputIndex: utxo.outputIndex,
          signature: signature,
      });
      inputIndex++;
  }
  finalTransactionForSigning.inputs = inputs; // Add signed inputs to the tx object used in signing

  return {
    id: txId,
    inputs,
    outputs,
    timestamp,
  };
}; 