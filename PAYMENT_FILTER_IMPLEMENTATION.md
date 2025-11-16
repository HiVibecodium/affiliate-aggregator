# 💳 Payment Method Filter - Implementation Guide

## Шаг 1: Добавить state в app/programs/page.tsx

### 1.1. Добавить state (строка ~59)

```typescript
const [maxCommission, setMaxCommission] = useState('');
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // ← ADD THIS
```

### 1.2. Инициализировать из URL (строка ~69)

```typescript
setMaxCommission(searchParams.get('maxCommission') || '');
setSelectedPaymentMethod(searchParams.get('paymentMethod') || ''); // ← ADD THIS
}, [searchParams]);
```

### 1.3. Добавить в fetchPrograms (строка ~238)

```typescript
...(maxCommission && { maxCommission }),
...(selectedPaymentMethod && { paymentMethod: selectedPaymentMethod }), // ← ADD THIS
});
```

### 1.4. Добавить в updateURL (строка ~272)

```typescript
if (maxCommission) params.set('maxCommission', maxCommission);
if (selectedPaymentMethod) params.set('paymentMethod', selectedPaymentMethod); // ← ADD THIS
if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
```

### 1.5. Добавить в useEffect dependencies (строка ~294)

```typescript
sortOrder,
currentPage,
selectedPaymentMethod, // ← ADD THIS
]);
```

### 1.6. Добавить в resetFilters (строка ~311)

```typescript
setMaxCommission('');
setSelectedPaymentMethod(''); // ← ADD THIS
setSortBy('createdAt');
```

### 1.7. Добавить в activeFiltersCount (строка ~326)

```typescript
maxCommission,
selectedPaymentMethod, // ← ADD THIS
].filter(Boolean).length;
```

### 1.8. Добавить UI filter (после Commission range, строка ~498)

```typescript
              </div>

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
                  <option value="Wire Transfer">🏦 Wire Transfer</option>
                  <option value="Direct Deposit">💰 Direct Deposit</option>
                  <option value="Payoneer">💵 Payoneer</option>
                  <option value="Check">📝 Check</option>
                  <option value="ACH">🏛️ ACH</option>
                  <option value="Cryptocurrency">₿ Cryptocurrency</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Фильтр по доступным методам выплат
                </p>
              </div>

              {/* Quick stats */}
```

---

## Шаг 2: Обновить API route (app/api/programs/route.ts)

### 2.1. Получить параметр (строка ~17)

```typescript
const maxCommission = searchParams.get('maxCommission');
const paymentMethod = searchParams.get('paymentMethod'); // ← ADD THIS
const sortBy = searchParams.get('sortBy') || 'createdAt';
```

### 2.2. Добавить в whereClause (строка ~70, после maxCommission)

```typescript
if (maxCommission) {
  whereClause.commissionRate = {
    ...whereClause.commissionRate,
    lte: parseFloat(maxCommission),
  };
}

// Payment method filter
if (paymentMethod) {
  whereClause.paymentMethods = {
    has: paymentMethod,
  };
}
```

---

## Шаг 3: Тестирование

### 3.1. Запустить dev server

```bash
cd affiliate-aggregator
npm run dev
```

### 3.2. Открыть http://localhost:3000/programs

### 3.3. Проверить фильтр:

1. Выбрать "PayPal" в Payment Method
2. Убедиться что отображаются только программы с PayPal
3. Проверить URL: должно быть `?paymentMethod=PayPal`
4. Проверить комбинацию с другими фильтрами

### 3.4. Проверить API напрямую:

```bash
curl "http://localhost:3000/api/programs?paymentMethod=PayPal&limit=5"
```

Должно вернуть только программы с PayPal в paymentMethods.

---

## Шаг 4: Проверить TypeScript

```bash
npx tsc --noEmit
```

Должно быть 0 ошибок.

---

## Шаг 5: Commit

```bash
git add app/programs/page.tsx app/api/programs/route.ts
git commit -m "feat: add payment method filter

- Add payment method dropdown to programs page
- Filter programs by payment method (PayPal, Wire, etc.)
- Update URL params for sharable links
- Support all common payment methods

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Альтернатива: Использовать уже готовый код

Если хотите, я могу создать полностью готовый файл `app/programs/page.tsx` с этими изменениями.
Просто скажите "создай полный файл" и я сгенерирую весь код.

---

## Следующие шаги

После реализации Payment Method Filter:

1. **Cookie Duration Filter** (1-2ч)
2. **Payment Threshold Filter** (1ч)
3. **New Programs Page** (2-3ч)

Все три можно сделать за 1 рабочий день!
