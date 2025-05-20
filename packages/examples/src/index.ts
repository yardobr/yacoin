// Export all demo modules
export * from './mining-reward-demo';
export * from './coinbase-demo';
export * from './wallet-integration';
export * from './transaction-pool-demo';

// Demo runner function
export const runAllDemos = async () => {
  console.log('Running all YaCoin demos sequentially...\n');
  
  console.log('=== WALLET INTEGRATION DEMO ===');
  await import('./wallet-integration');
  
  console.log('\n=== TRANSACTION POOL DEMO ===');
  await import('./transaction-pool-demo');
  
  console.log('\n=== COINBASE DEMO ===');
  await import('./coinbase-demo');
  
  console.log('\n=== MINING REWARD DEMO ===');
  await import('./mining-reward-demo');
  
  console.log('\nAll demos completed.');
}; 