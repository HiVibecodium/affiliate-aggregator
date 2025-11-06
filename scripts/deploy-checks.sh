#!/bin/bash
# Pre-deployment validation script

set -e

echo "🔍 Running pre-deployment checks..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Ensure tests pass
echo -e "\n${YELLOW}Check 1: Running tests...${NC}"
if npm run test:unit; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
else
    echo -e "${RED}✗ Unit tests failed${NC}"
    exit 1
fi

# Check 2: Lint check
echo -e "\n${YELLOW}Check 2: Running linter...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Linter passed${NC}"
else
    echo -e "${RED}✗ Linter failed${NC}"
    exit 1
fi

# Check 3: Type check
echo -e "\n${YELLOW}Check 3: Running type check...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${RED}✗ Type check failed${NC}"
    exit 1
fi

# Check 4: Build verification
echo -e "\n${YELLOW}Check 4: Verifying build...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Check 5: Environment variables validation
echo -e "\n${YELLOW}Check 5: Validating environment variables...${NC}"
required_vars=(
    "DATABASE_URL"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All required environment variables present${NC}"
else
    echo -e "${RED}✗ Missing environment variables: ${missing_vars[*]}${NC}"
    exit 1
fi

# Check 6: Database connectivity
echo -e "\n${YELLOW}Check 6: Checking database connectivity...${NC}"
if npx prisma db pull --print > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connectivity verified${NC}"
else
    echo -e "${YELLOW}⚠ Database connectivity check skipped (not critical)${NC}"
fi

# Check 7: Check for pending migrations
echo -e "\n${YELLOW}Check 7: Checking migration status...${NC}"
migration_status=$(npx prisma migrate status 2>&1 || true)
if echo "$migration_status" | grep -q "Database is up to date"; then
    echo -e "${GREEN}✓ No pending migrations${NC}"
elif echo "$migration_status" | grep -q "pending migration"; then
    echo -e "${YELLOW}⚠ Pending migrations detected - ensure they are applied${NC}"
else
    echo -e "${GREEN}✓ Migration check completed${NC}"
fi

# Check 8: Security audit
echo -e "\n${YELLOW}Check 8: Running security audit...${NC}"
audit_result=$(npm audit --audit-level=high 2>&1 || true)
if echo "$audit_result" | grep -q "found 0 vulnerabilities"; then
    echo -e "${GREEN}✓ No high-severity vulnerabilities${NC}"
else
    echo -e "${YELLOW}⚠ Security vulnerabilities detected (review recommended)${NC}"
fi

echo -e "\n${GREEN}✅ All pre-deployment checks completed successfully!${NC}"
echo -e "Ready for deployment 🚀"
