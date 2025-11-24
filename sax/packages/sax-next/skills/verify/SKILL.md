---
name: verify
description: Execute Phase 5 comprehensive verification. Validates spec compliance, Team Codex, DDD architecture, Supabase patterns, test coverage, and Constitution principles. Used by agents before PR.
location: project
---

# Verify Skill (Enhanced)

**Purpose**: Multi-layered quality verification before PR submission with integrated spec analysis

## When to Use

Agents should invoke this skill when:

- Implementation is complete
- Before creating Pull Request
- User requests quality check
- Pre-commit validation needed
- Constitution compliance verification required

## What It Does

Executes 6-layer verification with integrated spec analysis:

### **1. Spec Compliance** (Integrated speckit.analyze)

**Purpose**: Cross-artifact consistency validation

**Checks**:

- ✅ spec.md ↔ plan.md alignment
  - All requirements mapped to plan sections
  - No orphaned requirements
  - Technical approach addresses all scenarios

- ✅ plan.md ↔ tasks.md alignment
  - All plan components have corresponding tasks
  - DDD layers properly mapped
  - No missing implementation tasks

- ✅ tasks.md ↔ code alignment
  - All tasks completed or in-progress
  - Code follows plan architecture
  - No deviation from technical approach

- ✅ Acceptance criteria coverage
  - All criteria testable
  - All criteria implemented
  - Edge cases handled

**Process**:

1. Parse spec.md, plan.md, tasks.md
2. Build dependency graph
3. Cross-reference implementation
4. Report gaps and inconsistencies

**Note**: This replaces `/speckit.analyze` command - analysis is fully integrated

### **2. Team Codex Compliance**

**Invokes**: `skill:check-team-codex`

**Checks**:

- ✅ Commit message format (last 10 commits)
  - Format: `type(scope): subject`
  - Valid types: feat, fix, docs, test, refactor, style, chore
  - Gitmoji usage (recommended)

- ✅ ESLint (zero errors/warnings expected)

  ```bash
  npm run lint
  ```

- ✅ TypeScript (zero type errors expected)

  ```bash
  npx tsc --noEmit
  ```

- ✅ Debug code detection
  - Search for `console.log`, `console.debug`, `debugger`
  - Check for commented-out code blocks

- ✅ 'any' type detection
  - Scan for TypeScript `any` usage
  - Report file/line references

- ✅ Hook bypass detection
  - Verify no `--no-verify` in commit history
  - Check for hook circumvention patterns

### **3. DDD Architecture Compliance**

**Invokes**: `skill:validate-architecture`

**Checks**:

- ✅ 4-layer structure exists

  ```
  app/{domain}/_repositories/
  app/{domain}/_api-clients/
  app/{domain}/_hooks/
  app/{domain}/_components/
  ```

- ✅ Layer pattern compliance
  - Repository: `createServerSupabaseClient`, no 'use client'
  - API Client: Factory Pattern, registered in lib/api-clients/
  - Hooks: React Query patterns, no direct DB access
  - Components: Proper separation of concerns

- ✅ SSR rules validation
  - No 'use client' in Repository layer
  - No browser APIs in server components
  - Proper client boundary markers

- ✅ Import validation
  - No direct `@supabase/supabase-js` imports in components
  - Proper use of client/server Supabase instances

### **4. Supabase Pattern Verification**

**Checks**:

- ✅ Repository uses `createServerSupabaseClient`

  ```typescript
  const supabase = await createServerSupabaseClient();
  ```

- ✅ RPC function naming (core-supabase patterns)
  - Check against core-supabase repository
  - Verify parameter structure matches
  - Confirm return type handling

- ✅ Type assertions pattern

  ```typescript
  return data as unknown as Type;
  ```

- ✅ Error handling implementation
  ```typescript
  if (error) throw new Error(error.message);
  ```

### **5. Test Coverage and Quality**

**Checks**:

- ✅ Run all tests

  ```bash
  npm test
  ```

- ✅ Generate coverage report

  ```bash
  npm run test:coverage
  ```

- ✅ Validate coverage thresholds:
  - Repositories: >80%
  - Hooks: >80%
  - Components: >70%

- ✅ Test quality patterns
  - Repository tests: Proper Supabase mocking
  - Hook tests: React Query testing patterns
  - Component tests: User interaction testing
  - No skipped tests (`it.skip`, `describe.skip`)

### **5.5. Browser Testing** (Optional)

**Purpose**: 실제 브라우저에서 UI/UX 검증

**User Prompt** (단위 테스트 통과 후):

```markdown
🖥️ **브라우저 테스트 옵션**

단위 테스트가 통과했습니다. 브라우저에서 추가 검증을 진행하시겠습니까?

1. **직접 테스트**: 개발자가 직접 브라우저에서 확인
2. **AI 브라우저 테스트**: AI가 MCP(chrome-devtools/playwright)로 자동 테스트
3. **건너뛰기**: 브라우저 테스트 생략 (PR 진행)

선택해주세요 (1/2/3)
```

**MCP Options**:

- `chrome-devtools`: 기존 Chrome 브라우저 연동 (DevTools 연결 필요)
- `playwright`: 헤드리스 브라우저 자동화 (빠르고 안정적, 권장)

**Browser Test Execution** (Option 2 선택 시):

```bash
# 개발 서버 확인 (npm run dev 실행 중)

# Option A: chrome-devtools MCP
mcp__chrome-devtools__navigate_page(url: "http://localhost:3000/{path}")
mcp__chrome-devtools__take_snapshot()
mcp__chrome-devtools__list_console_messages(types: ["error"])

# Option B: playwright MCP (권장)
mcp__playwright__browser_navigate(url: "http://localhost:3000/{path}")
mcp__playwright__browser_snapshot()
mcp__playwright__browser_console_messages(onlyErrors: true)
```

**Test Categories**:

- ✅ Page Load: 페이지 정상 로드 및 렌더링
- ✅ UI Elements: 주요 컴포넌트 표시
- ✅ Interactions: 버튼, 폼, 네비게이션 동작
- ✅ Console Errors: JavaScript/네트워크 에러 없음
- ✅ Responsive: 데스크톱/모바일 뷰 확인 (선택적)

**Browser Test Report Format**:

```markdown
## 🖥️ Browser Test Results

**Environment**:

- URL: http://localhost:3000/{path}
- MCP: chrome-devtools | playwright
- Viewport: 1920x1080

**Results**:
| Category | Status | Details |
|----------|--------|---------|
| Page Load | ✅/❌ | [시간] |
| UI Rendering | ✅/❌ | [상태] |
| Interactions | ✅/❌ | [테스트 항목] |
| Console Errors | ✅/❌ | [에러 수] |

**Status**: ✅ BROWSER TEST PASSED | ❌ BROWSER TEST FAILED
```

**Severity**:

- 🔴 Critical: 페이지 로드 실패, JS 크래시, 핵심 기능 불가
- 🟡 Warning: 콘솔 경고, 스타일 이슈, 비핵심 기능 문제
- 🟢 Info: 성능 개선 제안, UI 개선 제안

### **6. Constitution Principles Validation**

**Checks all 9 principles**:

1. ✅ **DDD Architecture** (Principle I)
   - 4-layer structure complete
   - Domain boundaries clear

2. ✅ **SSR-First** (Principle II)
   - Server Components by default
   - Minimal client boundaries

3. ✅ **Test-Driven Quality** (Principle III)
   - Tests written before implementation
   - Coverage thresholds met

4. ✅ **Performance Excellence** (Principle IV)
   - Bundle size targets met
   - No obvious performance issues

5. ✅ **API Mode Flexibility** (Principle V)
   - Factory Pattern implemented
   - Environment variable configuration

6. ✅ **Atomic Design System** (Principle VI)
   - Components in correct atomic layer
   - No architectural mixing

7. ✅ **Type Safety** (Principle VII)
   - No 'any' types
   - Proper Supabase type generation

8. ✅ **Spec-Driven Development** (Principle VIII)
   - spec.md → plan.md → tasks.md exists
   - Cross-artifact alignment

9. ✅ **Agent-Driven Collaboration** (Principle IX)
   - Phase-gated approvals received
   - Documentation complete

### **7. Generate Report**

- Consolidate all results
- Categorize issues (Critical/Warning/Suggestion)
- Provide actionable next steps
- Return approval status

## Usage

```javascript
// Full verification (recommended before PR)
skill: verify();

// Quick check (skip tests)
skill: verify({ quick: true });

// Spec-only verification
skill: verify({ layers: ["spec"] });

// Code-only verification (skip spec)
skill: verify({ layers: ["code", "tests", "constitution"] });

// Full verification with browser testing
skill: verify({ browserTest: true });

// Full verification with browser testing using specific MCP
skill: verify({ browserTest: true, mcp: "playwright" });
skill: verify({ browserTest: true, mcp: "chrome-devtools" });
```

## Output Format

```markdown
# Quality Verification Report

**Feature**: Add comment functionality
**Branch**: feature/posts-comments
**Date**: 2025-01-20

---

## Executive Summary

**Overall Status**: ✅ APPROVED

**Critical Issues**: 0
**Warnings**: 2
**Suggestions**: 3

---

## Detailed Results

### 1. Spec Compliance ✅

**spec.md ↔ plan.md**:

- ✅ All requirements mapped
- ✅ Technical approach complete
- ✅ No orphaned requirements

**plan.md ↔ tasks.md**:

- ✅ All components have tasks
- ✅ DDD layers properly mapped
- ✅ Dependency order correct

**tasks.md ↔ code**:

- ✅ All tasks completed
- ✅ Implementation follows plan
- ✅ No architectural deviations

**Acceptance Criteria**:

- ✅ 100% coverage (10/10 criteria)
- ✅ All testable
- ✅ All implemented

### 2. Team Codex ✅

- Commit Messages: 10/10 valid ✅
- ESLint: ✅ 0 errors, 0 warnings
- TypeScript: ✅ No errors
- Debug Code: ✅ Clean
- 'any' Types: ⚠️ Found 2 instances
  - `app/posts/_hooks/usePosts.ts:23`
  - `app/posts/_hooks/usePosts.ts:45`

### 3. DDD Architecture ✅

- 4-layer structure: ✅ Complete
- Pattern compliance: ✅ No violations
- SSR rules: ✅ No 'use client' in Repository
- Import validation: ✅ Proper Supabase client usage

### 4. Supabase Integration ✅

- Server client usage: ✅
- RPC patterns: ✅ Matches core-supabase
- Type assertions: ✅ Proper `as unknown as` usage
- Error handling: ✅ Consistent pattern

### 5. Testing ✅

- Total: 15 tests
- Passing: 15 (100%)
- Coverage:
  - Repositories: 92% ✅ (>80%)
  - Hooks: 88% ✅ (>80%)
  - Components: 75% ✅ (>70%)

### 5.5. Browser Testing ✅ (Optional)

- Page Load: ✅ 1.8s
- UI Rendering: ✅ All components visible
- Interactions: ✅ Buttons, forms working
- Console Errors: ✅ None
- MCP Used: playwright

### 6. Constitution ✅

- ✅ Principle I: DDD Architecture
- ✅ Principle II: SSR-First
- ✅ Principle III: Test-Driven Quality
- ✅ Principle IV: Performance Excellence
- ✅ Principle V: API Mode Flexibility
- ✅ Principle VI: Atomic Design System
- ⚠️ Principle VII: Type Safety (2 'any' types)
- ✅ Principle VIII: Spec-Driven Development
- ✅ Principle IX: Agent-Driven Collaboration

**Score**: 8/9 principles satisfied

---

## 🟡 Warnings

1. **Type Safety**: 2 'any' types found
   - File: `app/posts/_hooks/usePosts.ts`
   - Lines: 23, 45
   - Fix: Replace with proper TypeScript types

2. **Documentation**: Missing JSDoc for 3 public methods
   - `PostsRepository.getPosts()`
   - `PostsRepository.createPost()`
   - `PostsRepository.updatePost()`

## 🟢 Suggestions

1. **Performance**: Memoize expensive calculations in `PostsList` component
2. **Accessibility**: Add aria-labels to interactive elements
3. **Testing**: Add edge case tests for empty states

---

## Next Steps

**Status**: ✅ APPROVED WITH WARNINGS

✅ **Can Proceed to PR**

**Recommended Before Merge**:

1. Fix 'any' types (5 minutes)
2. Add JSDoc comments (10 minutes)

**Optional Improvements**:

- Performance optimizations
- Accessibility enhancements
- Additional edge case tests
```

## Severity Levels

### 🔴 Critical (Blocks PR)

- Test failures
- TypeScript errors
- ESLint errors
- Constitution violations (Principles I, II, III, VIII)
- Spec misalignment

### 🟡 Warning (Should Fix)

- Debug code
- 'any' types
- Missing tests
- Low coverage (below thresholds)
- Documentation gaps

### 🟢 Suggestion (Nice to Have)

- Performance optimizations
- Accessibility improvements
- Code style preferences
- Additional test cases

## Dependencies

### Foundation Commands (Layer 1)

- None (spec analysis fully integrated)

### Skills (Layer 2)

- `skill:check-team-codex` - Team Codex validation
- `skill:validate-architecture` - DDD architecture validation

### External Tools

- `npm test` - Test execution
- `npm run test:coverage` - Coverage report
- `npm run lint` - ESLint
- `npx tsc --noEmit` - TypeScript check

## Related Skills

- `spec` - SDD Phase 1-3
- `implement` - ADD Phase 4
- `spike` - Technical exploration
- `constitution` - Constitution management

## Constitution Compliance

- **All 9 Principles**: Comprehensive validation
- Non-negotiable principles flagged as CRITICAL
- Violations block PR approval

## Critical Rules

1. **Never Auto-Fix**: Always report, never fix automatically
2. **Constitution Authority**: Principles are non-negotiable
3. **Spec Analysis First**: Integrated spec compliance check runs first
4. **Actionable Feedback**: Provide file/line references
5. **Approval Criteria**: No critical issues = APPROVED

## Error Handling

If verification fails:

1. Generate comprehensive report
2. Categorize by severity (Critical/Warning/Suggestion)
3. Provide specific fix recommendations with file/line refs
4. Return REJECTED status
5. Agent decides fix strategy

## Return Values

```typescript
{
  status: "APPROVED" | "APPROVED_WITH_WARNINGS" | "REJECTED",
  criticalIssues: number,
  warnings: number,
  suggestions: number,
  report: string, // Markdown formatted
  layers: {
    spec: { passed: boolean, issues: string[] },
    codex: { passed: boolean, issues: string[] },
    architecture: { passed: boolean, issues: string[] },
    supabase: { passed: boolean, issues: string[] },
    tests: { passed: boolean, coverage: object },
    browserTest: {
      passed: boolean,
      skipped: boolean,
      mcp: "playwright" | "chrome-devtools" | null,
      issues: string[]
    },
    constitution: { passed: boolean, score: string }
  }
}
```

## Performance

- **Full verification**: ~2-3 minutes
- **Quick check** (no tests): ~30 seconds
- **Spec-only**: ~15 seconds

## Success Criteria

This skill succeeds when:

- ✅ All 6 verification layers complete
- ✅ Report generated with actionable feedback
- ✅ Status determined (APPROVED/APPROVED_WITH_WARNINGS/REJECTED)
- ✅ No false positives in critical issues
- ✅ All file/line references accurate
