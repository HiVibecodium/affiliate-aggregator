const fs = require('fs');
const pageFile = 'app/programs/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

const filterUI = `
              {/* Payment Method filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💳 Способ оплаты
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => {
                    setSelectedPaymentMethod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все способы</option>
                  <option value="PayPal">💳 PayPal</option>
                  <option value="Wire Transfer">🏦 Банковский перевод</option>
                  <option value="Direct Deposit">💰 Прямой депозит</option>
                  <option value="Payoneer">💵 Payoneer</option>
                  <option value="Check">📝 Чек</option>
                  <option value="ACH">🏛️ ACH</option>
                  <option value="Cryptocurrency">₿ Криптовалюта</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Фильтр по доступным методам выплат
                </p>
              </div>

              {/* Cookie Duration filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🍪 Длительность Cookie (дни)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Мин"
                    value={minCookieDuration}
                    onChange={(e) => {
                      setMinCookieDuration(e.target.value);
                      setCurrentPage(1);
                    }}
                    min={0}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Макс"
                    value={maxCookieDuration}
                    onChange={(e) => {
                      setMaxCookieDuration(e.target.value);
                      setCurrentPage(1);
                    }}
                    max={365}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Популярно: 30, 60, 90, 365 дней
                </p>
              </div>

              {/* Payment Threshold filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💵 Минимальная выплата ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={minPaymentThreshold}
                    onChange={(e) => {
                      setMinPaymentThreshold(e.target.value);
                      setCurrentPage(1);
                    }}
                    min={0}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={maxPaymentThreshold}
                    onChange={(e) => {
                      setMaxPaymentThreshold(e.target.value);
                      setCurrentPage(1);
                    }}
                    max={10000}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Типично: $50, $100, $500
                </p>
              </div>
`;

// Insert before Quick stats
if (!content.includes('Payment Method filter')) {
  const quickStats = '              {/* Quick stats */}';
  content = content.replace(quickStats, filterUI + '\n' + quickStats);
  fs.writeFileSync(pageFile, content, 'utf8');
  console.log('✅ UI blocks inserted!');
  console.log('✅ 3 new filters added to sidebar!');
  console.log('✅ Total filters: 9 (was 6)!');
} else {
  console.log('⚠️  Filters already present');
}
