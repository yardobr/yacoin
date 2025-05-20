import { runAllDemos } from './index';

// Execute all demos
runAllDemos().catch(error => {
  console.error('Error running demos:', error);
  process.exit(1);
}); 