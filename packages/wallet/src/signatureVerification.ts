import { verify } from './keyPair';
import { createWalletAddress } from './wallet';

/**
 * Verifies a transaction signature
 * 
 * @param data - The data that was signed
 * @param signature - The signature to verify
 * @param address - The wallet address
 * @param publicKeyInHex - The public key in hex format
 * @returns boolean - Whether the signature is valid
 */
export const verifySignature = (
  data: string,
  signature: string,
  address: string,
  publicKeyInHex: string
): boolean => {
  // First verify that the provided public key corresponds to the address
  const calculatedAddress = createWalletAddress(publicKeyInHex);
  if (calculatedAddress !== address) {
    console.error('Public key does not match address');
    return false;
  }
  
  // Then verify the signature against the data and public key
  return verify(data, signature, publicKeyInHex);
};

/**
 * Verifies a transaction input signature
 * 
 * This is a simpler version that will be called from the core package
 * It doesn't require direct access to cryptographic implementation
 * 
 * @param txId - The transaction ID
 * @param outputId - The referenced output ID
 * @param outputIndex - The referenced output index
 * @param amount - The amount being spent
 * @param signature - The signature to verify
 * @param publicKey - The public key to verify against
 * @returns boolean - Whether the signature is valid
 */
export const verifyTransactionInputSignature = (
  txId: string,
  outputId: string,
  outputIndex: number,
  amount: number,
  signature: string,
  publicKey: string
): boolean => {
  // Reconstruct the data that would have been signed
  const dataToVerify = txId + outputId + outputIndex + amount;
  
  // Generate the wallet address from the public key
  const address = createWalletAddress(publicKey);
  
  // Verify the signature
  return verifySignature(dataToVerify, signature, address, publicKey);
}; 