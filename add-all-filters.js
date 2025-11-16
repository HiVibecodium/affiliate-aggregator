const fs = require('fs');
const file = 'app/programs/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables after maxCommission
const stateMarker = "const [maxCommission, setMaxCommission] = useState('');";
const newStates = `  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [minCookieDuration, setMinCookieDuration] = useState('');
  const [maxCookieDuration, setMaxCookieDuration] = useState('');
  const [minPaymentThreshold, setMinPaymentThreshold] = useState('');
  const [maxPaymentThreshold, setMaxPaymentThreshold] = useState('');`;

if (content.includes(stateMarker) && !content.includes('selectedPaymentMethod')) {
  content = content.replace(stateMarker, stateMarker + '\n' + newStates);
  console.log('✅ Added state variables');
}

// 2. Add URL initialization
const urlMarker = "setMaxCommission(searchParams.get('maxCommission') || '');";
const newInits = `    setSelectedPaymentMethod(searchParams.get('paymentMethod') || '');
    setMinCookieDuration(searchParams.get('minCookieDuration') || '');
    setMaxCookieDuration(searchParams.get('maxCookieDuration') || '');
    setMinPaymentThreshold(searchParams.get('minPaymentThreshold') || '');
    setMaxPaymentThreshold(searchParams.get('maxPaymentThreshold') || '');`;

if (content.includes(urlMarker) && !content.includes("searchParams.get('paymentMethod')")) {
  content = content.replace(urlMarker, urlMarker + '\n' + newInits);
  console.log('✅ Added URL initialization');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ programs/page.tsx updated!');
console.log('Next: Update API and add UI blocks manually');
