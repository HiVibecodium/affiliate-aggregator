#!/bin/bash
# Pre-commit hook to detect secrets in staged files

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Patterns to detect (case-insensitive)
PATTERNS=(
  "password\s*=\s*['\"][^'\"]{8,}"
  "api[_-]?key\s*=\s*['\"][^'\"]{16,}"
  "secret\s*=\s*['\"][^'\"]{16,}"
  "token\s*=\s*['\"][^'\"]{16,}"
  "private[_-]?key"
  "BEGIN\s+(RSA\s+)?PRIVATE\s+KEY"
  "aws[_-]?(access[_-]?)?key[_-]?id"
  "AKIA[0-9A-Z]{16}"
  "postgres://[^:]+:[^@]+@"
  "mysql://[^:]+:[^@]+@"
  "mongodb://[^:]+:[^@]+@"
)

# File extensions to check
FILE_PATTERNS="\.ts$|\.tsx$|\.js$|\.jsx$|\.json$|\.env"

echo "🔍 Scanning staged files for secrets..."

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "$FILE_PATTERNS")

if [ -z "$STAGED_FILES" ]; then
  echo "✓ No files to scan"
  exit 0
fi

FOUND_SECRETS=0

# Check each staged file
for FILE in $STAGED_FILES; do
  if [ ! -f "$FILE" ]; then
    continue
  fi
  
  # Skip certain files
  if [[ "$FILE" == *".example"* ]] || [[ "$FILE" == *".template"* ]]; then
    continue
  fi
  
  # Check for patterns
  for PATTERN in "${PATTERNS[@]}"; do
    MATCHES=$(git diff --cached "$FILE" | grep -iE "$PATTERN" | grep "^\+" | grep -v "^\+\+\+")
    
    if [ ! -z "$MATCHES" ]; then
      if [ $FOUND_SECRETS -eq 0 ]; then
        echo ""
        echo -e "${RED}❌ POTENTIAL SECRETS DETECTED!${NC}"
        echo ""
      fi
      
      FOUND_SECRETS=1
      echo -e "${YELLOW}File: $FILE${NC}"
      echo "$MATCHES" | head -3
      echo ""
    fi
  done
done

if [ $FOUND_SECRETS -eq 1 ]; then
  echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  COMMIT BLOCKED: Potential secrets detected in files     ║${NC}"
  echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "Please remove sensitive data before committing."
  echo ""
  echo "If this is a false positive, you can:"
  echo "  1. Use environment variables instead"
  echo "  2. Add the file pattern to .gitignore"
  echo "  3. Skip this check with: git commit --no-verify (NOT RECOMMENDED)"
  echo ""
  exit 1
fi

echo "✓ No secrets detected"
exit 0
