#!/bin/bash

echo "=== FEATURE INTEGRATION CHECK ==="
echo ""

echo "1. ENHANCED PROGRAM CARDS:"
if grep -q "EnhancedProgramCard" app/programs/page.tsx 2>/dev/null; then
  echo "   ✅ EnhancedProgramCard используется"
else
  echo "   ❌ EnhancedProgramCard НЕ используется"
fi

echo ""
echo "2. SEARCH SUGGESTIONS:"
if grep -q "SearchSuggestions" app/programs/page.tsx 2>/dev/null; then
  echo "   ✅ SearchSuggestions интегрирован"
else
  echo "   ❌ SearchSuggestions НЕ интегрирован"
fi

echo ""
echo "3. PAYMENT METHOD FILTER:"
if grep -q "selectedPaymentMethod\|paymentMethod" app/programs/page.tsx 2>/dev/null; then
  echo "   ✅ Payment filter в UI"
else
  echo "   ❌ Payment filter НЕ в UI"
fi

echo ""
echo "4. COOKIE DURATION FILTER:"
if grep -q "minCookieDuration\|cookieDuration.*useState" app/programs/page.tsx 2>/dev/null; then
  echo "   ✅ Cookie filter в UI"
else
  echo "   ❌ Cookie filter НЕ в UI"
fi

echo ""
echo "5. PAYMENT THRESHOLD FILTER:"
if grep -q "minPaymentThreshold\|paymentThreshold.*useState" app/programs/page.tsx 2>/dev/null; then
  echo "   ✅ Threshold filter в UI"
else
  echo "   ❌ Threshold filter НЕ в UI"
fi

echo ""
echo "6. NEW PROGRAMS PAGE:"
if [ -f "app/programs/new/page.tsx" ]; then
  echo "   ✅ Page exists"
  if grep -q "'90'" app/programs/new/page.tsx 2>/dev/null; then
    echo "   ✅ Has 90 days option"
  else
    echo "   ⚠️  Missing 90 days option"
  fi
else
  echo "   ❌ Page NOT exists"
fi

echo ""
echo "7. API ENDPOINTS:"
echo "   - Suggestions API:" 
if [ -f "app/api/programs/suggestions/route.ts" ]; then
  echo "     ✅ EXISTS"
else
  echo "     ❌ NOT EXISTS"
fi

echo "   - Date filtering (since param):"
if grep -q "since.*searchParams" app/api/programs/route.ts 2>/dev/null; then
  echo "     ✅ IMPLEMENTED"
else
  echo "     ❌ NOT IMPLEMENTED"
fi

echo ""
echo "8. COMPONENTS:"
if [ -f "components/SearchSuggestions.tsx" ]; then
  echo "   ✅ SearchSuggestions component exists"
else
  echo "   ❌ SearchSuggestions NOT exists"
fi

if [ -f "components/EnhancedProgramCard.tsx" ]; then
  echo "   ✅ EnhancedProgramCard exists"
else
  echo "   ❌ EnhancedProgramCard NOT exists"
fi

echo ""
echo "=== END CHECK ==="
