import { calculateBlockHash, calculateHashForBlock } from '../../src/blockchain/blockUtils';
import { Block } from '../../src/types/block';

describe('Block Utilities', () => {
  // Test data for a simple block
  const testBlock: Block = {
    index: 1,
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: 1631347588962,
    transactions: [],
    hash: '', // Will be calculated and verified
    nonce: 12345,
    difficulty: 4
  };

  test('calculateBlockHash should produce a valid SHA256 hash', () => {
    const hash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    // Check that the hash is a valid hex string of correct length (SHA256)
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('calculateBlockHash should produce deterministic results', () => {
    const hash1 = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    const hash2 = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    // Multiple calls with same input should yield same hash
    expect(hash1).toBe(hash2);
  });

  test('calculateBlockHash should change when any parameter changes', () => {
    // Reference hash with original values
    const originalHash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    // Test changing each parameter one by one
    const indexHash = calculateBlockHash(
      testBlock.index + 1, // Changed value
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    const prevHashChanged = calculateBlockHash(
      testBlock.index,
      'different_previous_hash', // Changed value
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    const timestampHash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp + 1, // Changed value
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    const nonceHash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce + 1, // Changed value
      testBlock.difficulty
    );

    const difficultyHash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty + 1 // Changed value
    );

    // Each hash should be different from the original
    expect(indexHash).not.toBe(originalHash);
    expect(prevHashChanged).not.toBe(originalHash);
    expect(timestampHash).not.toBe(originalHash);
    expect(nonceHash).not.toBe(originalHash);
    expect(difficultyHash).not.toBe(originalHash);
  });

  test('calculateHashForBlock should produce same hash as calculateBlockHash', () => {
    const directHash = calculateBlockHash(
      testBlock.index,
      testBlock.previousHash,
      testBlock.timestamp,
      testBlock.transactions,
      testBlock.nonce,
      testBlock.difficulty
    );

    const blockHash = calculateHashForBlock(testBlock);

    // Both functions should produce the same hash for equivalent inputs
    expect(blockHash).toBe(directHash);
  });
}); 