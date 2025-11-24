---
name: check-team-codex
description: Validate code against Team Codex standards. Checks commit format, ESLint, TypeScript, debug code, and architecture compliance. Used by agents during verification and quality gates.
---

# Check Team Codex Skill

**Purpose**: Enforce Semicolon team coding standards and conventions

## When to Use

Agents should invoke this skill when:

- Before creating commits
- During verification phase
- After implementation completion
- Pre-commit validation needed
- Code review preparation
- Quality gates in v0.4.x CODE phase

## What It Does

Executes comprehensive Team Codex compliance checks:

### **1. Commit Message Format**

**📚 Reference**: [Git Rules - Commit Messages](https://github.com/semicolon-devteam/docs/wiki/rules-git)

- Check last 10 commits
- Validate against Git Rules documentation (GIT-CM-xxx rules)
- 규칙 상세 내용은 위 링크 참조 (직접 명시하지 않음)

### **2. ESLint Compliance**

```bash
npm run lint
```

- Zero errors expected
- Zero warnings expected (strict mode)
- Custom rules from `.eslintrc.json`

### **3. TypeScript Strict Mode**

```bash
npx tsc --noEmit
```

- Zero type errors expected
- Strict mode enabled
- No implicit any
- Strict null checks

### **4. Debug Code Detection**

- Search for `console.log`
- Search for `console.debug`
- Search for `debugger`
- Check for commented-out code blocks
- Detect TODO comments in production code

### **5. 'any' Type Detection**

```bash
grep -r ":\s*any" src/
grep -r "as any" src/
```

- Report all 'any' usages
- Categorize by severity
- Suggest explicit types

### **6. Pre-commit Hook Bypass Check**

```bash
git log -1 --format=%B | grep -i "no-verify"
```

- Detect `--no-verify` or `-n` flag usage
- Flag as CRITICAL violation
- Team Codex prohibits hook bypassing

### **7. Architecture Compliance**

- Verify no `'use client'` in Repository files
- Check no direct Supabase imports in components
- Validate Factory Pattern for API clients
- Ensure proper layer separation

## Usage

```javascript
// Full check (all validations)
skill: checkTeamCodex();

// Specific checks
skill: checkTeamCodex({ checks: ["commits", "eslint", "typescript"] });

// Quick check (ESLint + TypeScript only)
skill: checkTeamCodex({ quick: true });
```

## Output Format

```markdown
# Team Codex Compliance Report

## ✅ Commit Messages (10/10 valid)

Recent commits:

1. feat(posts): Add comment functionality ✅
2. fix(auth): Resolve login redirect ✅
3. test(v0.2.x): Add repository tests ✅
   ...

## ✅ ESLint
```

✓ 0 errors
✓ 0 warnings
All files pass linting

```

## ✅ TypeScript

```

✓ No type errors found
Strict mode: enabled

```

## ⚠️ Debug Code (2 instances found)

```

src/app/posts/\_hooks/usePosts.ts:15
console.log('Debug: fetching posts');

src/app/posts/\_components/PostsList.tsx:42
// TODO: implement pagination

```

**Action**: Remove before PR

## ⚠️ 'any' Types (3 instances found)

```

src/app/posts/\_api-clients/post.client.ts:23
return response.json() as any;

src/app/posts/\_hooks/usePosts.ts:18
params: any

```

**Action**: Use explicit types

## ✅ Pre-commit Hook

No bypass detected ✅

## ✅ Architecture Compliance

- Repository files: ✅ No 'use client'
- Components: ✅ No direct Supabase imports
- API Clients: ✅ Factory Pattern used
- Layer separation: ✅ Proper boundaries

---

## Summary

**Status**: ⚠️ WARNINGS (Fix before PR)

**Critical Issues**: 0
**Warnings**: 5 (2 debug code, 3 'any' types)
**Passed Checks**: 5/7

**Next Steps**:
1. Remove console.log statements
2. Replace 'any' with explicit types
3. Re-run check before committing
```

## Severity Levels

### 🔴 CRITICAL (Blocks PR)

- ESLint errors
- TypeScript errors
- Pre-commit hook bypass
- Architecture violations

### 🟡 WARNING (Should fix)

- Debug code (console.log, debugger)
- 'any' types
- TODO comments
- ESLint warnings

### 🟢 INFO (Nice to have)

- Code style suggestions
- Performance hints
- Documentation improvements

## Team Codex Reference

All checks based on: [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)

Key rules enforced:

- Commit Convention (MUST follow)
- Code Quality (ESLint + TypeScript strict)
- No Debug Code in commits
- No 'any' types (prefer explicit)
- Never bypass pre-commit hooks

## Dependencies

- `npm run lint` - ESLint
- `npx tsc --noEmit` - TypeScript
- `git log` - Commit history
- `grep` - Code pattern search

## Related Skills

- `verify` - Uses this skill for comprehensive verification
- `implement` - Uses this skill in v0.4.x CODE phase

## Constitution Compliance

- Enforces code quality standards
- Maintains team consistency
- Prevents technical debt
- Supports maintainability

## Critical Rules

1. **Zero Tolerance for ESLint/TypeScript Errors**
2. **No Debug Code in Commits**: Always clean before commit
3. **Never Bypass Pre-commit Hooks**: Fix errors, don't skip
4. **Explicit Types**: Avoid 'any', use proper typing
5. **Commit Format**: MUST follow type(scope): subject

## Error Handling

If checks fail:

1. Generate detailed report
2. Categorize by severity
3. Provide specific file/line references
4. Suggest fixes
5. Return FAILED status
6. Agent decides fix strategy

## Return Values

```javascript
{
  status: "PASSED" | "WARNINGS" | "FAILED",
  criticalIssues: number,
  warnings: number,
  checks: {
    commits: { passed: true, count: "10/10" },
    eslint: { passed: true, errors: 0, warnings: 0 },
    typescript: { passed: true, errors: 0 },
    debugCode: { passed: false, instances: 2 },
    anyTypes: { passed: false, instances: 3 },
    precommitHook: { passed: true },
    architecture: { passed: true }
  },
  report: "markdown string",
  nextSteps: ["action 1", "action 2"]
}
```

## Quick Fix Suggestions

### Remove Debug Code

```bash
# Find all console.log
grep -r "console\.log" src/

# Find debugger statements
grep -r "debugger" src/
```

### Fix 'any' Types

```typescript
// Before
const data: any = await fetch(...);

// After
const data: GetPostsResponse = await fetch(...);
```

### Fix Commit Message

```bash
# Bad
git commit -m "fixed bug"

# Good
git commit -m "fix(posts): Resolve pagination offset bug"
```
