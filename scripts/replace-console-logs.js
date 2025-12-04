#!/usr/bin/env node
/**
 * Script to replace console.log/error with structured logger
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

// Statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  consoleLogs: 0,
  consoleErrors: 0,
  consoleWarns: 0,
  consoleInfos: 0,
};

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'build', 'tests', '__tests__'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (!file.includes('.test.') && !file.includes('.spec.')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function needsLoggerImport(content) {
  return (
    (content.includes('console.log') ||
      content.includes('console.error') ||
      content.includes('console.warn') ||
      content.includes('console.info')) &&
    !content.includes("from '@/lib/logger'")
  );
}

function addLoggerImport(content) {
  const lines = content.split('\n');
  const importLine = "import { logger } from '@/lib/logger';";

  if (content.includes(importLine)) {
    return content;
  }

  let insertIndex = 0;

  // Skip directives
  if (lines[0] && (lines[0].includes("'use client'") || lines[0].includes("'use server'"))) {
    insertIndex = 1;
    // Add blank line after directive
    if (insertIndex < lines.length && lines[insertIndex].trim() !== '') {
      lines.splice(insertIndex, 0, '');
      insertIndex++;
    }
  }

  // Skip to end of import block
  while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('import')) {
    insertIndex++;
  }

  lines.splice(insertIndex, 0, importLine);
  return lines.join('\n');
}

function replaceConsoleLogs(content, filePath) {
  let modified = content;
  let changeCount = 0;

  const replacements = [
    { pattern: /console\.log\(/g, replacement: 'logger.debug(', stat: 'consoleLogs' },
    { pattern: /console\.error\(/g, replacement: 'logger.error(', stat: 'consoleErrors' },
    { pattern: /console\.warn\(/g, replacement: 'logger.warn(', stat: 'consoleWarns' },
    { pattern: /console\.info\(/g, replacement: 'logger.info(', stat: 'consoleInfos' },
  ];

  for (const { pattern, replacement, stat } of replacements) {
    const matches = content.match(pattern);
    if (matches) {
      modified = modified.replace(pattern, replacement);
      stats[stat] += matches.length;
      changeCount += matches.length;
    }
  }

  if (changeCount > 0) {
    console.log(`  ✓ ${path.relative(process.cwd(), filePath)}: ${changeCount} replacements`);
  }

  return modified;
}

function processFile(filePath) {
  try {
    stats.filesScanned++;

    const content = fs.readFileSync(filePath, 'utf8');

    if (!needsLoggerImport(content)) {
      return;
    }

    let modified = replaceConsoleLogs(content, filePath);

    if (modified !== content) {
      modified = addLoggerImport(modified);
      stats.filesModified++;

      if (!isDryRun) {
        fs.writeFileSync(filePath, modified, 'utf8');
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔍 Replacing console.log with structured logger...\n');

  if (isDryRun) {
    console.log('📋 DRY RUN MODE - No files will be modified\n');
  }

  try {
    const dirs = ['app', 'lib', 'components'];
    const files = [];

    dirs.forEach((dir) => {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        findFiles(dirPath, files);
      }
    });

    console.log(`Found ${files.length} files to scan\n`);

    files.forEach((file) => processFile(file));

    console.log('\n📊 Summary:');
    console.log(`  Files scanned: ${stats.filesScanned}`);
    console.log(`  Files modified: ${stats.filesModified}`);
    console.log(`  console.log → logger.debug: ${stats.consoleLogs}`);
    console.log(`  console.error → logger.error: ${stats.consoleErrors}`);
    console.log(`  console.warn → logger.warn: ${stats.consoleWarns}`);
    console.log(`  console.info → logger.info: ${stats.consoleInfos}`);

    if (isDryRun) {
      console.log('\n💡 Run without --dry-run to apply changes');
    } else if (stats.filesModified > 0) {
      console.log('\n✅ Done! Please review changes and run tests.');
    } else {
      console.log('\n✨ No changes needed!');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
