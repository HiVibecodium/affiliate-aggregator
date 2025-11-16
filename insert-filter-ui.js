const fs = require('fs');

const pageFile = 'app/programs/page.tsx';
const uiFile = 'NEW_FILTERS_UI_BLOCK.tsx';

let content = fs.readFileSync(pageFile, 'utf8');
const uiBlock = fs.readFileSync(uiFile, 'utf8');

// Find the marker
const marker = '              </div>\n\n              {/* Quick stats */}';

// Extract only the filter blocks (skip first line comment and last line)
const lines = uiBlock.split('\n');
const filterCode = lines.slice(3, lines.length - 2).join('\n'); // Skip first 3 and last 2 lines

if (content.includes(marker) && !content.includes('Payment Method filter')) {
  const replacement =
    '              </div>\n\n' + filterCode + '\n\n              {/* Quick stats */}';
  content = content.replace(marker, replacement);

  fs.writeFileSync(pageFile, content, 'utf8');
  console.log('✅ UI blocks inserted successfully!');
  console.log('✅ 3 new filters added to sidebar!');
} else if (content.includes('Payment Method filter')) {
  console.log('⚠️  Filters already added!');
} else {
  console.log('❌ Marker not found. Check file manually.');
}
