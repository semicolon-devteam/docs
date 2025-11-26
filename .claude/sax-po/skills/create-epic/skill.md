---
name: create-epic
description: Create Epic issue in docs repository. Use when (1) epic-master needs to create new Epic from PO/기획자 requirements, (2) migrating Epic from another repository, (3) converting requirements into GitHub Issue with epic-template. Connects to GitHub Projects and applies epic label.
---

# create-epic Skill

> Epic 이슈를 docs 레포지토리에 생성하는 스킬

## 개요

PO/기획자가 정의한 요구사항을 GitHub Issue로 생성합니다.

## 트리거

- `epic-master` 에이전트에서 호출
- 명시적 호출: `skill:create-epic`

## SAX 메시지

```markdown
[SAX] Skill: create-epic 사용
```

## 입력

epic-master로부터 전달받는 정보:

```yaml
domain_name: string      # 도메인명 (예: Comments)
domain_description: string
problems: string[]       # 해결하려는 문제
benefits: string[]       # 기대 효과
user_stories:
  required: string[]     # 필수 User Stories
  optional: string[]     # 선택 User Stories
acceptance_criteria: string[]
target_repos: string[]   # 대상 레포지토리
dependencies: string[]
priority: string         # High/Medium/Low
complexity: string       # High/Medium/Low
```

## 동작

### 1. 템플릿 로드

```bash
# 템플릿 경로
.claude/sax-po/templates/epic-template.md
```

### 2. 템플릿 렌더링

입력 데이터로 템플릿의 플레이스홀더 치환

### 3. GitHub Issue 생성

```bash
gh issue create \
  --repo semicolon-devteam/docs \
  --title "[Epic] {DOMAIN_NAME} · {short_description}" \
  --body "{rendered_template}" \
  --label "epic"
```

### 4. Projects 연동

```bash
# 이슈를 프로젝트에 추가
gh project item-add {PROJECT_NUMBER} \
  --owner semicolon-devteam \
  --url {issue_url}

# 타입 필드를 "에픽"으로 설정
gh project item-edit \
  --project-id {PROJECT_ID} \
  --id {ITEM_ID} \
  --field-id {TYPE_FIELD_ID} \
  --single-select-option-id {EPIC_OPTION_ID}
```

## 출력

```markdown
## ✅ Epic 생성 완료

**이슈 번호**: #{issue_number}
**이슈 URL**: https://github.com/semicolon-devteam/docs/issues/{issue_number}
**도메인**: {domain_name}
**프로젝트**: 이슈관리 (연동 완료)

### 다음 단계

1. **Spec 초안 생성** (선택):
   > "Spec 초안도 작성해줘"

2. **개발자에게 전달**:
   - 개발자가 대상 레포에서 브랜치 생성
   - `/speckit.specify` 실행하여 spec.md 보완

3. **진행도 확인**:
   - [GitHub Projects 바로가기](https://github.com/orgs/semicolon-devteam/projects/1)
```

## 에러 처리

### 권한 오류

```markdown
[SAX] Error: create-epic 실패 → GitHub API 권한 없음

⚠️ docs 레포지토리에 Issue 생성 권한이 필요합니다.
```

### 중복 Epic

```markdown
[SAX] Warning: 유사한 Epic이 존재합니다

기존 Epic: #{existing_number} - {existing_title}

- 새로 생성하려면: "그래도 생성해줘"
- 기존 Epic 사용: "기존 Epic 사용할게"
```

## 제약 사항

- docs 레포지토리에만 Epic 생성
- 기술 상세는 포함하지 않음
- Projects 연동은 선택적 (실패해도 Epic은 생성됨)

## 참조

- [Epic Template](../templates/epic-template.md)
- [epic-master Agent](../agents/epic-master.md)
