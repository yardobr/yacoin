/**
 * Transaction Verification Interfaces
 * 
 * This module defines interfaces for signature verification.
 * The actual implementation is provided by the wallet package.
 */

/**
 * Interface for transaction input signature verification
 */
export type SignatureVerifier = (
  txId: string,
  outputId: string,
  outputIndex: number,
  amount: number,
  signature: string,
  publicKey: string
) => boolean;

/**
 * Default implementation that always fails
 * This is used when no verifier is provided
 */
export const defaultVerifier: SignatureVerifier = (
  txId: string,
  outputId: string,
  outputIndex: number,
  amount: number,
  signature: string,
  publicKey: string
): boolean => {
  console.error('No signature verifier provided. Use setSignatureVerifier() to set one.');
  return false;
};

// The active verifier - initially set to the default
let currentVerifier: SignatureVerifier = defaultVerifier;

/**
 * Set the signature verifier implementation
 * This should be called by the wallet package
 */
export const setSignatureVerifier = (verifier: SignatureVerifier): void => {
  currentVerifier = verifier;
};

/**
 * Get the current signature verifier
 */
export const getSignatureVerifier = (): SignatureVerifier => {
  return currentVerifier;
}; 