#!/bin/bash

# Fix unused request parameters
sed -i 's/async function POST(request: Request)/async function POST(_request: Request)/g' app/api/comparisons/check/route.ts
sed -i 's/async function GET(request: Request)/async function GET(_request: Request)/g' app/api/favorites/route.ts

# Fix other unused variables
sed -i 's/} catch (error) {/} catch (_error) {/g' app/api/health/route.ts

# Fix unused imports
sed -i 's/const { Legend }/const {}/g' components/analytics/CategoryChart.tsx

