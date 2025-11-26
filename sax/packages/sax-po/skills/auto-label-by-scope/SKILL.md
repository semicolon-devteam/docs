# auto-label-by-scope Skill

> Epic 범위 기반 자동 라벨링

## Purpose

Epic 내용과 생성된 Draft Tasks를 분석하여 자동으로 적절한 라벨을 할당합니다.

## 라벨 종류

- `backend`: core-backend 작업 포함
- `frontend`: 프론트엔드 작업 포함
- `design`: 디자인 작업 필요
- `fullstack`: backend + frontend 모두

## 판단 로직

### 1. Epic 본문 키워드 분석

- "API", "서버", "데이터베이스" → `backend`
- "UI", "화면", "컴포넌트" → `frontend`
- "디자인", "Figma" → `design`

### 2. Draft Tasks 분석

- core-backend Task 있으면 → `backend`
- 서비스 레포 Task 있으면 → `frontend`
- 둘 다 → `fullstack`

### 3. 디자인 필드 확인

- "디자인 작업 필요" 체크 → `design` 추가

## Output Format

```json
{
  "labels": ["fullstack", "design"],
  "reasoning": "백엔드 API + 프론트 UI + 디자인 필요"
}
```

## SAX Message

```markdown
[SAX] Skill: auto-label-by-scope 사용
```

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
