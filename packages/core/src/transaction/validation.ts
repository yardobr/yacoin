import { Transaction, TransactionInput, TransactionOutput, UnspentOutput } from './transactionUtils';

// This import will need to be added later when the wallet package is built
// import { verifyTransactionInputSignature } from '@yacoin/wallet';

// UTXOSet: Array of all currently unspent outputs
export type UTXOSet = UnspentOutput[];

// Basic structure for transaction validation

const validateInputStructure = (input: TransactionInput, index: number): boolean => {
  if (!input) {
    console.error(`Validation Error: Input at index ${index} is missing.`);
    return false;
  }
  if (typeof input.transactionOutputId !== 'string' || input.transactionOutputId.length === 0) {
    console.error(`Validation Error: transactionOutputId in input ${index} must be a non-empty string.`);
    return false;
  }
  if (typeof input.outputIndex !== 'number' || input.outputIndex < 0) {
    console.error(`Validation Error: outputIndex in input ${index} must be a non-negative number.`);
    return false;
  }
  if (typeof input.signature !== 'string' || input.signature.length === 0) {
    console.error(`Validation Error: signature in input ${index} must be a non-empty string.`);
    return false;
  }
  return true;
};

const validateOutputStructure = (output: TransactionOutput, index: number): boolean => {
  if (!output) {
    console.error(`Validation Error: Output at index ${index} is missing.`);
    return false;
  }
  if (typeof output.address !== 'string' || output.address.length === 0) {
    console.error(`Validation Error: address in output ${index} must be a non-empty string.`);
    return false;
  }
  if (typeof output.amount !== 'number' || output.amount <= 0) {
    // Consider allowing 0 amount outputs? For now, require positive.
    console.error(`Validation Error: amount in output ${index} must be a positive number.`);
    return false;
  }
  return true;
};

export const validateTransactionStructure = (transaction: Transaction): boolean => {
  if (!transaction) {
    console.error('Validation Error: Transaction object is missing.');
    return false;
  }

  const { id, inputs, outputs, timestamp } = transaction;

  if (typeof id !== 'string' || id.length === 0) {
    console.error('Validation Error: Transaction ID must be a non-empty string.');
    return false;
  }

  if (typeof timestamp !== 'number' || timestamp <= 0) {
    console.error('Validation Error: Transaction timestamp must be a positive number.');
    return false;
  }

  if (!Array.isArray(inputs)) {
    console.error('Validation Error: Transaction inputs must be an array.');
    return false;
  }

  if (!Array.isArray(outputs)) {
    console.error('Validation Error: Transaction outputs must be an array.');
    return false;
  }

  // Validate structure of each input
  let inputIndex = 0;
  for (const input of inputs) {
    if (!validateInputStructure(input, inputIndex)) {
      return false;
    }
    inputIndex++;
  }

  // Validate structure of each output
  let outputIndex = 0;
  for (const output of outputs) {
    if (!validateOutputStructure(output, outputIndex)) {
      return false;
    }
    outputIndex++;
  }

  return true;
};

// Temporary signature verification - will be replaced with real wallet verification
const verifySignature = (input: TransactionInput, utxo: UnspentOutput, transaction: Transaction): boolean => {
  // TODO: Replace with real cryptographic signature verification from @yacoin/wallet
  // Once the wallet package is built, uncomment the import and use:
  // return verifyTransactionInputSignature(
  //   transaction.id,
  //   input.transactionOutputId,
  //   input.outputIndex,
  //   utxo.amount,
  //   input.signature,
  //   utxo.address  // In the real implementation, we'd need to store public keys with UTXOs
  // );
  
  // For now, just check the signature is a non-empty string
  return typeof input.signature === 'string' && input.signature.length > 0;
};

export const validateTransactionSemantics = (
  transaction: Transaction,
  utxoSet: UTXOSet
): boolean => {
  // 1. All referenced UTXOs exist and are unspent
  const referencedUtxos: UnspentOutput[] = [];
  for (const input of transaction.inputs) {
    const utxo = utxoSet.find(
      u => u.transactionOutputId === input.transactionOutputId && u.outputIndex === input.outputIndex
    );
    if (!utxo) {
      console.error(`Semantic Validation Error: Referenced UTXO ${input.transactionOutputId}:${input.outputIndex} does not exist or is already spent.`);
      return false;
    }
    referencedUtxos.push(utxo);
  }

  // 2. No double-spending within the transaction
  const seenUtxoKeys = new Set<string>();
  for (const input of transaction.inputs) {
    const key = `${input.transactionOutputId}:${input.outputIndex}`;
    if (seenUtxoKeys.has(key)) {
      console.error(`Semantic Validation Error: Double-spending detected for UTXO ${key} within transaction.`);
      return false;
    }
    seenUtxoKeys.add(key);
  }

  // 3. The signatures on all inputs are valid (placeholder)
  for (let i = 0; i < transaction.inputs.length; i++) {
    const input = transaction.inputs[i];
    const utxo = referencedUtxos[i];
    if (!input || !utxo) {
      // This should not happen, but add a guard for type safety
      console.error(`Semantic Validation Error: Referenced input or UTXO for input ${i} is undefined.`);
      return false;
    }
    if (!verifySignature(input, utxo, transaction)) {
      console.error(`Semantic Validation Error: Invalid signature for input ${i} (UTXO ${utxo.transactionOutputId}:${utxo.outputIndex}).`);
      return false;
    }
  }

  // 4. The sum of input amounts >= sum of output amounts
  const totalInput = referencedUtxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  const totalOutput = transaction.outputs.reduce((sum, output) => sum + output.amount, 0);
  if (totalInput < totalOutput) {
    console.error(`Semantic Validation Error: Input sum (${totalInput}) is less than output sum (${totalOutput}).`);
    return false;
  }

  // 5. All output amounts are positive (already checked in structure, but double-check here)
  for (const output of transaction.outputs) {
    if (output.amount <= 0) {
      console.error('Semantic Validation Error: Output amount must be positive.');
      return false;
    }
  }

  return true;
}; 