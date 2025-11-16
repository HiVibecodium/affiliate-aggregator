#!/bin/bash

BASE_URL="https://affiliate-aggregator-five.vercel.app"

echo "=== LIVE API HEALTH CHECK ==="
echo ""

echo "1. Health Check:"
curl -s "$BASE_URL/api/health" | python -m json.tool 2>/dev/null | head -10

echo ""
echo "2. Stats:"
curl -s "$BASE_URL/api/programs/stats" | python -m json.tool 2>/dev/null

echo ""
echo "3. Filters Available:"
curl -s "$BASE_URL/api/programs/filters" | python -m json.tool 2>/dev/null | head -30

echo ""
echo "4. Version:"
curl -s "$BASE_URL/api/version" | python -m json.tool 2>/dev/null
