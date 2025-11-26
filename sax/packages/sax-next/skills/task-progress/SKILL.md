---
name: task-progress
description: Track developer task progress with automated checklist and workflow support. Use when (1) developer is assigned an issue, (2) checking current progress status, (3) tracking development workflow from assignment to review, (4) automating workflow steps.
tools: [Bash, Read, Grep, GitHub CLI]
---

# task-progress Skill

> 개발자 업무 진행도를 체크리스트 형태로 표시하고 자동 진행 지원

## 역할

개발자가 이슈 할당 후 완료까지의 전체 프로세스를 추적하고, 각 단계의 완료 여부를 확인하며, 자동화 가능한 작업을 수행합니다.

## 트리거

- `/SAX:task-progress` 명령어
- "어디까지 했어", "현황", "체크리스트", "진행도" 키워드
- 이슈 URL 제공 시 orchestrator가 자동 호출
- "cm-office#32 할당받았어요" 패턴 감지 시

## 개발자 전체 프로세스

```text
1. 업무할당
2. GitHub Project 상태 변경 (검수완료 → 작업중)
3. Feature 브랜치 생성
4. Draft PR 생성
5. Speckit 기반 구현 (Spec → Plan → Tasks)
6. 테스트코드 작성 및 테스트 진행
7. 린트 및 빌드 통과
8. 푸시 및 리뷰 진행
9. dev 머지
10. GitHub Project 상태 변경 (작업중 → 리뷰요청) 및 작업완료일 설정
```

## 검증 로직

### 1. 업무할당 확인

```yaml
method: "issue_url_or_branch"
check:
  - 사용자가 이슈 URL 제공 (예: cm-office#32)
  - 또는 현재 브랜치명에서 이슈 번호 추출 (예: feature/32-add-comments)
result:
  - 이슈 번호 파싱
  - GitHub API로 이슈 존재 확인
  - 할당자(assignee) 확인
```

### 2. GitHub Project 상태 확인 (작업중)

```yaml
method: "gh_project_status"
command: "gh project item-list {project_number} --owner semicolon-devteam --format json"
check:
  - 해당 이슈의 status 필드 확인
  - "작업중" 상태인지 검증
auto_action:
  - status가 "검수완료"면 → "작업중"으로 자동 변경
  - gh project item-edit 명령 사용
```

### 3. Feature 브랜치 확인

```yaml
method: "git_branch"
command: "git branch --show-current"
check:
  - 브랜치명이 main/master가 아닌지
  - feature/* 패턴 또는 이슈 번호 포함 확인
auto_action:
  - 브랜치 없으면 → 생성 제안 및 자동 생성
  - "feature/{issue_number}-{title}" 형식
```

### 4. Draft PR 확인

```yaml
method: "gh_pr_list"
command: "gh pr list --head {current_branch} --json number,isDraft"
check:
  - 현재 브랜치의 PR 존재 여부
  - Draft 상태 확인
auto_action:
  - Draft PR 없으면 → 빈 커밋 + Draft PR 생성
  - 커밋 메시지: ":tada: #{issue_number} Draft PR생성을 위한 빈 커밋"
  - PR 제목: "[Draft] #{issue_number} {issue_title}"
```

### 5. Speckit 기반 구현

```yaml
spec:
  file: "specs/{domain}/spec.md"
  check: 파일 존재 여부
  auto_action: 없으면 spec-master Agent 호출

plan:
  file: "specs/{domain}/plan.md"
  check: 파일 존재 여부
  auto_action: 없으면 /speckit.plan 안내

tasks:
  file: "specs/{domain}/tasks.md"
  check: 파일 존재 여부
  auto_action: 없으면 /speckit.tasks 안내

tasks_github_sync:
  method: "tasks_md_check"
  check: tasks.md에 "## GitHub Issues" 섹션 및 링크 존재
  auto_action: 없으면 sync-tasks skill 호출 안내
```

### 6. 테스트코드 작성 확인

```yaml
method: "test_files_check"
command: "find . -type f -name '*.test.ts' -o -name '*.test.tsx' -o -name '*.spec.ts'"
check:
  - 테스트 파일 존재 여부
  - 최근 수정 시간 (Feature 브랜치 생성 이후)
auto_action:
  - 없으면 → 테스트 작성 안내
  - "implementation-master Agent에게 테스트 작성 요청하세요"
```

### 7. 린트 및 빌드 통과 확인

```yaml
lint:
  command: "npm run lint 2>&1"
  check: exit code 0
  auto_action: 실패 시 → 에러 수정 안내

typecheck:
  command: "npx tsc --noEmit 2>&1"
  check: exit code 0
  auto_action: 실패 시 → 타입 에러 수정 안내

build:
  command: "npm run build 2>&1"
  check: exit code 0 (선택, 개발 환경 이슈 예외)
  auto_action: 실패 시 → 빌드 에러 수정 안내
```

### 8. 푸시 및 리뷰 진행 확인

```yaml
push:
  command: "git log origin/{current_branch}..HEAD --oneline"
  check: 로컬 커밋이 원격에 푸시되었는지
  auto_action: 미푸시 커밋 있으면 → "git push" 안내

pr_ready:
  command: "gh pr view --json isDraft"
  check: Draft 상태가 false인지 (Ready for review)
  auto_action: Draft 상태면 → "gh pr ready" 안내
```

### 9. dev 머지 확인

```yaml
method: "gh_pr_merged"
command: "gh pr view --json mergedAt,baseRefName"
check:
  - PR이 머지되었는지 (mergedAt != null)
  - baseRefName이 "dev"인지
result:
  - 머지 완료 시 체크
```

### 10. GitHub Project 상태 변경 (리뷰요청) 및 완료일 설정

```yaml
method: "gh_project_status_update"
check:
  - dev 머지 완료 후 status가 "리뷰요청"인지
auto_action:
  - status "작업중" → "리뷰요청" 자동 변경
  - 작업완료일 필드에 현재 날짜 설정
  - gh project item-edit 명령 사용
```

## 출력 형식

```markdown
=== 작업 진행도 (cm-office#32: 댓글 기능 추가) ===

- [x] 업무할당 (cm-office#32)
- [x] GitHub Project 상태: 작업중
- [x] Feature 브랜치 (feature/32-add-comments)
- [x] Draft PR 생성 (#145)
- [x] Spec 작성 (specs/comments/spec.md)
- [x] Plan 작성 (specs/comments/plan.md)
- [ ] Tasks 작성 (specs/comments/tasks.md)
- [ ] Tasks GitHub Issue 연동
- [ ] 테스트코드 작성
- [ ] 린트 및 빌드 통과
- [ ] 푸시 및 리뷰 진행
- [ ] dev 머지
- [ ] GitHub Project 상태: 리뷰요청

=== 다음 단계 ===
📝 Tasks 작성을 진행하시겠습니까? (/speckit.tasks)

=== 자동화 가능 작업 ===
💡 다음 작업을 자동으로 수행할 수 있습니다:
- Tasks 작성 후 GitHub Issues 연동 (sync-tasks)
- 린트 에러 자동 수정 (npm run lint -- --fix)
- Draft PR → Ready for review 전환 (gh pr ready)
```

## 자동화 동작

### Draft PR 자동 생성

Feature 브랜치 존재 but Draft PR 없을 때:

```bash
# 빈 커밋 생성
git commit --allow-empty -m ":tada: #32 Draft PR생성을 위한 빈 커밋"

# 푸시
git push -u origin feature/32-add-comments

# Draft PR 생성
gh pr create --draft --title "[Draft] #32 댓글 기능 추가" --body "작업 진행 중..."
```

### GitHub Project 상태 자동 변경

```bash
# 작업 시작 시 (검수완료 → 작업중)
gh project item-edit --id {item_id} --field-id {status_field_id} --project-id {project_id} --text "작업중"

# dev 머지 후 (작업중 → 리뷰요청)
gh project item-edit --id {item_id} --field-id {status_field_id} --project-id {project_id} --text "리뷰요청"

# 작업완료일 설정
gh project item-edit --id {item_id} --field-id {completion_date_field_id} --project-id {project_id} --date "2025-11-25"
```

## 동작 흐름

```text
1. 이슈 URL 또는 /SAX:task-progress 트리거
   ↓
2. 이슈 번호 파싱 및 검증
   ↓
3. 10단계 순차 확인
   - 각 단계별 자동화 가능 작업 수행
   - GitHub API, Git, npm 명령 실행
   ↓
4. 체크리스트 생성 및 출력
   - 완료: [x]
   - 미완료: [ ]
   ↓
5. 다음 단계 안내
   - 자동화 가능 작업 제안
   - 수동 작업 가이드
```

## SAX 메타데이터 업데이트

작업 시작 시 `~/.claude.json` 업데이트:

```json
{
  "SAX": {
    "role": "parttimer",
    "position": "developer",
    "boarded": true,
    "participantProjects": ["cm-office"],
    "currentTask": {
      "issueNumber": 32,
      "repo": "cm-office",
      "title": "댓글 기능 추가",
      "startedAt": "2025-11-25T10:30:00Z",
      "branch": "feature/32-add-comments",
      "prNumber": 145
    }
  }
}
```

## 참조

- [SAX Core MESSAGE_RULES.md](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [GitHub CLI Projects](https://cli.github.com/manual/gh_project)
- [GitHub CLI PR](https://cli.github.com/manual/gh_pr)
