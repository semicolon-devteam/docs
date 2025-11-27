---
name: check-backend-duplication
description: Check for duplicate backend implementation in core-backend. Use when (1) Epic analysis detects backend work (API, server, database keywords), (2) draft-task-creator creates backend tasks, (3) need to verify if similar functionality exists in core-backend domain services.
tools: [Bash, Read, GitHub CLI]
---

# check-backend-duplication Skill

> core-backend 중복 구현 체크

## Purpose

Epic에서 백엔드 작업이 감지되었을 때, core-backend에 이미 유사 기능이 구현되어 있는지 확인합니다.

## Triggers

- Epic 내용에 백엔드 작업 키워드 감지
- "API", "서버", "데이터베이스", "RPC", "엔드포인트" 등

## Check Scope

**도메인 + Service 레벨 중복 체크**:

1. **도메인 레벨**: Epic 분석 → 관련 도메인 파악
2. **Service 레벨**: 해당 도메인의 Service 클래스에서 유사 기능 검색

## Quick Commands

```bash
# core-backend 도메인 목록 확인
gh api repos/semicolon-devteam/core-backend/contents/src/main/kotlin/com/semicolon/corebackend/domain \
  --jq '.[] | select(.type == "dir") | .name'

# Service 클래스 목록
gh api repos/semicolon-devteam/core-backend/contents/src/main/kotlin/com/semicolon/corebackend/domain/{domain}/service \
  --jq '.[] | select(.name | endswith(".kt")) | .name'
```

## SAX Message

```markdown
[SAX] Skill: check-backend-duplication 사용
[SAX] Reference: core-backend/domain/{domain}/service 참조
```

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
- [Epic Template](../../templates/epic-template.md)

## References

For detailed documentation, see:

- [Check Process](references/check-process.md) - 상세 프로세스, 검색 로직
- [Output Format](references/output-format.md) - 중복 발견/없음 JSON, Epic 코멘트 예시
