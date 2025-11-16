const fs = require('fs');

const file = 'app/api/programs/route.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add since parameter extraction (after minRating)
const paramSection = content.indexOf("const minRating = searchParams.get('minRating');");
if (paramSection > 0) {
  const insertPos = content.indexOf('\n', paramSection) + 1;
  const indent = '    ';
  const newLine =
    indent +
    'const since = searchParams.get(\'since\'); // Number of days (e.g., "7" for last 7 days)\n';

  if (!content.includes("const since = searchParams.get('since')")) {
    content = content.slice(0, insertPos) + newLine + content.slice(insertPos);
    console.log('✅ Added since parameter extraction');
  }
}

// 2. Add date filtering logic (after minCookieDuration check)
const cookieCheck = content.indexOf('if (minCookieDuration) {');
if (cookieCheck > 0) {
  // Find the end of this if block
  let pos = cookieCheck;
  let braceCount = 0;
  let started = false;

  while (pos < content.length) {
    if (content[pos] === '{') {
      braceCount++;
      started = true;
    }
    if (content[pos] === '}') {
      braceCount--;
      if (started && braceCount === 0) {
        pos++;
        break;
      }
    }
    pos++;
  }

  // Insert after the closing brace
  const insertPos = content.indexOf('\n', pos) + 1;
  const dateFilter = `
  // Date filter for "New Programs" page
  if (since) {
    const daysAgo = parseInt(since);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysAgo);

    where.createdAt = {
      gte: sinceDate,
    };
  }
`;

  if (!content.includes('Date filter for "New Programs"')) {
    content = content.slice(0, insertPos) + dateFilter + content.slice(insertPos);
    console.log('✅ Added date filtering logic');
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ File updated successfully!');
