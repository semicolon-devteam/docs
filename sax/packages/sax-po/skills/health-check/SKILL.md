# health-check Skill

> 개발 환경 및 인증 상태 자동 검증

## 역할

신규/기존 팀원의 개발 환경을 자동으로 검증하여 SAX 사용 준비 상태를 확인합니다.

## 트리거

- `/SAX:health-check` 명령어
- "환경 확인", "도구 확인", "설치 확인" 키워드
- onboarding-master Agent에서 자동 호출
- orchestrator가 업무 시작 시 자동 실행

## 검증 항목

### 1. 필수 도구 설치

```yaml
gh_cli:
  command: "gh --version"
  required: true
  error: "GitHub CLI 미설치. `brew install gh` 실행 필요"

git:
  command: "git --version"
  required: true
  error: "Git 미설치. `brew install git` 실행 필요"

node:
  command: "node --version"
  required: true
  min_version: "v18.0.0"
  error: "Node.js 미설치 또는 v18 미만. `brew install node` 실행 필요"

pnpm:
  command: "pnpm --version"
  required: true
  error: "pnpm 미설치. `npm install -g pnpm` 실행 필요"

supabase:
  command: "supabase --version"
  required: true
  error: "Supabase CLI 미설치. `brew install supabase/tap/supabase` 실행 필요"
  note: "프론트엔드 개발자도 필수 (GraphQL/RPC 직접 연결)"

postgresql:
  command: "psql --version"
  required: false
  warn: "PostgreSQL 클라이언트 미설치 (선택). 유사시 디버깅에 필요"
```

### 2. 인증 및 권한

```yaml
github_auth:
  command: "gh auth status"
  required: true
  error: "GitHub 인증 필요. `gh auth login` 실행"

github_org:
  command: "gh api user/orgs --jq '.[].login' | grep semicolon-devteam"
  required: true
  error: "semicolon-devteam Organization 멤버십 없음. 관리자에게 초대 요청"

docs_access:
  command: "gh api repos/semicolon-devteam/docs/contents/README.md"
  required: true
  error: "docs 레포 접근 불가. Organization 멤버십 확인 필요"

core_supabase_access:
  command: "gh api repos/semicolon-devteam/core-supabase/contents/README.md"
  required: true
  error: "core-supabase 레포 접근 불가. Private repo 권한 확인 필요"
```

### 3. Slack 참여 (수동 확인)

```yaml
slack_workspace:
  method: "manual"
  question: "Slack 워크스페이스에 참여하셨나요? (y/n)"
  channels:
    - "#_공지"
    - "#_일반"
    - "#_협업"
    - "할당받은 프로젝트 채널 (#cm-*, #alarm-*, etc.)"
```

## 출력 형식

### 성공 시

```markdown
=== SAX 환경 검증 결과 ===

✅ GitHub CLI: v2.40.0
✅ Git: v2.43.0
✅ Node.js: v20.10.0
✅ pnpm: v8.14.0
✅ Supabase CLI: v1.142.0
⚠️  PostgreSQL: 미설치 (선택, 유사시 디버깅에 필요)

✅ GitHub 인증: 완료
✅ semicolon-devteam 멤버십: 확인
✅ docs 레포 접근: 가능
✅ core-supabase 레포 접근: 가능

✅ Slack 워크스페이스 참여: 확인

=== 결과 ===
✅ 모든 필수 항목 통과
⚠️  1개 선택 항목 미설치 (PostgreSQL)

**다음 단계**: 온보딩 완료. 업무 할당을 대기하거나 `/SAX:onboarding`으로 SAX 학습을 진행하세요.
```

### 실패 시

```markdown
=== SAX 환경 검증 결과 ===

✅ GitHub CLI: v2.40.0
❌ Git: 미설치
✅ Node.js: v20.10.0
❌ pnpm: 미설치
❌ Supabase CLI: 미설치

❌ GitHub 인증: 필요
✅ semicolon-devteam 멤버십: 확인
❌ docs 레포 접근: 불가

=== 결과 ===
❌ 5개 필수 항목 미통과

**해결 방법**:

### 1. Git 설치
```bash
brew install git
```

### 2. pnpm 설치
```bash
npm install -g pnpm
```

### 3. Supabase CLI 설치
```bash
brew install supabase/tap/supabase
```

### 4. GitHub 인증
```bash
gh auth login
```

### 5. docs 레포 접근
- GitHub Organization 멤버십 확인
- 관리자에게 권한 요청

**재검증**: `/SAX:health-check` 명령어로 다시 확인하세요.
```

## SAX 메타데이터 저장

검증 완료 시 `~/.claude.json`에 SAX 메타데이터 저장:

```json
{
  "SAX": {
    "role": "parttimer",
    "position": "developer",
    "boarded": true,
    "healthCheckPassed": true,
    "lastHealthCheck": "2025-11-25T10:30:00Z",
    "participantProjects": []
  }
}
```

**플랫폼별 경로**:
- macOS: `~/.claude.json`
- Linux/WSL2: `~/.claude.json` (Linux 파일시스템 내)
- Windows: `~/.claude.json` (WSL2 사용 시 Linux 경로 우선)

## 동작 흐름

```text
1. 명령어 트리거 (/SAX:health-check)
   ↓
2. 순차적 검증 실행
   - 도구 설치 확인
   - 인증 상태 확인
   - Slack 참여 확인 (수동)
   ↓
3. 결과 집계
   - 필수 항목 통과/실패 카운트
   - 선택 항목 경고 카운트
   ↓
4. 출력 생성
   - 성공 시: 간결한 요약 + 다음 단계 안내
   - 실패 시: 상세 해결 방법 제공
   ↓
5. SAX 메타데이터 저장 (~/.claude.json)
   - healthCheckPassed: true/false
   - lastHealthCheck: timestamp
```

## 재검증 정책

- **온보딩 시**: 필수 실행
- **업무 시작 시**: orchestrator가 자동 실행 (30일 경과 시)
- **수동 요청 시**: `/SAX:health-check` 명령어

## 참조

- [SAX Core MESSAGE_RULES.md](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [Claude Code Settings](https://code.claude.com/docs/en/settings)
