# generate-acceptance-criteria Skill

> Epic 기반 Acceptance Criteria 자동 생성

## Purpose

Epic의 User Stories를 분석하여 Draft Task의 Acceptance Criteria를 생성합니다.

## Process

1. Epic User Stories 추출
2. Task 범위 파악 (backend/frontend/design)
3. 테스트 가능한 완료 조건 생성

## Output Format

```markdown
## ✅ Acceptance Criteria (완료 조건)

- [ ] 사용자는 차단 버튼을 클릭할 수 있다
- [ ] 차단 확인 모달이 표시된다
- [ ] 확인 시 차단 API 호출 성공
- [ ] 차단된 사용자가 목록에서 표시된다
- [ ] 테스트 코드 작성 완료
- [ ] 린트 및 타입 체크 통과
```

## SAX Message

```markdown
[SAX] Skill: generate-acceptance-criteria 사용
```

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
- [Epic Template](../../templates/epic-template.md)
