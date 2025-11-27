---
name: check-team-codex
description: Validate code against Semicolon Team Codex rules. Use when (1) before committing code, (2) during code review process, (3) after implementation for quality gate, (4) CI/CD automated quality check, (5) onboarding new team members to team standards.
tools: [Bash, Read, Grep]
---

# Check Team Codex Skill

> 코드를 Semicolon 팀 표준에 맞게 자동 검증

## Purpose

Semicolon Team Codex에 정의된 팀 표준에 따라 코드를 자동으로 검증하여 모든 프로젝트의 일관성과 품질을 보장합니다.

## When to Use

- **Before committing**: Pre-commit 검증
- **During code review**: 표준 준수 확인
- **After implementation**: Quality gate 검증
- **CI/CD integration**: 자동화된 품질 체크
- **Onboarding**: 신규 팀원 표준 학습 지원

## Quick Start

```bash
# 커밋 전 필수 체크 (Pre-commit)
npm run lint && npx tsc --noEmit

# 전체 검증 (Pre-PR)
npm run lint && npx tsc --noEmit && npm test

# 디버그 코드 확인
grep -r "console\.log\|debugger" src/ --exclude-dir=node_modules --exclude="*.test.*"
```

**기대 결과**:

- ✅ ESLint: 0 errors, 0 warnings
- ✅ TypeScript: 0 errors
- ✅ No debug code found

## Advanced Usage

상세한 규칙과 검증 방법은 다음을 참조하세요:

- **[Team Codex Rules](references/codex-rules.md)** - Git 컨벤션, 코드 품질, DDD 아키텍처 규칙
- **[Validation Checks](references/validation-checks.md)** - 6가지 검증 항목 및 bash 명령어
- **[Execution Flow](references/execution-flow.md)** - Quick/Full/CI-CD 검증 워크플로우 및 출력 형식
- **[Integration Examples](references/integration.md)** - Git Hook, VS Code Task, Package.json 통합 예제

## SAX Message

```markdown
[SAX] Skill: check-team-codex 사용

[SAX] Reference: Team Codex 규칙 (Git/Code/DDD/Test) 참조
```

## Related

- [Team Codex Wiki](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [DDD Architecture Guide](../../CLAUDE.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
