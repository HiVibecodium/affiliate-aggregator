const fs = require('fs');
const file = 'app/programs/new/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const button90 = `            <button
              onClick={() => setTimeFilter('90')}
              className={\`px-4 py-2 rounded-lg font-medium transition \${
                timeFilter === '90'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }\`}
            >
              Последние 90 дней
            </button>
            `;

if (!content.includes('Последние 90 дней')) {
  // Find "Последние 30 дней" button end
  const marker = 'Последние 30 дней\n            </button>\n            <button';
  content = content.replace(
    marker,
    'Последние 30 дней\n            </button>\n' + button90 + '<button'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ 90 days button added!');
} else {
  console.log('⚠️  90 days button already exists');
}
