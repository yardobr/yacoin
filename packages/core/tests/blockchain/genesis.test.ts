import { createGenesisBlock } from '../../src/blockchain/genesis';
import { calculateBlockHash } from '../../src/blockchain/blockUtils';

describe('Genesis Block', () => {
  test('createGenesisBlock should return a valid block', () => {
    const genesisBlock = createGenesisBlock();

    // Verify the block has all required properties
    expect(genesisBlock).toHaveProperty('index');
    expect(genesisBlock).toHaveProperty('previousHash');
    expect(genesisBlock).toHaveProperty('timestamp');
    expect(genesisBlock).toHaveProperty('transactions');
    expect(genesisBlock).toHaveProperty('hash');
    expect(genesisBlock).toHaveProperty('nonce');
    expect(genesisBlock).toHaveProperty('difficulty');

    // Check specific genesis block properties
    expect(genesisBlock.index).toBe(0);
    expect(genesisBlock.previousHash).toBe('0'.repeat(64));
    expect(genesisBlock.nonce).toBe(0);
    expect(genesisBlock.difficulty).toBe(1);
    expect(Array.isArray(genesisBlock.transactions)).toBe(true);
    expect(genesisBlock.transactions.length).toBe(0);
  });

  test('Genesis block hash should be valid', () => {
    const genesisBlock = createGenesisBlock();

    // Calculate the hash manually to verify it matches the stored hash
    const calculatedHash = calculateBlockHash(
      genesisBlock.index,
      genesisBlock.previousHash,
      genesisBlock.timestamp,
      genesisBlock.transactions,
      genesisBlock.nonce,
      genesisBlock.difficulty
    );

    expect(genesisBlock.hash).toBe(calculatedHash);
    expect(genesisBlock.hash).toMatch(/^[0-9a-f]{64}$/); // Valid SHA256 hash
  });

  test('Genesis block should have consistent hash on each call', () => {
    // In this implementation, genesis blocks created close in time should have
    // the same properties except for timestamp
    
    // Mock Date.now() for consistent tests
    const originalDateNow = Date.now;
    const fixedTime = 1631347588000;
    global.Date.now = function() { return fixedTime; };

    try {
      const genesisBlock1 = createGenesisBlock();
      const genesisBlock2 = createGenesisBlock();

      // The blocks should have the same properties with fixed time
      expect(genesisBlock1.index).toBe(genesisBlock2.index);
      expect(genesisBlock1.previousHash).toBe(genesisBlock2.previousHash);
      expect(genesisBlock1.timestamp).toBe(genesisBlock2.timestamp);
      expect(genesisBlock1.nonce).toBe(genesisBlock2.nonce);
      expect(genesisBlock1.difficulty).toBe(genesisBlock2.difficulty);
      
      // With fixed timestamp, the hash should also be the same
      expect(genesisBlock1.hash).toBe(genesisBlock2.hash);
    } finally {
      // Restore the original Date.now
      global.Date.now = originalDateNow;
    }
  });
}); 