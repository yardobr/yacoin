import { Transaction, RegularTransaction } from '../../src/types/transactions';
import { CoinbaseTransaction } from '../../src/types/coinbase';
import { TxIn, TxOut } from '../../src/types/common';

describe('Transaction Types', () => {
  test('Regular Transaction should have all required properties', () => {
    const regularTx: RegularTransaction = {
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
    };

    // Verify object has expected properties
    expect(regularTx).toHaveProperty('id');
    expect(regularTx).toHaveProperty('timestamp');
    expect(regularTx).toHaveProperty('type');
    expect(regularTx).toHaveProperty('txIns');
    expect(regularTx).toHaveProperty('txOuts');

    // Verify types
    expect(typeof regularTx.id).toBe('string');
    expect(typeof regularTx.timestamp).toBe('number');
    expect(regularTx.type).toBe('regular');
    expect(Array.isArray(regularTx.txIns)).toBe(true);
    expect(Array.isArray(regularTx.txOuts)).toBe(true);
  });

  test('Coinbase Transaction should have all required properties', () => {
    const coinbaseTx: CoinbaseTransaction = {
      id: 'coinbase123',
      timestamp: 1631347588900,
      type: 'coinbase',
      txIn: {
        blockHeight: 1,
        data: 'miner data'
      },
      txOut: {
        address: 'minerAddr',
        amount: 50,
        publicKey: 'minerPubKey'
      }
    };

    // Verify object has expected properties
    expect(coinbaseTx).toHaveProperty('id');
    expect(coinbaseTx).toHaveProperty('timestamp');
    expect(coinbaseTx).toHaveProperty('type');
    expect(coinbaseTx).toHaveProperty('txIn');
    expect(coinbaseTx).toHaveProperty('txOut');

    // Verify types
    expect(typeof coinbaseTx.id).toBe('string');
    expect(typeof coinbaseTx.timestamp).toBe('number');
    expect(coinbaseTx.type).toBe('coinbase');
    expect(typeof coinbaseTx.txIn).toBe('object');
    expect(typeof coinbaseTx.txOut).toBe('object');
    expect(typeof coinbaseTx.txIn.blockHeight).toBe('number');
  });

  test('Transaction union type should accept both transaction types', () => {
    const regularTx: Transaction = {
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
    };

    const coinbaseTx: Transaction = {
      id: 'coinbase123',
      timestamp: 1631347588900,
      type: 'coinbase',
      txIn: {
        blockHeight: 1,
        data: 'miner data'
      },
      txOut: {
        address: 'minerAddr',
        amount: 50,
        publicKey: 'minerPubKey'
      }
    };

    // Verify both types can be assigned to the Transaction union type
    expect(regularTx.type).toBe('regular');
    expect(coinbaseTx.type).toBe('coinbase');
  });

  test('TxIn type should have all required properties', () => {
    const txIn: TxIn = {
      txOutId: 'prevTx1',
      txOutIndex: 0,
      signature: 'sig123'
    };

    expect(txIn).toHaveProperty('txOutId');
    expect(txIn).toHaveProperty('txOutIndex');
    expect(txIn).toHaveProperty('signature');
    
    expect(typeof txIn.txOutId).toBe('string');
    expect(typeof txIn.txOutIndex).toBe('number');
    expect(typeof txIn.signature).toBe('string');
  });

  test('TxOut type should have all required properties', () => {
    const txOut: TxOut = {
      address: 'addr1',
      amount: 50,
      publicKey: 'pubKey1'
    };

    expect(txOut).toHaveProperty('address');
    expect(txOut).toHaveProperty('amount');
    expect(txOut).toHaveProperty('publicKey');
    
    expect(typeof txOut.address).toBe('string');
    expect(typeof txOut.amount).toBe('number');
    expect(typeof txOut.publicKey).toBe('string');
  });
}); 