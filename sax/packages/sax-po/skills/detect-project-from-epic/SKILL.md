---
name: detect-project-from-epic
description: Detect project labels from source Epic during migration. Use when (1) migrating Epic from another repository (command-center → docs), (2) need to preserve project categorization (오피스/랜드/정치판/코인톡), (3) auto-detect project before assign-project-label skill.
---

# detect-project-from-epic Skill

> 이식할 Epic의 프로젝트 라벨 감지

## Purpose

Epic 이식 시 원본 Epic의 프로젝트 라벨을 자동 감지하여 새 Epic에 동일한 프로젝트를 적용합니다.

## Process

### 1. 원본 Epic Labels 조회

```bash
# 원본 Epic의 모든 라벨 조회
gh api repos/{source_org}/{source_repo}/issues/{epic_number} \
  --jq '.labels[] | .name'
```

### 2. 프로젝트 라벨 추출

**프로젝트 라벨 목록**:
- `오피스`
- `랜드`
- `정치판`
- `코인톡`

**추출 로직**:
```bash
# 프로젝트 라벨만 필터링
PROJECT_LABEL=$(gh api repos/{source_org}/{source_repo}/issues/{epic_number} \
  --jq '.labels[] | select(.name == "오피스" or .name == "랜드" or .name == "정치판" or .name == "코인톡") | .name')
```

### 3. 감지 결과 반환

**성공 시**:
```json
{
  "detected": true,
  "project_label": "오피스",
  "project_name": "cm-office"
}
```

**프로젝트 라벨 없음**:
```json
{
  "detected": false,
  "project_label": null,
  "project_name": null
}
```

## Output Format

### 프로젝트 감지 성공

```markdown
✅ **프로젝트 감지 완료**

**원본 Epic**: {source_repo}#{epic_number}
**프로젝트**: {project_name}
**라벨**: `{project_label}`

→ 새 Epic에 동일한 프로젝트 라벨을 적용합니다.
```

### 프로젝트 감지 실패

```markdown
⚠️ **프로젝트 라벨 미감지**

원본 Epic에 프로젝트 라벨이 없습니다.

**다음 단계**: assign-project-label Skill로 수동 선택 필요
```

## Integration with epic-master

### Epic 이식 워크플로우

```markdown
1. 원본 Epic 읽기
2. **detect-project-from-epic** 실행
3. Epic 내용 복사
4. docs 레포에 새 Epic 생성
5. 감지된 프로젝트 라벨 적용 (또는 assign-project-label로 수동 선택)
6. GitHub Projects 연결
```

## SAX Message

```markdown
[SAX] Skill: detect-project-from-epic 사용

[SAX] Reference: {source_repo}#{epic_number} 참조
```

## Error Handling

### API 오류

```markdown
⚠️ **Epic 조회 실패**

{error_message}

원본 Epic URL을 확인하고 다시 시도해주세요.
```

### 여러 프로젝트 라벨

```markdown
⚠️ **복수 프로젝트 라벨 감지**

원본 Epic에 여러 프로젝트 라벨이 있습니다:
- `{label_1}`
- `{label_2}`

**다음 단계**: assign-project-label로 올바른 프로젝트 선택 필요
```

## Related

- [epic-master Agent](../../agents/epic-master.md)
- [assign-project-label Skill](../assign-project-label/SKILL.md)
- [create-epic Skill](../create-epic/skill.md)
