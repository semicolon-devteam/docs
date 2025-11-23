# sync-tasks Skill

> tasks.md를 GitHub Issues로 동기화하는 스킬

## 개요

speckit.tasks로 생성된 `tasks.md`를 GitHub Issues로 동기화하고,
Epic과 Sub-issues 관계를 연결합니다.

## 트리거

- 명시적 호출: `skill:sync-tasks`
- "이슈 동기화", "Tasks 생성", "GitHub에 반영"

## SAX 메시지

```markdown
[SAX] Skill: sync-tasks 사용
```

## 입력

### 필수 정보

```yaml
epic_number: number      # docs 레포의 Epic 이슈 번호
target_repo: string      # 대상 레포지토리 (예: cm-template)
tasks_path: string       # tasks.md 경로 (예: specs/001-comments/tasks.md)
```

### tasks.md 형식

```markdown
# Tasks

## v0.1.x PROJECT

- [ ] 도메인 디렉토리 생성
- [ ] index.ts export 설정

## v0.2.x TESTS

- [ ] CommentRepository 테스트 작성
- [ ] useComments 훅 테스트 작성

## v0.3.x DATA

- [ ] Comment 타입 정의
- [ ] API 인터페이스 정의

## v0.4.x CODE

- [ ] CommentRepository 구현
- [ ] CommentApiClient 구현
- [ ] useComments 훅 구현
- [ ] CommentList 컴포넌트 구현
```

## 동작

### 1. tasks.md 파싱

```typescript
interface Task {
  phase: string;        // v0.1.x, v0.2.x 등
  title: string;        // 태스크 제목
  completed: boolean;   // 체크 여부
}
```

### 2. GitHub Issues 생성

각 Phase를 하나의 Issue로 생성:

```bash
gh issue create \
  --repo semicolon-devteam/{target_repo} \
  --title "[Task] #{epic_number} · {phase} {phase_name}" \
  --body "{phase_tasks}" \
  --label "task"
```

### 3. Epic과 Sub-issues 연결

```bash
# GitHub CLI로 Sub-issues 관계 설정
# (GitHub API v4 GraphQL 사용)

gh api graphql -f query='
  mutation {
    addSubIssue(input: {
      issueId: "{EPIC_NODE_ID}"
      subIssueId: "{TASK_NODE_ID}"
    }) {
      issue { number }
    }
  }
'
```

### 4. Projects 연동

```bash
# 생성된 Task 이슈들을 프로젝트에 추가
gh project item-add {PROJECT_NUMBER} \
  --owner semicolon-devteam \
  --url {task_issue_url}

# 타입을 "태스크"로 설정
gh project item-edit ...
```

## 출력

```markdown
## ✅ Tasks 동기화 완료

**Epic**: semicolon-devteam/docs#{epic_number}
**대상 레포**: {target_repo}
**생성된 Issues**: {count}개

### 생성된 Task Issues

| Phase | Issue | 상태 |
|-------|-------|------|
| v0.1.x PROJECT | #{issue_1} | Open |
| v0.2.x TESTS | #{issue_2} | Open |
| v0.3.x DATA | #{issue_3} | Open |
| v0.4.x CODE | #{issue_4} | Open |

### 연결 상태

- ✅ Epic ← Sub-issues 연결 완료
- ✅ GitHub Projects 연동 완료

### 확인 링크

- [Epic 보기](https://github.com/semicolon-devteam/docs/issues/{epic_number})
- [Projects 보기](https://github.com/orgs/semicolon-devteam/projects/1)
```

## 동기화 전략

### 신규 생성

tasks.md의 모든 태스크를 새 Issue로 생성

### 업데이트 (재실행 시)

```markdown
⚠️ 기존 Issues 감지

이미 동기화된 Issues가 있습니다:
- #{existing_1} - v0.1.x PROJECT
- #{existing_2} - v0.2.x TESTS

**옵션**:
1. "업데이트해줘" - 기존 Issue 본문 업데이트
2. "새로 만들어줘" - 기존 무시하고 새로 생성
3. "취소" - 동기화 취소
```

### 완료된 태스크

tasks.md에서 `[x]`로 체크된 태스크는 Issue도 Close 처리

```bash
gh issue close {issue_number} --repo semicolon-devteam/{target_repo}
```

## 에러 처리

### tasks.md 없음

```markdown
[SAX] Error: sync-tasks 실패 → tasks.md 파일을 찾을 수 없음

먼저 speckit.tasks를 실행해주세요:
> /speckit.tasks
```

### Epic 없음

```markdown
[SAX] Error: sync-tasks 실패 → Epic #{epic_number}를 찾을 수 없음

Epic 번호를 확인해주세요.
```

### 권한 오류

```markdown
[SAX] Error: sync-tasks 실패 → {target_repo} 레포지토리 권한 없음
```

## 역동기화 (선택적)

GitHub Issue 상태 → tasks.md 반영:

```markdown
[SAX] Skill: sync-tasks 역동기화

Issue #{number} 완료 감지 → tasks.md 업데이트

- [x] CommentRepository 구현 (← 체크됨)
```

## 제약 사항

- Phase 단위로 Issue 생성 (개별 태스크는 Issue 본문에 체크리스트)
- Epic은 docs 레포, Tasks는 대상 레포에 생성
- 기존 Issue가 있으면 사용자 확인 필요

## 참조

- [create-epic Skill](../create-epic/skill.md)
- [SAX Core Principles](https://github.com/semicolon-devteam/command-center/.claude/sax-core/PRINCIPLES.md)
