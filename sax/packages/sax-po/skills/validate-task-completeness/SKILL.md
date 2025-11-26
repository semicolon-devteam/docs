# validate-task-completeness Skill

> Draft Task 필수 항목 검증

## Purpose

생성된 Draft Task가 모든 필수 항목을 포함하고 있는지 검증합니다.

## 필수 항목 체크리스트

1. ✅ Epic 링크 (Sub-issue 관계)
2. ✅ Acceptance Criteria 섹션
3. ✅ Estimation 체크리스트 + 총합
4. ✅ 브랜치 명
5. ✅ `draft` 라벨
6. ✅ Projects '작업량' 필드

## Process

```bash
# Issue 내용 조회
gh api repos/{owner}/{repo}/issues/{issue_number}

# Projects 필드 확인 (GraphQL)
gh api graphql -f query='...'
```

## Output Format

### 검증 성공

```json
{
  "is_valid": true,
  "missing_items": [],
  "warnings": []
}
```

### 검증 실패

```json
{
  "is_valid": false,
  "missing_items": ["Acceptance Criteria", "브랜치 명"],
  "warnings": ["Projects '작업량' 필드 미설정"]
}
```

## SAX Message

```markdown
[SAX] Skill: validate-task-completeness 사용
```

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
