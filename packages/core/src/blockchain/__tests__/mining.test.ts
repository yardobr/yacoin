import { mineBlock, calculateBlockReward } from '../mining';
import { Block } from '../../types/block';
import { getLatestBlock } from '../chain';
import { isCoinbaseTransaction } from '../../transaction/coinbase';

// Mock wallet data for testing
const MOCK_MINER_ADDRESS = 'test-miner-address';
const MOCK_MINER_PUBLIC_KEY = 'test-miner-public-key';
const TEST_DIFFICULTY = 1; // Low difficulty for faster tests

describe('Mining with rewards', () => {
  test('calculateBlockReward should follow Bitcoin halving schedule', () => {
    // Genesis block height (0) should return 0 rewards
    expect(calculateBlockReward(0)).toBe(0);
    
    // First proper block should return full reward (50)
    expect(calculateBlockReward(1)).toBe(50);
    
    // Right before first halving
    expect(calculateBlockReward(209999)).toBe(50);
    
    // At first halving
    expect(calculateBlockReward(210000)).toBe(25);
    
    // At second halving
    expect(calculateBlockReward(420000)).toBe(12.5);
    
    // At third halving
    expect(calculateBlockReward(630000)).toBe(6.25);
  });

  test('mineBlock should include a coinbase transaction with correct rewards', async () => {
    // Get latest (genesis) block for testing
    const latestBlock = getLatestBlock();
    const newIndex = latestBlock.index + 1;
    const minerData = 'Test mining reward';
    
    // Mine a new block
    const minedBlock = mineBlock(
      newIndex,
      latestBlock,
      [], // No regular transactions
      TEST_DIFFICULTY,
      MOCK_MINER_ADDRESS,
      MOCK_MINER_PUBLIC_KEY,
      minerData
    );
    
    // Check block structure
    expect(minedBlock).toBeDefined();
    expect(minedBlock.index).toBe(newIndex);
    expect(minedBlock.previousHash).toBe(latestBlock.hash);
    expect(minedBlock.difficulty).toBe(TEST_DIFFICULTY);
    
    // Check that transactions include a coinbase transaction
    expect(minedBlock.transactions.length).toBe(1); // Should only have coinbase tx
    
    // Check the coinbase transaction
    const tx = minedBlock.transactions[0];
    expect(isCoinbaseTransaction(tx)).toBe(true);
    
    if (isCoinbaseTransaction(tx)) {
      // Verify block height in coinbase txIn
      expect(tx.txIn.blockHeight).toBe(newIndex);
      
      // Verify reward amount
      const expectedReward = calculateBlockReward(newIndex);
      expect(tx.txOut.amount).toBe(expectedReward);
      
      // Verify recipient address
      expect(tx.txOut.address).toBe(MOCK_MINER_ADDRESS);
      
      // Verify the miner data is included
      expect(tx.txIn.data).toContain(minerData);
    }
  });

  test('mineBlock should include multiple transactions plus coinbase', async () => {
    // Get latest block for testing
    const latestBlock = getLatestBlock();
    const newIndex = latestBlock.index + 1;
    
    // Create some mock regular transactions
    const mockTransactions = [
      { id: 'tx1', type: 'regular', timestamp: Date.now() },
      { id: 'tx2', type: 'regular', timestamp: Date.now() }
    ] as any[];
    
    // Mine a new block with the mock transactions
    const minedBlock = mineBlock(
      newIndex,
      latestBlock,
      mockTransactions,
      TEST_DIFFICULTY,
      MOCK_MINER_ADDRESS,
      MOCK_MINER_PUBLIC_KEY
    );
    
    // Should have coinbase + regular transactions
    expect(minedBlock.transactions.length).toBe(mockTransactions.length + 1);
    
    // First transaction should be coinbase
    const firstTx = minedBlock.transactions[0];
    expect(isCoinbaseTransaction(firstTx)).toBe(true);
    
    // Check other transactions
    for (let i = 0; i < mockTransactions.length; i++) {
      // Use non-null assertion since we've verified the lengths match
      expect(minedBlock.transactions[i + 1]!.id).toBe(mockTransactions[i].id);
    }
  });
}); 