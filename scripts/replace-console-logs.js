#!/usr/bin/env node
/**
 * Script to replace console.* with logger.* and add logger import
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/api/analytics/popular/route.ts',
  'app/api/analytics/web-vitals/route.ts',
  'app/api/billing/webhooks/route.ts',
  'app/api/cron/check-saved-searches/route.ts',
  'app/api/import/bulk/route.ts',
  'app/web-vitals.tsx',
  'lib/data-import/importer.ts',
  'lib/data-import/bulk-import.ts',
];

function updateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if already has logger import
  const hasLoggerImport =
    content.includes("from '@/lib/logger'") || content.includes('from "@/lib/logger"');

  // Replace console.* with logger.*
  const hasConsole = /console\.(log|error|warn|info|debug)/.test(content);

  if (!hasConsole) {
    console.log(`Skipping ${filePath} - no console statements found`);
    return;
  }

  content = content.replace(/console\.log\(/g, 'logger.log(');
  content = content.replace(/console\.error\(/g, 'logger.error(');
  content = content.replace(/console\.warn\(/g, 'logger.warn(');
  content = content.replace(/console\.info\(/g, 'logger.info(');
  content = content.replace(/console\.debug\(/g, 'logger.debug(');

  // Add import if not present
  if (!hasLoggerImport) {
    // Find the last import statement
    const importRegex = /^import .+ from .+;$/gm;
    const imports = content.match(importRegex);

    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertPosition = lastImportIndex + lastImport.length;

      content =
        content.slice(0, insertPosition) +
        "\nimport { logger } from '@/lib/logger';" +
        content.slice(insertPosition);
    } else {
      // No imports found, add at the beginning
      content = "import { logger } from '@/lib/logger';\n\n" + content;
    }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated ${filePath}`);
}

console.log('Starting console.* replacement...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✅ All files updated!');
