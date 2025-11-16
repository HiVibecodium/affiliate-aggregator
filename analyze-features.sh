#!/bin/bash
echo "=== FEATURE ANALYSIS ==="
echo ""
echo "1. PAGES (User-facing):"
find app -name "page.tsx" -not -path "*/api/*" | wc -l
echo ""
echo "2. API ENDPOINTS:"
find app/api -name "route.ts" | wc -l
echo ""
echo "3. COMPONENTS:"
find components -name "*.tsx" | wc -l
echo ""
echo "4. DATABASE MODELS:"
grep "^model " prisma/schema.prisma | wc -l
echo ""
echo "5. TESTS:"
find tests -name "*.test.ts*" | wc -l
