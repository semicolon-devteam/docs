---
name: git-workflow
description: Git 워크플로우 자동화. 브랜치 생성, 커밋 메시지 자동 생성, PR 생성, 이슈 연결을 처리합니다. (project)
triggers:
  - 커밋해줘
  - 커밋하고 푸시해줘
  - PR 만들어줘
  - 브랜치 만들어줘
  - 푸시해줘
  - "{Issue URL} 할당받았는데"
  - "{Issue URL} 시작하려는데"
  - "{이슈번호}번 이슈로 브랜치 만들어줘"
---

# Git Workflow Skill

Git 작업을 Semicolon 팀 표준에 맞게 자동화합니다.

## Activation Triggers

- `커밋해줘` / `커밋하고 푸시해줘`
- `PR 만들어줘` / `풀리퀘스트 생성해줘`
- `브랜치 만들어줘` / `새 브랜치`
- `푸시해줘`
- Git 관련 작업 요청 시
- **Issue Onboarding**: `{GitHub Issue URL} 할당받았는데, 뭐부터 하면 돼?`
- **Issue Onboarding**: `{이슈번호}번 이슈로 브랜치 만들어줘`

## Core Functions

### 1. Issue Number Extraction (이슈 번호 추출)

**🔴 CRITICAL**: 모든 커밋 메시지에 브랜치명 기반 이슈 번호를 포함합니다.

```bash
# 현재 브랜치에서 이슈 번호 추출
get_issue_number() {
  ISSUE_NUM=$(git branch --show-current | grep -oE '^[0-9]+|/[0-9]+' | grep -oE '[0-9]+' | head -1)
  if [ -n "$ISSUE_NUM" ]; then
    echo "#$ISSUE_NUM"
  else
    echo ""
  fi
}
```

**브랜치 패턴 → 이슈 번호**:

| 브랜치명                | 추출된 이슈 번호 |
| ----------------------- | ---------------- |
| `35-comment-ui`         | `#35`            |
| `001-dynamic-gnb-menus` | `#001`           |
| `fix/42-login-bug`      | `#42`            |
| `feature/auth-refactor` | (없음)           |
| `dev`, `main`           | (없음)           |

### 2. Commit Message Generation (커밋 메시지 생성)

**형식**: `:gitmoji: #issue-number subject`

**Gitmoji 매핑**:

| Gitmoji                        | Type     | 사용 시점        |
| ------------------------------ | -------- | ---------------- |
| ✨ `:sparkles:`                | feat     | 새 기능 추가     |
| 🐛 `:bug:`                     | fix      | 버그 수정        |
| 🔧 `:wrench:`                  | chore    | 설정, 구조 변경  |
| ✅ `:white_check_mark:`        | test     | 테스트 추가/수정 |
| ♻️ `:recycle:`                 | refactor | 리팩토링         |
| 📝 `:memo:`                    | docs     | 문서 작성/수정   |
| 🎨 `:art:`                     | style    | 코드 스타일/포맷 |
| 🔥 `:fire:`                    | remove   | 코드/파일 삭제   |
| 🚀 `:rocket:`                  | deploy   | 배포 관련        |
| 🔄 `:arrows_counterclockwise:` | sync     | 동기화, 업데이트 |

**자동 타입 감지**:

```yaml
detection_rules:
  feat:
    - 새 파일 생성 (컴포넌트, 훅, API 등)
    - "Add", "Create", "Implement" 키워드
  fix:
    - 기존 파일 수정 (에러 관련)
    - "Fix", "Resolve", "Correct" 키워드
  test:
    - __tests__/ 폴더 내 파일
    - .test.ts, .test.tsx, .spec.ts 파일
  docs:
    - .md 파일 수정
    - README, CLAUDE.md, spec.md 등
  chore:
    - 설정 파일 (package.json, tsconfig.json 등)
    - 디렉토리 구조 변경
  refactor:
    - 기존 파일 수정 (기능 변경 없이 구조 개선)
```

### 3. Commit Workflow

**Step 1**: 상태 확인

```bash
git status
git branch --show-current
```

**Step 2**: 이슈 번호 추출

```bash
ISSUE_NUM=$(git branch --show-current | grep -oE '^[0-9]+|/[0-9]+' | grep -oE '[0-9]+' | head -1)
```

**Step 3**: 변경 사항 분석 및 타입 결정

```bash
git diff --stat
git diff --name-only
```

**Step 4**: 커밋 메시지 생성 및 커밋

```bash
# 이슈 번호가 있는 경우
git commit -m "✨ #${ISSUE_NUM} Add new feature component"

# 이슈 번호가 없는 경우
git commit -m "✨ Add new feature component"
```

### 4. Branch Creation (브랜치 생성)

**형식**: `{issue-number}-{feature-name}`

```bash
# 이슈 번호 기반 브랜치 생성
create_feature_branch() {
  ISSUE_NUM=$1
  FEATURE_NAME=$2
  git checkout -b "${ISSUE_NUM}-${FEATURE_NAME}"
}

# 예시
git checkout -b "42-user-profile-edit"
git checkout -b "001-dynamic-gnb-menus"
```

**브랜치 네이밍 규칙**:

| 유형    | 패턴                           | 예시                     |
| ------- | ------------------------------ | ------------------------ |
| Feature | `{issue}-{feature}`            | `35-comment-ui`          |
| Fix     | `fix/{issue}-{description}`    | `fix/42-login-redirect`  |
| Hotfix  | `hotfix/{issue}-{description}` | `hotfix/99-critical-bug` |

### 5. Issue Onboarding (이슈 할당 온보딩) 🆕

**Purpose**: GitHub Issue URL을 받아 브랜치 생성부터 Speckit 가이드까지 안내

**Workflow**:

```bash
# Step 1: Issue URL에서 정보 추출
# URL: https://github.com/semicolon-devteam/cm-office/issues/132
ORG="semicolon-devteam"
REPO="cm-office"
ISSUE_NUM="132"

# Step 2: Issue 제목 조회 (gh cli)
ISSUE_TITLE=$(gh issue view $ISSUE_NUM --repo $ORG/$REPO --json title -q '.title')
# 예: "User Profile Upload"

# Step 3: 브랜치명 생성 (slug 변환)
BRANCH_NAME="${ISSUE_NUM}-$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')"
# 예: "132-user-profile-upload"

# Step 4: dev 브랜치 확인 및 최신화
git checkout dev
git pull origin dev

# Step 5: 피처 브랜치 생성
git checkout -b "$BRANCH_NAME"
```

**Issue Onboarding Response Template**:

````markdown
## 🚀 Issue Onboarding: #{issue_number}

**이슈 정보**:

- Repository: `{repo}`
- Issue: #{issue_number}
- Title: `{issue_title}`

---

### ✅ Step 1: 브랜치 확인

현재 브랜치: `{current_branch}`

{if current != dev}
⚠️ `dev` 브랜치가 아닙니다. 먼저 이동합니다:

```bash
git checkout dev
```
````

{/if}

---

### ✅ Step 2: 소스 최신화

```bash
git pull origin dev
```

---

### ✅ Step 3: 피처 브랜치 생성

```bash
git checkout -b {issue_num}-{title_slug}
```

---

### 🎯 Step 4: 다음 단계

브랜치가 생성되었습니다! 이제 Speckit 워크플로우를 시작하세요:

1. **명세 작성**: `/speckit.specify`
2. **계획 수립**: `/speckit.plan`
3. **태스크 분해**: `/speckit.tasks`
4. **구현**: `/speckit.implement`

**권장**: `/speckit.specify` 실행하여 spec.md 생성

````

**Auto-Execute Option**:

사용자가 "진행해줘" 또는 "Y"로 응답하면 자동 실행:

```bash
# 자동 실행 시퀀스
git checkout dev && \
git pull origin dev && \
git checkout -b "${ISSUE_NUM}-${TITLE_SLUG}"
````

### 6. Pull Request Creation (PR 생성)

**자동 PR 생성 워크플로우**:

```bash
# 1. 현재 브랜치 푸시
git push -u origin $(git branch --show-current)

# 2. PR 생성 (gh cli)
gh pr create \
  --title "✨ #${ISSUE_NUM} ${PR_TITLE}" \
  --body "$(cat <<'EOF'
## Summary
- [변경 사항 요약]

## Related Issue
- Closes #${ISSUE_NUM}

## Test Plan
- [ ] 테스트 항목 1
- [ ] 테스트 항목 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### 6. Atomic Commit Support (최소 단위 커밋)

**원칙**:

- **1 파일 = 1 커밋** (가능한 경우)
- **1 기능 단위 = 1 커밋** (관련 파일 2-3개)
- **NEVER**: 5개 이상 파일을 하나의 커밋에 포함 금지

**자동 분할 제안**:

```markdown
⚠️ 5개 이상의 파일이 변경되었습니다.

변경된 파일:

1. src/app/posts/\_components/PostsHeader.tsx
2. src/app/posts/\_components/PostsList.tsx
3. src/app/posts/\_components/PostsFilter.tsx
4. src/app/posts/\_hooks/usePosts.ts
5. src/app/posts/\_repositories/PostsRepository.ts
6. src/models/posts/index.ts

**권장**: 다음과 같이 분할 커밋:

1. `✨ #35 Add PostsRepository` (Repository)
2. `✨ #35 Add usePosts hook` (Hook)
3. `✨ #35 Add Posts components` (Components 3개)
4. `✨ #35 Add posts type definitions` (Models)

분할하여 커밋할까요? (Y/n)
```

## Usage Examples

### Example 0: Issue Onboarding (New!)

```markdown
User: https://github.com/semicolon-devteam/cm-office/issues/132 이거 할당받았는데, 뭐부터 하면 돼?

Skill Response:

## 🚀 Issue Onboarding: #132

**이슈 정보**:

- Repository: `cm-office`
- Issue: #132
- Title: `User Profile Upload`

---

### ✅ Step 1: 브랜치 확인

현재 브랜치: `dev` ✅

---

### ✅ Step 2: 소스 최신화

\`\`\`bash
git pull origin dev
\`\`\`

---

### ✅ Step 3: 피처 브랜치 생성

\`\`\`bash
git checkout -b 132-user-profile-upload
\`\`\`

---

### 🎯 Step 4: 다음 단계

브랜치 생성 후 Speckit 워크플로우를 시작하세요:

1. `/speckit.specify` - 명세 작성
2. `/speckit.plan` - 계획 수립
3. `/speckit.tasks` - 태스크 분해
4. `/speckit.implement` - 구현

진행할까요? (Y/n)
```

### Example 1: Simple Commit

```markdown
User: 커밋해줘

Skill Response:
📋 **현재 상태**

- 브랜치: `35-comment-ui`
- 이슈 번호: `#35`
- 변경 파일: 2개

📝 **제안 커밋 메시지**:
```

✨ #35 Add CommentList component

```

진행할까요? (Y/n)
```

### Example 2: Commit with Push

```markdown
User: 커밋하고 푸시해줘

Skill Response:
📋 **현재 상태**

- 브랜치: `001-dynamic-gnb-menus`
- 이슈 번호: `#001`
- 변경 파일: 1개

📝 **커밋 메시지**:
```

📝 #001 Update GNB spec documentation

```

🚀 **실행 계획**:
1. git add .
2. git commit -m "📝 #001 Update GNB spec documentation"
3. git push

진행할까요? (Y/n)
```

### Example 3: Create PR

```markdown
User: PR 만들어줘

Skill Response:
📋 **현재 상태**

- 브랜치: `35-comment-ui`
- Base: `dev`
- 커밋 수: 5개
- 이슈: `#35`

📝 **PR 정보**:

- Title: `✨ #35 댓글 UI 구현`
- Labels: `feature`, `frontend`

🚀 **실행 계획**:

1. git push -u origin 35-comment-ui
2. gh pr create --title "..." --body "..."

진행할까요? (Y/n)
```

## Integration

### Related Skills

- `implementation-master` - 구현 시 커밋 전략 참조
- `check-team-codex` - 커밋 전 품질 검사
- `verify` - PR 전 검증

### Pre-commit Checks

커밋 전 자동 실행:

```bash
npm run lint      # ESLint 검사
npx tsc --noEmit  # TypeScript 검사
```

**실패 시**:

```markdown
❌ 커밋 전 검사 실패

**ESLint 오류**: 2개

- src/app/posts/page.tsx:15:3 - 'unused' is defined but never used

**수정 후 다시 시도해주세요.**
```

## Error Handling

### No Changes to Commit

```markdown
ℹ️ 커밋할 변경 사항이 없습니다.

현재 상태:

- 브랜치: `35-comment-ui`
- Working tree clean
```

### Uncommitted Changes Before Branch Switch

```markdown
⚠️ 커밋되지 않은 변경 사항이 있습니다.

옵션:

1. 변경 사항 커밋 후 브랜치 전환
2. 변경 사항 스태시 후 브랜치 전환 (git stash)
3. 변경 사항 폐기 후 브랜치 전환 (⚠️ 데이터 손실)

선택:
```

### Push Rejected

```markdown
❌ 푸시가 거부되었습니다.

원인: 원격 브랜치에 새로운 커밋이 있습니다.

해결 방법:

1. git pull --rebase origin $(git branch --show-current)
2. 충돌 해결 (필요시)
3. git push

자동으로 pull --rebase 실행할까요? (Y/n)
```

## Critical Rules

1. **이슈 번호 필수**: 브랜치에 이슈 번호가 있으면 반드시 커밋 메시지에 포함
2. **Gitmoji 사용**: 커밋 타입에 맞는 이모지 사용
3. **Atomic Commit**: 5개 이상 파일 변경 시 분할 제안
4. **Pre-commit 준수**: lint/typecheck 통과 필수
5. **NEVER --no-verify**: 절대 pre-commit hook 우회 금지
