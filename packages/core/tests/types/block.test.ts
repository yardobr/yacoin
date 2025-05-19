import { Block } from '../../src/types/block';

describe('Block Type', () => {
  test('Block type should have all required properties', () => {
    // Test object matching the Block type definition
    const block: Block = {
      index: 0,
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: 1631347588962,
      transactions: [],
      hash: '0x123456789abcdef',
      nonce: 12345,
      difficulty: 4
    };

    // Verify object has expected properties
    expect(block).toHaveProperty('index');
    expect(block).toHaveProperty('previousHash');
    expect(block).toHaveProperty('timestamp');
    expect(block).toHaveProperty('transactions');
    expect(block).toHaveProperty('hash');
    expect(block).toHaveProperty('nonce');
    expect(block).toHaveProperty('difficulty');

    // Verify types
    expect(typeof block.index).toBe('number');
    expect(typeof block.previousHash).toBe('string');
    expect(typeof block.timestamp).toBe('number');
    expect(Array.isArray(block.transactions)).toBe(true);
    expect(typeof block.hash).toBe('string');
    expect(typeof block.nonce).toBe('number');
    expect(typeof block.difficulty).toBe('number');
  });

  test('Block should accept valid transactions array', () => {
    const block: Block = {
      index: 1,
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: 1631347588962,
      transactions: [
        {
          id: 'tx123',
          timestamp: 1631347588900,
          type: 'regular',
          txIns: [
            {
              txOutId: 'prevTx1',
              txOutIndex: 0,
              signature: 'sig123'
            }
          ],
          txOuts: [
            {
              address: 'addr1',
              amount: 50,
              publicKey: 'pubKey1'
            }
          ]
        }
      ],
      hash: '0x123456789abcdef',
      nonce: 12345,
      difficulty: 4
    };

    expect(block.transactions).toHaveLength(1);
    expect(block.transactions[0]).toHaveProperty('id');
    expect(block.transactions[0]).toHaveProperty('txIns');
    expect(block.transactions[0]).toHaveProperty('txOuts');
  });
}); 