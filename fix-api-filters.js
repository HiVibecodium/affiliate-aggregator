const fs = require('fs');
const file = 'app/api/programs/route.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix cookie filter
const oldCookieBlock = `    if (minCookieDuration) {
      where.cookieDuration = {
        gte: parseInt(minCookieDuration),
      };
    }`;

const newCookieBlock = `    // Cookie duration filter
    if (minCookieDuration || maxCookieDuration) {
      where.cookieDuration = {
        ...(minCookieDuration ? { gte: parseInt(minCookieDuration) } : {}),
        ...(maxCookieDuration ? { lte: parseInt(maxCookieDuration) } : {}),
      };
    }`;

if (
  content.includes('gte: parseInt(minCookieDuration)') &&
  !content.includes('maxCookieDuration ?')
) {
  content = content.replace(oldCookieBlock, newCookieBlock);
  console.log('✅ Updated cookie filter');
}

// Add threshold filter if not exists
if (!content.includes('where.paymentThreshold')) {
  const thresholdBlock = `
    // Payment threshold filter
    if (minPaymentThreshold || maxPaymentThreshold) {
      where.paymentThreshold = {
        ...(minPaymentThreshold ? { gte: parseFloat(minPaymentThreshold) } : {}),
        ...(maxPaymentThreshold ? { lte: parseFloat(maxPaymentThreshold) } : {}),
      };
    }
`;

  // Insert before Date filter comment
  content = content.replace(
    '\n  // Date filter for "New Programs" page',
    thresholdBlock + '\n  // Date filter for "New Programs" page'
  );
  console.log('✅ Added threshold filter');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ API filters complete!');
