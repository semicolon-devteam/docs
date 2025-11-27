---
name: detect-project-from-epic
description: Detect project labels from source Epic during migration. Use when (1) migrating Epic from another repository (command-center → docs), (2) need to preserve project categorization (오피스/랜드/정치판/코인톡), (3) auto-detect project before assign-project-label skill.
tools: [Bash, GitHub CLI]
---

# detect-project-from-epic Skill

> 이식할 Epic의 프로젝트 라벨 감지

## Purpose

Epic 이식 시 원본 Epic의 프로젝트 라벨을 자동 감지하여 새 Epic에 동일한 프로젝트를 적용합니다.

## Project Labels

| 라벨 | 프로젝트 |
|------|----------|
| `오피스` | cm-office |
| `랜드` | cm-land |
| `정치판` | cm-politics |
| `코인톡` | cm-cointalk |

## Quick Command

```bash
# 프로젝트 라벨 필터링
PROJECT_LABEL=$(gh api repos/{source_org}/{source_repo}/issues/{epic_number} \
  --jq '.labels[] | select(.name == "오피스" or .name == "랜드" or .name == "정치판" or .name == "코인톡") | .name')
```

## SAX Message

```markdown
[SAX] Skill: detect-project-from-epic 사용
[SAX] Reference: {source_repo}#{epic_number} 참조
```

## Related

- [epic-master Agent](../../agents/epic-master.md)
- [assign-project-label Skill](../assign-project-label/SKILL.md)

## References

For detailed documentation, see:

- [Detection Process](references/detection-process.md) - 상세 프로세스, Epic 이식 워크플로우
- [Output Format](references/output-format.md) - 성공/실패 출력, 에러 처리
