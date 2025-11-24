---
name: implement
description: Execute ADD Phase 4 with phased development (v0.0.x → v0.4.x). Implements DDD 4-layer architecture with TDD and Supabase patterns. Used by agents when implementation is needed.
---

# Implement Skill

**Purpose**: Orchestrate Agent-Driven Development (ADD) Phase 4 implementation workflow

## When to Use

Agents should invoke this skill when:

- Specification (spec.md, plan.md, tasks.md) is complete
- User requests feature implementation
- Code needs to follow DDD 4-layer architecture
- Test-Driven Development is required
- Supabase integration patterns needed

## What It Does

Executes phased implementation with **approval gates**:

### **v0.0.x - CONFIG**

- Check dependencies from plan.md
- Install required packages
- Suggest `skill:spike` if technical approach unclear
- Request agent approval to proceed

### **v0.1.x - PROJECT**

- Scaffold DDD 4-layer structure
- Create domain directories with `__tests__/`
- Set up `index.ts` exports
- Request agent approval to proceed

### **v0.2.x - TESTS** (TDD - Critical Phase)

- Write Repository tests (mock Supabase)
- Write Hook tests (mock API clients)
- Write Component tests (mock hooks)
- Tests FAIL initially (no implementation yet)
- Request agent approval to proceed

### **v0.3.x - DATA**

- Create type definitions in `models/`
- Verify Supabase schema in core-supabase
- Generate database types
- Request agent approval to proceed

### **v0.4.x - CODE**

- Implement Repository (invoke `skill:fetch-supabase-example`)
- Implement API Client (Factory Pattern)
- Implement Hooks (React Query)
- Implement Components (6 standard components)
- Tests START PASSING
- Run quality checks (invoke `skill:check-team-codex`)

### **Report Completion**

- Test results (should be 100% passing)
- Code quality status
- Constitution compliance
- Next steps

## Usage

```javascript
// Agent invokes this skill
skill: implement();

// Skill executes phased workflow with approval gates:
// v0.0.x CONFIG → approval → v0.1.x PROJECT → approval →
// v0.2.x TESTS → approval → v0.3.x DATA → approval →
// v0.4.x CODE → completion report
```

## Phase Gate Control

At each phase boundary, skill requests agent approval:

```
✅ Phase v0.1.x Complete: PROJECT

Created Structure:
app/posts/
├── _repositories/__tests__/ ✅
├── _api-clients/            ✅
├── _hooks/__tests__/        ✅
└── _components/__tests__/   ✅

Ready for v0.2.x (TESTS):
- Write tests BEFORE implementation
- Test-Driven Development approach

⚠️ CRITICAL: Next phase writes tests first.
Constitution Principle III requires tests before code.

Agent: Approve proceeding to v0.2.x? (yes/no)
```

## Output Format

```
✅ Implementation Complete: [Feature Name]

**Phase Results**:
- v0.0.x CONFIG: ✅ Dependencies installed
- v0.1.x PROJECT: ✅ DDD structure scaffolded
- v0.2.x TESTS: ✅ 15 tests written
- v0.3.x DATA: ✅ Models and types defined
- v0.4.x CODE: ✅ All 4 layers implemented

**Test Results**:
- Repository: 5/5 passing ✅
- Hooks: 6/6 passing ✅
- Components: 4/4 passing ✅
- Total: 15/15 tests (100%)

**Code Quality**:
- ESLint: ✅ Passed
- TypeScript: ✅ Passed

**Constitution Compliance**:
- DDD Architecture (I): ✅
- SSR-First (II): ✅
- Test-Driven Quality (III): ✅
- Spec-Driven Development (VIII): ✅

**Branch**: feature/posts-comments
**Location**: app/posts/

Next Steps:
- skill:verify for comprehensive check
- Review against spec.md
- Create PR when ready
```

## Dependencies

- `skill:fetch-supabase-example` - Fetch core-supabase patterns
- `skill:scaffold-domain` - Create DDD structure
- `skill:check-team-codex` - Validate code quality
- `/speckit.implement` - spec-kit implementation task execution

## Related Skills

- `spec` - SDD Phase 1-3 specification
- `verify` - Phase 5 verification
- `spike` - Technical exploration

## Constitution Compliance

- **Principle I**: DDD Architecture (4-layer structure)
- **Principle II**: SSR-First Development
- **Principle III**: Test-Driven Quality (v0.2.x before v0.4.x) (NON-NEGOTIABLE)
- **Principle VIII**: Spec-Driven Development
- **Principle IX**: Agent-Driven Collaboration (phased execution)

## Critical Rules

1. **Phase Discipline**: NEVER skip phases without agent approval
2. **TDD Enforcement**: v0.2.x (TESTS) MUST complete before v0.4.x (CODE)
3. **Supabase Patterns**: ALWAYS invoke `skill:fetch-supabase-example`
4. **DDD Compliance**: All 4 layers MUST be implemented
5. **Quality Gates**: Tests and code quality must pass before completion
6. **Atomic Commits**: 작업 단위를 최소화하여 중간중간 커밋
7. **Commit Format**: [Git Rules](https://github.com/semicolon-devteam/docs/wiki/rules-git) 준수 필수

## Commit Strategy (Atomic Commits)

작업 단위를 최소화하여 자주 커밋합니다:

### Phase별 커밋 시점

- **v0.0.x CONFIG**: 의존성 설치 후 커밋
- **v0.1.x PROJECT**: 각 도메인 디렉토리 생성 후 커밋
- **v0.2.x TESTS**: 레이어별 테스트 작성 후 커밋 (Repository, Hooks, Components 각각)
- **v0.3.x DATA**: 모델/타입 정의 후 커밋
- **v0.4.x CODE**: 레이어별 구현 후 커밋 (Repository, API Client, Hooks, Components 각각)

### Commit Message Format

**📚 Reference**: [Git Rules - Commit Messages](https://github.com/semicolon-devteam/docs/wiki/rules-git)

- 규칙 상세 내용은 위 링크 참조 (GIT-CM-xxx rules)
- 커밋 전 반드시 Git Rules 문서 확인

### 커밋 전 체크리스트

1. `npm run lint` 통과
2. `npx tsc --noEmit` 통과
3. 관련 테스트 통과
4. 커밋 메시지 형식 준수
5. `--no-verify` 사용 금지

## Error Handling

If any phase fails:

1. Report specific failure to agent
2. Provide diagnostic information
3. Suggest remediation
4. Do not proceed to next phase
5. Agent decides rollback or fix strategy

## Resume Capability

If interrupted, skill can resume from specific phase:

```javascript
skill: implement({ resume: "v0.3.x" });
```
