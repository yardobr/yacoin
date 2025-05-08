/**
 * YaCoin Wallet Integration Example
 * 
 * This example demonstrates:
 * 1. Creating a wallet
 * 2. Creating a transaction with real cryptographic signatures
 * 3. Verifying transaction signatures
 */

// Import wallet first to ensure its signature verifier is registered
import { createWallet, sign, verify, createTransaction } from '../wallet/src/index';
import { verifyTransactionInputSignature } from '../wallet/src/signatureVerification';

// Then import from core
import { UnspentOutput, TransactionData } from '../core/src/transaction/transactionUtils';

// Create wallets
console.log('Creating wallets...');
const alice = createWallet();
const bob = createWallet();

console.log(`Alice's address: ${alice.address}`);
console.log(`Bob's address: ${bob.address}`);

// Create some fake UTXOs for Alice
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

// Create a transaction from Alice to Bob
console.log('\nCreating transaction from Alice to Bob...');

const transaction = createTransaction(
  alice,           // Sender's wallet
  bob.address,     // Recipient's address
  bob.keyPair.publicKey, // Recipient's public key
  75,              // Amount to send
  aliceUtxos       // Available UTXOs
);

if (!transaction) {
  console.error('Failed to create transaction');
  process.exit(1);
}

console.log(`Transaction created: ${transaction.id}`);
console.log(`Inputs: ${transaction.inputs.length}`);
console.log(`Outputs: ${transaction.outputs.length}`);
console.log(`Output 1: ${transaction.outputs[0].amount} coins to ${transaction.outputs[0].address}`);
if (transaction.outputs.length > 1) {
  console.log(`Output 2 (change): ${transaction.outputs[1].amount} coins to ${transaction.outputs[1].address}`);
}

// Verify the transaction signatures
console.log('\nVerifying transaction signatures...');
let allSignaturesValid = true;

for (let i = 0; i < transaction.inputs.length; i++) {
  const input = transaction.inputs[i];
  const utxo = aliceUtxos.find(
    u => u.transactionOutputId === input.transactionOutputId && u.outputIndex === input.outputIndex
  );
  
  if (!utxo) {
    console.error(`UTXO not found for input ${i}`);
    continue;
  }
  
  // Reconstructing the data that was signed
  const dataToVerify = transaction.id + utxo.transactionOutputId + utxo.outputIndex + utxo.amount;
  
  // Verify using the wallet's verification function
  const isValid = verify(
    dataToVerify,
    input.signature,
    alice.keyPair.publicKey
  );
  
  // Also try the higher-level verification function
  const isValidHighLevel = verifyTransactionInputSignature(
    transaction.id,
    utxo.transactionOutputId,
    utxo.outputIndex,
    utxo.amount,
    input.signature,
    alice.keyPair.publicKey
  );
  
  console.log(`Signature ${i+1}: ${isValid ? 'VALID' : 'INVALID'}`);
  console.log(`High-level verification ${i+1}: ${isValidHighLevel ? 'VALID' : 'INVALID'}`);
  
  if (!isValid || !isValidHighLevel) {
    allSignaturesValid = false;
  }
}

console.log(`\nTransaction verification: ${allSignaturesValid ? 'SUCCESS' : 'FAILED'}`);

// Try an invalid signature
console.log('\nTesting with an invalid signature...');
const fakeSignature = sign('fake-data', alice.keyPair.privateKey);
const realData = transaction.id + aliceUtxos[0].transactionOutputId + aliceUtxos[0].outputIndex + aliceUtxos[0].amount;

const isValidFake = verify(
  realData,
  fakeSignature,
  alice.keyPair.publicKey
);

console.log(`Invalid signature test: ${!isValidFake ? 'SUCCESS (correctly identified as invalid)' : 'FAILED (incorrectly identified as valid)'}`);

console.log('\nDemo complete!'); 