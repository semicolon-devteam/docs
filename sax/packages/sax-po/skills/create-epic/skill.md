---
name: create-epic
description: Create Epic issue in docs repository. Use when (1) epic-master needs to create new Epic from PO/기획자 requirements, (2) migrating Epic from another repository, (3) converting requirements into GitHub Issue with epic-template.
tools: [Bash, Read, GitHub CLI]
---

# create-epic Skill

> Epic 이슈를 docs 레포지토리에 생성하는 스킬

## 개요

PO/기획자가 정의한 요구사항을 GitHub Issue로 생성합니다.

## 트리거

- `epic-master` 에이전트에서 호출
- 명시적 호출: `skill:create-epic`

## Quick Start

```bash
# 1. 템플릿 로드
.claude/sax-po/templates/epic-template.md

# 2. GitHub Issue 생성
gh issue create \
  --repo semicolon-devteam/docs \
  --title "[Epic] {DOMAIN_NAME} · {short_description}" \
  --body "{rendered_template}" \
  --label "epic"

# 3. Projects 연동
gh project item-add {PROJECT_NUMBER} \
  --owner semicolon-devteam \
  --url {issue_url}
```

## 제약 사항

- docs 레포지토리에만 Epic 생성
- 기술 상세는 포함하지 않음
- Projects 연동은 선택적 (실패해도 Epic은 생성됨)

## SAX Message

```markdown
[SAX] Skill: create-epic 사용
```

## Related

- [Epic Template](../templates/epic-template.md)
- [epic-master Agent](../agents/epic-master.md)

## References

For detailed documentation, see:

- [Workflow](references/workflow.md) - 입력 스키마, 상세 동작 프로세스
- [Output Format](references/output-format.md) - 성공 출력, 에러 처리
