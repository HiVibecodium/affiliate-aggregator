const fs = require('fs');
const file = 'app/programs/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add to fetchPrograms params
const fetchMarker = '...(maxCommission && { maxCommission }),';
const newParams = `        ...(selectedPaymentMethod && { paymentMethod: selectedPaymentMethod }),
        ...(minCookieDuration && { minCookieDuration }),
        ...(maxCookieDuration && { maxCookieDuration }),
        ...(minPaymentThreshold && { minPaymentThreshold }),
        ...(maxPaymentThreshold && { maxPaymentThreshold }),`;

if (content.includes(fetchMarker) && !content.includes('selectedPaymentMethod &&')) {
  content = content.replace(fetchMarker, fetchMarker + '\n' + newParams);
  console.log('✅ Added to fetchPrograms');
}

// Add to updateURL
const urlMarker = 'if (maxCommission) params.set';
if (content.includes(urlMarker) && !content.includes("params.set('paymentMethod'")) {
  const newUrlParams = `    if (selectedPaymentMethod) params.set('paymentMethod', selectedPaymentMethod);
    if (minCookieDuration) params.set('minCookieDuration', minCookieDuration);
    if (maxCookieDuration) params.set('maxCookieDuration', maxCookieDuration);
    if (minPaymentThreshold) params.set('minPaymentThreshold', minPaymentThreshold);
    if (maxPaymentThreshold) params.set('maxPaymentThreshold', maxPaymentThreshold);`;

  content = content.replace(
    "if (maxCommission) params.set('maxCommission', maxCommission);",
    "if (maxCommission) params.set('maxCommission', maxCommission);\n" + newUrlParams
  );
  console.log('✅ Added to updateURL');
}

// Add to dependencies
if (content.includes('currentPage,') && !content.includes('selectedPaymentMethod,')) {
  content = content.replace(
    '    currentPage,\n  ]);',
    `    currentPage,\n    selectedPaymentMethod,\n    minCookieDuration,\n    maxCookieDuration,\n    minPaymentThreshold,\n    maxPaymentThreshold,\n  ]);`
  );
  console.log('✅ Added to dependencies');
}

// Add to resetFilters
if (
  content.includes("setMaxCommission('');") &&
  !content.includes("setSelectedPaymentMethod('')")
) {
  content = content.replace(
    "setMaxCommission('');",
    `setMaxCommission('');
    setSelectedPaymentMethod('');
    setMinCookieDuration('');
    setMaxCookieDuration('');
    setMinPaymentThreshold('');
    setMaxPaymentThreshold('');`
  );
  console.log('✅ Added to resetFilters');
}

// Add to activeFiltersCount
if (
  content.includes('maxCommission,\n  ].filter(Boolean)') &&
  !content.includes('selectedPaymentMethod,\n  ].filter')
) {
  content = content.replace(
    'maxCommission,\n  ].filter(Boolean)',
    `maxCommission,\n    selectedPaymentMethod,\n    minCookieDuration,\n    maxCookieDuration,\n    minPaymentThreshold,\n    maxPaymentThreshold,\n  ].filter(Boolean)`
  );
  console.log('✅ Added to activeFiltersCount');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Filter integration complete!');
console.log('Now add UI blocks to sidebar');
