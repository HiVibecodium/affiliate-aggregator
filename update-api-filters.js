const fs = require('fs');
const file = 'app/api/programs/route.ts';
let content = fs.readFileSync(file, 'utf8');

// Add new params
if (!content.includes('maxCookieDuration')) {
  content = content.replace(
    "const minCookieDuration = searchParams.get('minCookieDuration');",
    "const minCookieDuration = searchParams.get('minCookieDuration');\n    const maxCookieDuration = searchParams.get('maxCookieDuration');\n    const minPaymentThreshold = searchParams.get('minPaymentThreshold');\n    const maxPaymentThreshold = searchParams.get('maxPaymentThreshold');"
  );
  console.log('✅ Added new parameters');
}

// Update cookie filter to support max
const oldCookie = `if (minCookieDuration) {
      where.cookieDuration = {
        gte: parseInt(minCookieDuration),
      };
    }`;

const newCookie = `if (minCookieDuration || maxCookieDuration) {
      where.cookieDuration = {
        ...(minCookieDuration ? { gte: parseInt(minCookieDuration) } : {}),
        ...(maxCookieDuration ? { lte: parseInt(maxCookieDuration) } : {}),
      };
    }`;

if (
  content.includes('gte: parseInt(minCookieDuration)') &&
  !content.includes('maxCookieDuration')
) {
  content = content.replace(oldCookie, newCookie);
  console.log('✅ Updated cookie filter');
}

// Add threshold filter
if (!content.includes('minPaymentThreshold') || !content.includes('where.paymentThreshold')) {
  const insertAfter = `    }

    // Note: Rating filter`;

  const thresholdFilter = `    }

    // Payment threshold filter
    if (minPaymentThreshold || maxPaymentThreshold) {
      where.paymentThreshold = {
        ...(minPaymentThreshold ? { gte: parseFloat(minPaymentThreshold) } : {}),
        ...(maxPaymentThreshold ? { lte: parseFloat(maxPaymentThreshold) } : {}),
      };
    }

    // Note: Rating filter`;

  content = content.replace(insertAfter, thresholdFilter);
  console.log('✅ Added threshold filter');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ API updated successfully!');
