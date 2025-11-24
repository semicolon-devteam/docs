---
name: check-team-codex
description: Validates code against Semicolon Team Codex rules including commit conventions, code quality standards, and development best practices. Use before commits and during code reviews.
---

# Check Team Codex Skill

## Purpose

Automatically validate code against Semicolon team standards defined in the Team Codex to ensure consistency and quality across all projects.

## When to Use

- **Before committing**: Pre-commit validation
- **During code review**: Standards compliance check
- **After implementation**: Quality gate validation
- **CI/CD integration**: Automated quality checks
- **Onboarding**: Help new team members learn standards

## Core Rules (EMBEDDED)

### 1. Git & Commit Convention

**Format**: `type(scope): subject`

**Valid Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding or updating tests
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Code formatting (not CSS)
- `chore`: Build process, dependencies, tooling

**Rules**:
- Scope must be present (domain, feature, or component)
- Subject must be concise (< 72 characters)
- Use imperative mood ("Add feature" not "Added feature")
- No period at the end

**Examples**:
- ✅ `feat(posts): Add comment functionality`
- ✅ `fix(auth): Resolve login redirect issue`
- ✅ `test(v0.2.x): Add repository unit tests`
- ✅ `docs(readme): Update installation instructions`
- ❌ `updated code`
- ❌ `fixes` (no scope)
- ❌ `feat: added new feature.` (period at end)

### 2. Code Quality Rules

**Mandatory**:
- No `console.log` (except in error handlers or logging utilities)
- No `debugger` statements
- No commented-out code blocks
- ESLint must pass
- TypeScript must pass (no errors)
- All tests must pass
- No `--no-verify` flag usage (bypassing pre-commit hooks)

**Type Safety**:
- No `any` types (use `unknown` instead)
- Strict null checks
- Proper type definitions in `models/`

**Import Standards**:
- Modular imports for large libraries
- No wildcard imports (`import *`)
- Absolute imports with `@/` alias

### 3. Development Standards

**DDD Architecture**:
- Repository in `app/{domain}/_repositories/`
- API Client in `app/{domain}/_api-clients/`
- Hooks in `app/{domain}/_hooks/`
- Components in `app/{domain}/_components/`

**Testing**:
- Unit tests for repositories
- Integration tests for hooks
- Component tests for UI
- Minimum coverage: 70%

**Performance**:
- Server Components by default
- `'use client'` only when necessary
- React Query staleTime configured
- Dynamic imports for heavy components

## Validation Checks

### Check 1: Commit Messages

```bash
# Check last 10 commits
git log -10 --oneline --format="%s"
```

**Validation**:
- [ ] Format: `type(scope): subject`
- [ ] Valid type (feat/fix/docs/test/refactor/style/chore)
- [ ] Scope present
- [ ] Subject < 72 characters
- [ ] Imperative mood
- [ ] No period at end

**Common Violations**:
- `updated code` → Should be `feat(domain): Add feature description`
- `fixes` → Should be `fix(domain): Fix issue description`
- `WIP` → Should be squashed before merge

### Check 2: Code Quality

```bash
# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit

# Find debug code
grep -r "console\.log\|debugger" src/ --exclude-dir=node_modules --exclude="*.test.*"

# Find commented code (approximate)
grep -rn "^[[:space:]]*\/\/" src/ | grep -v "^[[:space:]]*\/\/ " | wc -l

# Check for any types
grep -r ": any\|as any" src/ --exclude-dir=node_modules --exclude="*.test.*"
```

**Validation**:
- [ ] ESLint passes (0 errors)
- [ ] TypeScript passes (0 errors)
- [ ] No console.log statements (except logging utilities)
- [ ] No debugger statements
- [ ] No large commented code blocks
- [ ] No `any` types

### Check 3: Pre-commit Hook Compliance

```bash
# Check if any commits bypassed hooks
git log --all --grep="--no-verify\|-n " --oneline

# Check Husky configuration
cat .husky/pre-commit
```

**Validation**:
- [ ] No `--no-verify` or `-n` flag usage
- [ ] Husky hooks configured
- [ ] Pre-commit hook runs lint and type check

### Check 4: DDD Architecture

```bash
# Check domain structure
for domain in app/*/; do
  echo "Checking $domain"
  ls -la "$domain" | grep -E "(_repositories|_api-clients|_hooks|_components)"
done

# Check for architecture violations
grep -r "'use client'" app/*/_repositories/
grep -r "createServerSupabaseClient" app/*/_components/
```

**Validation**:
- [ ] Domain structure follows DDD pattern
- [ ] No 'use client' in repositories
- [ ] No server client in components
- [ ] Each layer has index.ts exports

### Check 5: Testing Coverage

```bash
# Run tests
npm test

# Generate coverage report
npm run test:coverage

# Check coverage thresholds
cat coverage/coverage-summary.json | jq '.total'
```

**Validation**:
- [ ] All tests pass
- [ ] Overall coverage > 70%
- [ ] Repository coverage > 80%
- [ ] Hooks coverage > 80%
- [ ] Component coverage > 70%

### Check 6: Import Standards

```bash
# Check for wildcard imports
grep -r "import \*" src/ --exclude-dir=node_modules

# Check for relative imports beyond parent
grep -r "from '\.\./\.\./\.\." src/

# Check for missing @ alias
grep -r "from 'src/" src/
```

**Validation**:
- [ ] No wildcard imports
- [ ] Uses `@/` alias for deep imports
- [ ] Modular imports for large libraries

## Execution Flow

### 1. Quick Check (Pre-commit)

```bash
# Essential checks before commit
npm run lint && \
npx tsc --noEmit && \
grep -r "console\.log\|debugger" src/ --exclude-dir=node_modules --exclude="*.test.*"
```

**Exit Codes**:
- `0`: All checks passed ✅
- `1`: Lint errors ❌
- `2`: TypeScript errors ❌
- `3`: Debug code found ⚠️

### 2. Full Check (Pre-PR)

```bash
# Comprehensive validation
npm run lint && \
npx tsc --noEmit && \
npm test && \
npm run test:coverage && \
git log -10 --oneline
```

### 3. CI/CD Check

Include in GitHub Actions:

```yaml
# .github/workflows/quality-check.yml
- name: Team Codex Validation
  run: |
    npm run lint
    npx tsc --noEmit
    npm test -- --coverage --watchAll=false
    # Check commit messages
    git log -10 --oneline --format="%s" | grep -E "^(feat|fix|docs|test|refactor|style|chore)\(.+\): .+"
```

## Output Format

### Summary Report

```markdown
# Team Codex Validation Report

## ✅ Passed / ⚠️ Warnings / ❌ Failed

### 1. Commit Messages
- ✅ All 10 recent commits follow convention
- Format: `type(scope): subject`

### 2. Code Quality
- ✅ ESLint: Passed (0 errors, 0 warnings)
- ❌ TypeScript: 3 errors found
  - `app/posts/_repositories/PostsRepository.ts:15` - Type error
  - `app/posts/_hooks/usePosts.ts:23` - Missing type
  - `models/posts/index.ts:8` - Invalid type assertion
- ⚠️ Debug Code: 2 instances found
  - `app/dashboard/page.tsx:45` - console.log
  - `app/posts/_components/PostsList.tsx:78` - console.log

### 3. Architecture
- ✅ DDD structure compliant
- ✅ No server code in client components
- ✅ All layers have index exports

### 4. Testing
- ✅ All tests passed (137/137)
- ✅ Coverage: 82.5% (above 70% threshold)
  - Repositories: 85%
  - Hooks: 80%
  - Components: 78%

### 5. Import Standards
- ✅ No wildcard imports
- ✅ Uses @ alias correctly
- ✅ Modular imports

---

## 🔴 Critical Issues (Must Fix)

1. **TypeScript Errors**: 3 errors must be resolved
   ```bash
   npx tsc --noEmit
   ```

2. **Debug Code**: Remove console.log statements
   ```bash
   # Remove these:
   app/dashboard/page.tsx:45
   app/posts/_components/PostsList.tsx:78
   ```

## 🟡 Warnings

None

## 🟢 All Checks Passed

- Commit messages
- ESLint
- Architecture
- Testing
- Imports

---

## Next Steps

1. Fix TypeScript errors
2. Remove debug code
3. Re-run validation:
   ```bash
   npm run lint && npx tsc --noEmit && npm test
   ```
4. Commit with proper message:
   ```bash
   git commit -m "fix(posts): Resolve type errors and remove debug code"
   ```
```

### Detailed Report (for CI/CD)

```json
{
  "status": "failed",
  "checks": {
    "commits": {
      "passed": true,
      "issues": []
    },
    "eslint": {
      "passed": true,
      "errors": 0,
      "warnings": 0
    },
    "typescript": {
      "passed": false,
      "errors": 3,
      "details": [
        {
          "file": "app/posts/_repositories/PostsRepository.ts",
          "line": 15,
          "message": "Type error"
        }
      ]
    },
    "debugCode": {
      "passed": false,
      "instances": 2,
      "locations": [
        "app/dashboard/page.tsx:45",
        "app/posts/_components/PostsList.tsx:78"
      ]
    },
    "architecture": {
      "passed": true,
      "violations": []
    },
    "tests": {
      "passed": true,
      "total": 137,
      "failed": 0,
      "coverage": 82.5
    }
  },
  "criticalIssues": 2,
  "warnings": 0
}
```

## Integration Examples

### Git Hook (Husky)

```bash
# .husky/pre-commit
#!/bin/sh

echo "🔍 Running Team Codex validation..."

# Run checks
npm run lint || exit 1
npx tsc --noEmit || exit 1

# Check for debug code
DEBUG_CODE=$(grep -r "console\.log\|debugger" src/ --exclude-dir=node_modules --exclude="*.test.*" || true)
if [ -n "$DEBUG_CODE" ]; then
  echo "❌ Debug code found:"
  echo "$DEBUG_CODE"
  echo ""
  echo "Remove debug code before committing."
  exit 1
fi

echo "✅ Team Codex validation passed"
```

### VS Code Task

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Team Codex Check",
      "type": "shell",
      "command": "npm run lint && npx tsc --noEmit && npm test",
      "problemMatcher": [],
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "check:codex": "npm run lint && npx tsc --noEmit && npm test",
    "check:commits": "git log -10 --oneline --format='%s' | grep -E '^(feat|fix|docs|test|refactor|style|chore)\\(.+\\): .+'",
    "check:debug": "grep -r 'console\\.log\\|debugger' src/ --exclude-dir=node_modules --exclude='*.test.*' || true"
  }
}
```

## Reference

- **Team Codex**: https://github.com/semicolon-devteam/docs/wiki/Team-Codex
- **DDD Architecture**: See `CLAUDE.md`
- **Commit Convention**: https://www.conventionalcommits.org/

## Remember

- **Run before every commit**: Prevent issues early
- **Fix all critical issues**: Never bypass with `--no-verify`
- **Maintain standards**: Consistency across the team
- **Automate checks**: Use Husky, CI/CD
- **Review regularly**: Keep Team Codex up to date
