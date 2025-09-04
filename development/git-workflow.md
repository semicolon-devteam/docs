---
layout: page
title: Git 워크플로우
permalink: /development/git-workflow/
---

# Git 워크플로우

## 개요
세미콜론 개발팀의 Git 사용 규칙과 협업 워크플로우를 정의합니다.

## 브랜치 전략

### Git Flow 기반 전략
```
main (production)
  ├── develop (개발)
  │   ├── feature/기능명
  │   ├── bugfix/버그명
  │   └── refactor/리팩토링명
  ├── release/버전
  └── hotfix/긴급수정
```

### 브랜치 규칙

#### main
- 프로덕션 배포 브랜치
- 직접 커밋 금지
- develop 또는 hotfix에서만 머지

#### develop
- 개발 통합 브랜치
- feature 브랜치 머지 대상
- 다음 릴리즈 준비

#### feature/*
- 새 기능 개발
- develop에서 분기
- 완료 후 develop으로 머지

#### bugfix/*
- 버그 수정
- develop에서 분기
- 수정 후 develop으로 머지

#### hotfix/*
- 긴급 프로덕션 버그 수정
- main에서 분기
- main과 develop에 모두 머지

## 커밋 메시지 규칙

### 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: 새 기능
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅
- **refactor**: 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드, 패키지 관련

### 예시
```bash
feat(auth): JWT 토큰 기반 인증 구현

- JWT 토큰 생성 및 검증 로직 추가
- 미들웨어를 통한 인증 처리
- 리프레시 토큰 지원

Resolves: #123
```

### 한글 이모지 커밋 메시지
```bash
✨ feat: 새 기능 추가
🐛 fix: 버그 수정
📝 docs: 문서 수정
💄 style: 스타일 수정
♻️ refactor: 리팩토링
✅ test: 테스트 추가
🔧 chore: 설정 변경
```

## Pull Request

### PR 템플릿
```markdown
## 📋 작업 내용
- 작업한 내용 요약

## 🔗 관련 이슈
- Resolves #이슈번호

## ✅ 체크리스트
- [ ] 테스트 작성/수정
- [ ] 문서 업데이트
- [ ] 코드 리뷰 요청
- [ ] CI 통과

## 📸 스크린샷 (선택)
UI 변경사항이 있다면 스크린샷 첨부

## 💬 리뷰어에게
특별히 확인이 필요한 부분 설명
```

### PR 규칙
1. develop 브랜치로 PR 생성
2. 최소 1명 이상 리뷰 필수
3. CI 테스트 통과 필수
4. 충돌 해결 후 머지

## 워크플로우

### 기능 개발 플로우
```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. 작업 진행
git add .
git commit -m "feat(auth): 사용자 인증 기능 구현"

# 3. 원격 저장소에 푸시
git push origin feature/user-authentication

# 4. GitHub에서 PR 생성
# develop <- feature/user-authentication

# 5. 리뷰 후 머지
```

### 버그 수정 플로우
```bash
# 1. develop에서 bugfix 브랜치 생성
git checkout develop
git checkout -b bugfix/login-error

# 2. 버그 수정
git add .
git commit -m "fix(auth): 로그인 시 null 참조 오류 수정"

# 3. PR 생성 및 머지
git push origin bugfix/login-error
```

### 긴급 수정 플로우
```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/critical-security-issue

# 2. 수정 작업
git add .
git commit -m "hotfix(security): SQL 인젝션 취약점 수정"

# 3. main과 develop 모두에 머지
git checkout main
git merge hotfix/critical-security-issue

git checkout develop
git merge hotfix/critical-security-issue
```

## 릴리즈 관리

### 릴리즈 프로세스
```bash
# 1. release 브랜치 생성
git checkout develop
git checkout -b release/1.2.0

# 2. 버전 업데이트
npm version minor
git commit -m "chore: v1.2.0 릴리즈 준비"

# 3. main으로 머지
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 4. develop으로 백머지
git checkout develop
git merge --no-ff release/1.2.0
```

### 태깅 규칙
- 시맨틱 버저닝: `v{major}.{minor}.{patch}`
- 예: `v1.2.3`
- major: 호환성 깨지는 변경
- minor: 기능 추가
- patch: 버그 수정

## 코드 리뷰

### 리뷰 체크포인트
- [ ] 코드가 요구사항을 충족하는가?
- [ ] 테스트가 충분한가?
- [ ] 성능 이슈는 없는가?
- [ ] 보안 취약점은 없는가?
- [ ] 코딩 표준을 준수하는가?

### 리뷰 코멘트 규칙
```markdown
# 필수 수정사항
[MUST] null 체크가 필요합니다.

# 권장사항
[SHOULD] 이 부분은 별도 함수로 분리하면 좋겠습니다.

# 제안
[CONSIDER] 캐싱을 적용하면 성능이 개선될 것 같습니다.

# 질문
[QUESTION] 이 로직의 의도가 무엇인가요?
```

## Git 설정

### 글로벌 설정
```bash
# 사용자 정보
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 에디터 설정
git config --global core.editor "code --wait"

# 줄바꿈 설정
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows
```

### 유용한 Alias
```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## 충돌 해결

### 충돌 해결 프로세스
```bash
# 1. 최신 변경사항 가져오기
git fetch origin

# 2. 머지 시도
git merge origin/develop

# 3. 충돌 확인
git status

# 4. 충돌 파일 수정
# <<<<<<< HEAD
# 현재 브랜치 코드
# =======
# 머지하려는 브랜치 코드
# >>>>>>> branch-name

# 5. 해결 후 커밋
git add .
git commit -m "merge: develop 브랜치 충돌 해결"
```

## Git Hooks

### pre-commit
```bash
#!/bin/sh
# .git/hooks/pre-commit

# 린트 실행
npm run lint

# 테스트 실행
npm test

# 실패 시 커밋 중단
if [ $? -ne 0 ]; then
  echo "린트 또는 테스트 실패. 커밋이 중단되었습니다."
  exit 1
fi
```

### commit-msg
```bash
#!/bin/sh
# .git/hooks/commit-msg

# 커밋 메시지 형식 검증
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
  echo "잘못된 커밋 메시지 형식입니다."
  echo "올바른 형식: <type>(<scope>): <subject>"
  exit 1
fi
```

## 트러블슈팅

### 자주 발생하는 문제

#### 실수로 main에 커밋한 경우
```bash
# 커밋 되돌리기 (히스토리 유지)
git revert HEAD

# 또는 리셋 (주의: 강제 푸시 필요)
git reset --hard HEAD~1
git push --force
```

#### 잘못된 브랜치에서 작업한 경우
```bash
# 변경사항 임시 저장
git stash

# 올바른 브랜치로 이동
git checkout correct-branch

# 변경사항 적용
git stash pop
```

## 체크리스트

### 커밋 전
- [ ] 코드 린트 통과
- [ ] 테스트 통과
- [ ] 커밋 메시지 규칙 준수

### PR 생성 전
- [ ] 최신 develop 머지
- [ ] 충돌 해결
- [ ] 테스트 실행
- [ ] 문서 업데이트

### 머지 전
- [ ] 코드 리뷰 완료
- [ ] CI 테스트 통과
- [ ] 충돌 없음 확인

## 참고 자료
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)