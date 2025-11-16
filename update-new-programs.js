const fs = require('fs');

const file = 'app/programs/new/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update type to include 90
content = content.replace(
  "const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'all'>('30');",
  "const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');"
);
console.log('✅ Updated timeFilter type');

// 2. Simplify fetchNewPrograms function
const oldFetch = `const fetchNewPrograms = async () => {
    setLoading(true);
    try {
      // Calculate date filter
      const daysAgo = timeFilter === 'all' ? 365 : parseInt(timeFilter);
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - daysAgo);

      const response = await fetch(\`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50\`);
      const data = await response.json();

      // Filter by date on client side (or move to API)
      const filtered = data.programs.filter((p: Program) => {
        const createdDate = new Date(p.createdAt);
        return timeFilter === 'all' || createdDate >= dateFilter;
      });

      setPrograms(filtered);
    } catch (error) {
      console.error('Failed to fetch new programs:', error);
    } finally {
      setLoading(false);
    }
  };`;

const newFetch = `const fetchNewPrograms = async () => {
    setLoading(true);
    try {
      // Build API URL with 'since' parameter
      const sinceParam = timeFilter === 'all' ? '' : \`&since=\${timeFilter}\`;
      const response = await fetch(
        \`/api/programs?sortBy=createdAt&sortOrder=desc&limit=50\${sinceParam}\`
      );
      const data = await response.json();

      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Failed to fetch new programs:', error);
    } finally {
      setLoading(false);
    }
  };`;

if (content.includes('Calculate date filter')) {
  content = content.replace(oldFetch, newFetch);
  console.log('✅ Updated fetchNewPrograms function');
}

// 3. Add 90 days button (find the 30 days button and add after it)
const button30 = content.indexOf('Последние 30 дней');
if (button30 > 0 && !content.includes('Последние 90 дней')) {
  // Find the end of this button
  let pos = button30;
  while (pos < content.length && content.substring(pos, pos + 8) !== '</button>') {
    pos++;
  }
  pos += 9; // After </button>

  const button90 = `
            <button
              onClick={() => setTimeFilter('90')}
              className={\`px-4 py-2 rounded-lg font-medium transition \${
                timeFilter === '90'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }\`}
            >
              Последние 90 дней
            </button>`;

  content = content.slice(0, pos) + button90 + content.slice(pos);
  console.log('✅ Added 90 days button');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ New Programs page updated successfully!');
