// Direct TypeScript execution for bulk import
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { executeBulkImport } from '../lib/data-import/bulk-import';

console.log('🚀 Starting bulk import from CLI');
console.log('Target: 80,000+ affiliate programs across 5 networks\n');

executeBulkImport()
  .then((summary) => {
    console.log('\n✅ IMPORT COMPLETE!');
    console.log(`\nC1 Constraint (Data Starvation) - RESOLVED`);
    console.log(`Programs before: 4`);
    console.log(`Programs after: ${summary.totalPrograms}`);
    console.log(`Leverage achieved: ${Math.floor(summary.totalPrograms / 4)}x`);
    console.log(`Duration: ${(summary.duration / 1000 / 60).toFixed(2)} minutes`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
