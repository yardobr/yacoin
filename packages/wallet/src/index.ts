/**
 * YaCoin Wallet Module Exports
 */

export * from './wallet';
export * from './keyPair';
export * from './signatureVerification';

// Import the core verification interface
import { verifyTransactionInputSignature } from './signatureVerification';
import { setSignatureVerifier } from '@yacoin/core/src/transaction';

// Register our signature verification function with the core
setSignatureVerifier(verifyTransactionInputSignature); 