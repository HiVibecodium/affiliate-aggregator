// Simple bulk import execution script (ES Module)
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

// Dynamic import to ensure env vars are loaded first
const { executeBulkImport } = await import('../lib/data-import/bulk-import.ts');

console.log('🚀 Starting bulk import from CLI');
console.log('Target: 80,000+ affiliate programs across 5 networks\\n');

try {
  const summary = await executeBulkImport();

  console.log('\\n✅ IMPORT COMPLETE!');
  console.log(`\\nC1 Constraint (Data Starvation) - RESOLVED`);
  console.log(`Programs before: 4`);
  console.log(`Programs after: ${summary.totalPrograms}`);
  console.log(`Leverage achieved: ${Math.floor(summary.totalPrograms / 4)}x`);
  console.log(`Duration: ${(summary.duration / 1000 / 60).toFixed(2)} minutes`);

  process.exit(0);
} catch (error) {
  console.error('\\n❌ Import failed:', error);
  process.exit(1);
}
