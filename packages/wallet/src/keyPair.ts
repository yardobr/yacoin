import elliptic from 'elliptic';
import crypto from 'crypto';

// Initialize elliptic curve - we'll use secp256k1 (same as Bitcoin)
const ec = new elliptic.ec('secp256k1');

/**
 * Type definition for a key pair
 */
export type KeyPair = {
  privateKey: string;
  publicKey: string;
};

/**
 * Generates a new cryptographic key pair
 */
export const generateKeyPair = (): KeyPair => {
  // Generate a new key pair
  const keyPair = ec.genKeyPair();
  
  // Convert to hex strings
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');
  
  return {
    privateKey,
    publicKey
  };
};

/**
 * Get public key from private key
 */
export const getPublicKey = (privateKey: string): string => {
  const keyPair = ec.keyFromPrivate(privateKey);
  return keyPair.getPublic('hex');
};

/**
 * Signs data with a private key
 */
export const sign = (data: string, privateKey: string): string => {
  const keyPair = ec.keyFromPrivate(privateKey);
  const hash = crypto.createHash('sha256').update(data).digest();
  const signature = keyPair.sign(hash);
  return signature.toDER('hex');
};

/**
 * Verifies a signature using public key
 */
export const verify = (data: string, signature: string, publicKey: string): boolean => {
  try {
    const keyPair = ec.keyFromPublic(publicKey, 'hex');
    const hash = crypto.createHash('sha256').update(data).digest();
    return keyPair.verify(hash, signature);
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}; 