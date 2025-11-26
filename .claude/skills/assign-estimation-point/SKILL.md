# assign-estimation-point Skill

> Estimation Guide 기반 Point 측정 및 할당

## Purpose

Wiki의 Estimation Guide를 기반으로 Epic 내용을 분석하여 작업 포인트를 측정하고, Draft Task에 체크리스트 형태로 할당합니다.

## Triggers

- draft-task-creator가 Draft Task 생성 시 자동 호출
- 각 Task별 작업량 측정 필요 시

## Process

### 1. Estimation Guide 조회

```bash
# Wiki에서 Estimation Guide 조회
gh api repos/semicolon-devteam/docs/contents/wiki/Estimation-Guide.md \
  --jq '.content' | base64 -d
```

또는 Wiki URL 직접 참조:
https://github.com/semicolon-devteam/docs/wiki/Estimation-Guide

### 2. Epic/Task 내용 분석

- User Stories 추출
- 기술 복잡도 파악
- 작업 범위 확인 (UI, API, 데이터베이스 등)

### 3. Estimation 항목 매칭

Estimation Guide의 항목과 Task 내용을 매칭하여 해당하는 항목에 체크:

**예시** (Guide 항목):
- 간단한 UI 컴포넌트 퍼블리싱 (1점)
- organisms UI 컴포넌트 구현 (3점)
- 기본적인 Form 작업 및 연동 (5점)
- API 엔드포인트 구현 (CRUD) (3점)
- 복잡한 비즈니스 로직 구현 (5점)
- 데이터베이스 마이그레이션 작성 (2점)
- 테스트 코드 작성 (작업 포인트의 30%)

### 4. 체크리스트 생성

```markdown
## 📊 Estimation (작업량 측정)

- [ ] 간단한 UI 컴포넌트 퍼블리싱 (1점)
- [x] organisms UI 컴포넌트 구현 (3점)
- [x] 기본적인 Form 작업 및 연동 (5점)
- [ ] API 엔드포인트 구현 (CRUD) (3점)
- [ ] 복잡한 비즈니스 로직 구현 (5점)
- [x] 데이터베이스 마이그레이션 작성 (2점)
- [ ] 테스트 코드 작성 (작업 포인트의 30%)

**총합**: 10점
```

### 5. GitHub Projects '작업량' 필드 업데이트

```bash
# GitHub Projects API로 '작업량' 필드에 총합 입력
# (GraphQL API 사용)
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "{project_id}"
        itemId: "{item_id}"
        fieldId: "{field_id}"
        value: {
          number: 10
        }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }
'
```

## Output Format

### Draft Task 본문에 추가

```markdown
## 📊 Estimation (작업량 측정)

### 작업 항목

- [x] organisms UI 컴포넌트 구현 (3점)
- [x] 기본적인 Form 작업 및 연동 (5점)
- [x] 데이터베이스 마이그레이션 작성 (2점)

### 총 작업량

**Point**: 10점
**예상 기간**: 2일 (1 Point = 0.5일 기준)
```

### JSON Output

```json
{
  "total_points": 10,
  "checked_items": [
    {"name": "organisms UI 컴포넌트 구현", "point": 3},
    {"name": "기본적인 Form 작업 및 연동", "point": 5},
    {"name": "데이터베이스 마이그레이션 작성", "point": 2}
  ],
  "estimated_days": 5.0,
  "projects_field_updated": true
}
```

## SAX Message

```markdown
[SAX] Skill: assign-estimation-point 사용

[SAX] Reference: docs/wiki/Estimation-Guide 참조
```

## Notes

### Estimation Guide 구조 파악

Guide는 일반적으로 다음 카테고리로 구성됩니다:

1. **프론트엔드 작업**
   - UI 컴포넌트 (atoms: 1점, molecules: 2점, organisms: 3점)
   - 페이지 구현 (간단: 3점, 중간: 5점, 복잡: 8점)
   - Form 작업 (기본: 5점, 복잡: 8점)
   - 상태 관리 (간단: 2점, 복잡: 5점)

2. **백엔드 작업**
   - API 엔드포인트 (CRUD: 3점, 복잡: 5점)
   - 비즈니스 로직 (간단: 3점, 복잡: 5점, 매우 복잡: 8점)
   - 데이터베이스 (마이그레이션: 2점, 복잡한 쿼리: 3점)
   - 인증/권한 (기본: 5점, 복잡: 8점)

3. **공통 작업**
   - 테스트 작성 (전체 작업의 30%)
   - 문서화 (1-2점)
   - 코드 리뷰 대응 (전체 작업의 10%)

### Point → 시간 변환 (참고)

- **1 Point = 0.5일** (4시간)
- **5 Points = 2.5일** (하루 8시간 기준)
- **10 Points = 1주** (5일)

### 자동 매칭 로직

Epic/Task 키워드로 자동 판단:

| 키워드 | Estimation 항목 |
|--------|----------------|
| "버튼", "아이콘", "텍스트" | atoms UI (1점) |
| "카드", "리스트 아이템" | molecules UI (2점) |
| "폼", "테이블", "네비게이션" | organisms UI (3점) |
| "페이지", "화면" | 페이지 구현 (3-8점) |
| "API", "엔드포인트" | API 구현 (3-5점) |
| "데이터베이스", "마이그레이션" | DB 작업 (2-3점) |
| "인증", "권한" | 인증/권한 (5-8점) |

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
- [Estimation Guide Wiki](https://github.com/semicolon-devteam/docs/wiki/Estimation-Guide)
- [estimate-epic-timeline Skill](../estimate-epic-timeline/SKILL.md)
