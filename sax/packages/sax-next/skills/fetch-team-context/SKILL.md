---
name: fetch-team-context
description: Fetch Semicolon team standards and processes from docs wiki. Provides context for workflow decisions, DevOps strategies, and team conventions. Used by Advisor agent.
---

# Fetch Team Context Skill

**Purpose**: Retrieve Semicolon team standards, processes, and conventions from docs wiki for informed decision-making

## When to Use

Agents should invoke this skill when:

- Providing workflow or process advice
- Recommending DevOps strategies
- Checking team conventions before suggesting changes
- Validating recommendations against team standards
- Answering questions about team processes

## What It Does

### 1. Identify Required Context

Determine which docs wiki pages are relevant:

| Topic             | Wiki Page              | URL                                                                          |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------- |
| **Git & Commits** | Team Codex             | https://github.com/semicolon-devteam/docs/wiki/Team-Codex                    |
| **Code Quality**  | Team Codex             | https://github.com/semicolon-devteam/docs/wiki/Team-Codex                    |
| **Workflow**      | Collaboration Process  | https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process         |
| **Architecture**  | Development Philosophy | https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy        |
| **Estimation**    | Estimation Guide       | https://github.com/semicolon-devteam/docs/wiki/Estimation-Guide              |
| **Epic Creation** | Process Phase 1        | https://github.com/semicolon-devteam/docs/wiki/Process-Phase-1-Epic-Creation |
| **Task Creation** | Process Phase 2        | https://github.com/semicolon-devteam/docs/wiki/Process-Phase-2-Task-Creation |
| **Development**   | Process Phase 3        | https://github.com/semicolon-devteam/docs/wiki/Process-Phase-3-Development   |
| **Deployment**    | Process Phase 4        | https://github.com/semicolon-devteam/docs/wiki/Process-Phase-4-Deployment    |

### 2. Fetch via GitHub API

```bash
# List all wiki pages
gh api repos/semicolon-devteam/docs/contents | jq '.[].name'

# Fetch specific wiki content (if available via API)
# Note: GitHub Wiki pages may require web_fetch for content
```

### 3. Web Fetch Fallback

If GitHub API doesn't provide wiki content:

```javascript
// Use web_fetch tool
web_fetch({
  url: "https://github.com/semicolon-devteam/docs/wiki/Team-Codex",
  extract: "main content",
});
```

### 4. Extract Key Information

Parse fetched content for:

- **Rules**: MUST, SHOULD, MUST NOT patterns
- **Conventions**: Naming, formatting, structure
- **Processes**: Step-by-step workflows
- **Examples**: Code snippets, command examples

## Context Categories

### Team Codex Context

```markdown
## Team Codex Summary

### Git & Commit Rules

- Commit format: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore
- NEVER use --no-verify

### Code Quality Rules

- ESLint: 0 errors, 0 warnings
- TypeScript: 0 errors (strict mode)
- No debug code in commits
- No 'any' types

### Branch Strategy

- main/master: protected
- feature/{domain}-{feature}: feature branches
- fix/{issue-number}: bug fixes
```

### Collaboration Process Context

```markdown
## Collaboration Process Summary

### Workflow Stages

1. Epic Creation (command-center)
2. Specification (SDD Phase 1-3)
3. Task Generation
4. Implementation (ADD Phase 4)
5. Verification
6. PR & Review
7. Deployment

### Epic → Task Flow

- Epic: High-level feature description
- Spec: Detailed requirements (spec.md)
- Plan: Technical approach (plan.md)
- Tasks: Actionable items (tasks.md)
- Issues: GitHub Issues for tracking
```

### Development Philosophy Context

```markdown
## Development Philosophy Summary

### Architecture Principles

- DDD 4-Layer: repositories, api-clients, hooks, components
- SSR-First: Server Components by default
- 1-Hop Rule: Browser → Backend direct

### Technology Stack

- Frontend: Next.js 15, React 19
- Backend: Supabase (dev), Spring Boot (prod)
- State: React Query (server), Zustand (client)
- Testing: Vitest, Testing Library
```

## Usage

```javascript
// Fetch specific context
skill: fetchTeamContext({ topic: "git-commits" });

// Fetch multiple contexts
skill: fetchTeamContext({ topics: ["workflow", "code-quality"] });

// Fetch all relevant context
skill: fetchTeamContext({ comprehensive: true });
```

## Output Format

```markdown
# Team Context: [Topic]

## Source

- Wiki: [Page Name]
- URL: [URL]
- Last Updated: [If available]

## Key Rules

### MUST (Required)

- [Rule 1]
- [Rule 2]

### SHOULD (Recommended)

- [Recommendation 1]
- [Recommendation 2]

### MUST NOT (Prohibited)

- [Prohibition 1]
- [Prohibition 2]

## Examples

### Good Example
```

[Code or command example]

```

### Bad Example
```

[What to avoid]

```

## Related Topics
- [Related Topic 1]
- [Related Topic 2]
```

## Quick Reference Cache

For efficiency, maintain quick reference for common queries:

### Git Conventions Quick Ref

```yaml
commit_types:
  - feat: 새로운 기능
  - fix: 버그 수정
  - docs: 문서 변경
  - style: 코드 스타일 (포맷팅)
  - refactor: 리팩토링
  - test: 테스트 추가/수정
  - chore: 빌드, 설정 변경

commit_format: "type(scope): subject"
commit_rules:
  - 제목은 50자 이내
  - 본문은 72자에서 줄바꿈
  - 이슈 번호 연결 권장

branch_format: "feature/{domain}-{feature}"
```

### Workflow Quick Ref

```yaml
phases:
  sdd_phase_1: "specify → spec.md"
  sdd_phase_2: "plan → plan.md"
  sdd_phase_3: "tasks → tasks.md"
  add_phase_4:
    - "v0.0.x CONFIG"
    - "v0.1.x PROJECT"
    - "v0.2.x TESTS"
    - "v0.3.x DATA"
    - "v0.4.x CODE"
  phase_5: "verify → PR"
```

### Quality Quick Ref

```yaml
quality_gates:
  eslint: "0 errors, 0 warnings"
  typescript: "0 errors (strict)"
  tests: "80%+ coverage"
  debug_code: "none allowed"
  any_types: "avoid, use explicit types"
  pre_commit_hooks: "NEVER bypass"
```

## Dependencies

- `gh api` - GitHub API access
- `web_fetch` - Web content retrieval (fallback)
- docs wiki - Source of truth

## Related Skills

- `check-team-codex` - Uses this for code quality rules
- `create-issues` - Uses this for issue conventions
- `implement` - Uses this for development workflow

## Error Handling

### Wiki Access Failure

````markdown
⚠️ docs wiki 접근에 실패했습니다.

**대안 1**: GitHub API 직접 조회

```bash
gh api repos/semicolon-devteam/docs/contents
```
````

**대안 2**: 캐시된 Quick Reference 사용 (최신 아닐 수 있음)

**대안 3**: 사용자에게 직접 확인 요청

````

### Content Parse Failure

1. Report which section failed to parse
2. Return raw content for manual review
3. Use cached quick reference as fallback

## Return Values

```javascript
{
  status: "success" | "partial" | "cached" | "failed",
  topics: ["git-commits", "workflow"],
  content: {
    "git-commits": {
      source: "Team Codex",
      url: "...",
      rules: [...],
      examples: [...]
    },
    "workflow": {
      source: "Collaboration Process",
      url: "...",
      stages: [...],
      details: [...]
    }
  },
  quickRef: { ... },
  fetchedAt: "2025-01-20T10:30:00Z"
}
````

## Critical Rules

1. **docs wiki is Source of Truth**: Always prefer wiki over cached data
2. **Explicit Over Implicit**: If wiki doesn't specify, don't assume
3. **Version Awareness**: Note if wiki content seems outdated
4. **Fallback Gracefully**: Use quick reference if wiki unavailable
5. **Attribution**: Always cite source URL in responses
6. **문서 유효성 검증 필수**: docs 레포지토리 문서 참조 시 404 응답이면 반드시 사용자에게 알림
   - 검증 방법: `gh api repos/semicolon-devteam/docs/contents/{path}` 또는 web_fetch
   - 실패 시 출력 형식:
     ```
     ⚠️ **문서 참조 실패**
     - 참조 문서: {document_name}
     - 예상 경로: {url}
     - 상태: 404 Not Found (문서가 이동되었거나 삭제됨)
     - 권장 조치: docs 레포지토리에서 최신 문서 목록 확인
     ```
