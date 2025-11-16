#!/bin/bash

# Fix minRating in programs/route.ts  
sed -i "s/const minRating = searchParams.get('minRating');/\/\/ const minRating = searchParams.get('minRating'); \/\/ TODO: Implement rating filter/g" app/api/programs/route.ts

# Fix getTimeSinceAdded in programs/new/page.tsx
sed -i "s/const getTimeSinceAdded = /\/\/ const getTimeSinceAdded = /g" app/programs/new/page.tsx

# Fix unused functions in programs/page.tsx  
sed -i "s/function toggleComparison(/\/\/ function toggleComparison(/g" app/programs/page.tsx
sed -i "s/async function toggleFavorite(/\/\/ async function toggleFavorite(/g" app/programs/page.tsx
sed -i "s/async function trackClick(/\/\/ async function trackClick(/g" app/programs/page.tsx

echo "Fixed remaining issues"
