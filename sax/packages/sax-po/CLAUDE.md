# SAX-PO Package Configuration

> PO/기획자를 위한 SAX 패키지

## Package Info

- **Package**: SAX-PO
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: docs repository
- **Audience**: PO, 기획자
- **Extends**: SAX-Core (docs)

## SAX란?

**SAX** = **S**emicolon **A**I Transformation

Semicolon 팀의 AI 기반 개발 워크플로우 자동화 프레임워크입니다.

## Source of Truth

**SAX의 모든 표준과 최신 버전은 `semicolon-devteam/docs` 레포지토리에서 관리됩니다.**

### 버전 확인 방법

SAX 버전 질문 시 다음을 비교하여 안내:

1. 현재 레포지토리의 SAX 버전
2. docs 레포지토리의 최신 SAX 버전

최신 버전이 아닐 경우 업데이트를 권장합니다.

### 업데이트 시 CHANGELOG 확인 (필수)

> ⚠️ **중요**: SAX 업데이트 진행 시, **반드시** CHANGELOG.md를 확인하고 변경사항을 **즉시 반영**해야 합니다.

```bash
# CHANGELOG.md 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG.md \
  --jq '.content' | base64 -d
```

**확인 시점**: 업데이트 작업 시작 직후
**반영 범위**: 현재 버전 이후의 모든 변경사항

## 설치 대상

이 패키지는 `semicolon-devteam/docs` 레포지토리의 `.claude/` 디렉토리에 설치됩니다.

### docs 레포 한정 동기화 규칙

> ⚠️ **중요**: docs 레포지토리에서 SAX-PO 개선 작업 시, 다음 두 위치를 **동시에** 업데이트해야 합니다:

| 위치 | 역할 |
|------|------|
| `.claude/` | SAX-PO 실제 사용 (설치된 상태) |
| `sax/packages/sax-po/` | SAX-PO 패키지 소스 (배포용) |

**동기화 대상**: CLAUDE.md, agents/, skills/, templates/, commands/

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

**상속 원칙**:

- Transparency (투명성)
- Consistency (일관성)
- Modularity (모듈성)
- Hierarchy (계층구조)

### SAX Core 참조 방법 (필수)

> ⚠️ **Source of Truth**: SAX Core 문서는 `semicolon-devteam/docs` 레포의 `sax/core/`가 유일한 원본입니다.

SAX 관련 작업 시 **반드시** 다음 명령으로 최신 Core 규칙을 참조하세요:

```bash
# MESSAGE_RULES.md 참조 (메시지 포맷)
gh api repos/semicolon-devteam/docs/contents/sax/core/MESSAGE_RULES.md \
  --jq '.content' | base64 -d

# PRINCIPLES.md 참조 (기본 원칙)
gh api repos/semicolon-devteam/docs/contents/sax/core/PRINCIPLES.md \
  --jq '.content' | base64 -d

# PACKAGING.md 참조 (패키지 규칙)
gh api repos/semicolon-devteam/docs/contents/sax/core/PACKAGING.md \
  --jq '.content' | base64 -d

# TEAM_RULES.md 참조 (팀 규칙)
gh api repos/semicolon-devteam/docs/contents/sax/core/TEAM_RULES.md \
  --jq '.content' | base64 -d
```

### 핵심 메시지 규칙 (Quick Reference)

```markdown
[SAX] {Type}: {name} {action}
```

- **Type**: `Orchestrator`, `Agent`, `Skill`, `Reference`
- **필수**: 각 메시지 별도 줄, 메시지 간 빈 줄 삽입

**상세 규칙**: `gh api`로 MESSAGE_RULES.md 참조

## Orchestrator-First Policy (필수)

> ⚠️ **핵심 규칙**: SAX-PO가 설치된 이 환경에서는 **모든 요청이 Orchestrator를 먼저 거쳐야 합니다.**

**동작 방식**:

1. 사용자 요청 수신
2. `[SAX] Orchestrator: 의도 분석 완료 → {category}` 출력
3. 적절한 Agent 위임 또는 직접 응답

**예외 사항** (Orchestrator 생략 가능):

- 단순 질문: "이게 뭐야?", "설명해줘"
- 일반 대화: 인사, 감사 표현
- 명시적 직접 요청: "Orchestrator 없이 바로 해줘"

**상세 규칙**: `gh api`로 SAX Core PRINCIPLES.md의 "3.0 Orchestrator-First Policy" 참조

## Agent Routing

### Primary Router

이 패키지의 모든 요청은 `orchestrator`를 통해 라우팅됩니다.

### Routing Table

| Intent | Route To | Trigger Keywords |
|--------|----------|------------------|
| Epic 생성 | `epic-master` | "Epic 만들어", "기능 정의", "새 기능" |
| Epic 이식 | `epic-master` | "이식", "마이그레이션", "옮기기", "복사해줘" |
| Spec 초안 | `spec-writer` | "Spec 초안", "명세 초안" |
| Task 동기화 | `skill:sync-tasks` | "이슈 동기화", "Tasks 생성" |
| 학습 요청 | `teacher` | "알려줘", "배우고 싶어", "어떻게 해야", "설명해줘" (학습 맥락) |
| 워크플로우 질문 | 직접 응답 | "다음 뭐해", "뭐부터 해" |

## Workflow Overview

```text
PO 요청
  ↓
orchestrator (의도 분석)
  ├─ epic-master → skill:create-epic → docs 레포에 Epic 이슈 생성
  ├─ spec-writer → specs/{epic}/spec.md 초안 생성
  └─ skill:sync-tasks → tasks.md → GitHub Issues 동기화
```

## 개발자 연동

SAX-PO로 생성된 Epic은 개발자(SAX-Next)와 다음과 같이 연동됩니다:

1. **PO**: Epic 생성 → docs 레포에 이슈 생성
2. **PO**: (선택) Spec 초안 생성
3. **개발자**: 대상 레포에서 `/speckit.specify` 실행
4. **개발자**: spec.md 보완 후 `/speckit.plan`, `/speckit.tasks`
5. **PO/개발자**: `skill:sync-tasks`로 GitHub Issues 동기화

## SAX Message Rules

이 패키지의 모든 Agent/Skill은 SAX 메시지 규칙을 준수합니다.

### Agent 활성화

```markdown
[SAX] Agent: {name} 호출 (트리거: {trigger_reason})
```

### Skill 사용

```markdown
[SAX] Skill: {name} 사용
```

### Reference 참조

```markdown
[SAX] Reference: {source} 참조
```

## Package Components

### Agents

| Agent | 역할 | 파일 |
|-------|------|------|
| orchestrator | 요청 라우팅 | `agents/orchestrator.md` |
| epic-master | Epic 생성 전문가 | `agents/epic-master.md` |
| spec-writer | Spec 초안 작성 | `agents/spec-writer.md` |
| teacher | 협업/기획 학습 가이드 | `agents/teacher.md` |

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| create-epic | Epic 이슈 생성 | `skills/create-epic/skill.md` |
| sync-tasks | Tasks ↔ Issues 동기화 | `skills/sync-tasks/skill.md` |
| check-team-codex | 팀 규칙 검증 | `skills/check-team-codex/SKILL.md` |

### Templates

| Template | 역할 | 파일 |
|----------|------|------|
| epic-template | Epic 이슈 본문 | `templates/epic-template.md` |

## Installation & Update

### 설치 방법

docs 레포지토리에 설치:

```bash
# docs 레포로 이동
cd semicolon-devteam/docs

# SAX-PO 패키지 복사
cp -r sax/packages/sax-po/* .claude/
```

### 업데이트 후 커밋 규칙

> ⚠️ **중요**: SAX 패키지 동기화(업데이트) 완료 후 **반드시 커밋**을 수행합니다.

**커밋 메시지 형식**:

```text
📝 [SAX] Sync to vX.X.X
```

**예시**:

```text
📝 [SAX] Sync to v1.5.0
```

## Versioning Rules

SAX 패키지 변경 시 반드시 버저닝을 수행합니다.

### Semantic Versioning

- **MAJOR** (x.0.0): 호환성 깨지는 변경, 구조 대폭 변경
- **MINOR** (0.x.0): 기능 추가, 설정 변경, 새 Agent/Skill 추가
- **PATCH** (0.0.x): 버그 수정, 오타 수정, 문서 보완

### 버저닝 필수 상황

> ⚠️ **필수**: 다음 변경 시 **반드시** 버전을 업데이트해야 합니다.

| 변경 유형 | 버전 | 설명 |
|----------|------|------|
| **추가** | MINOR | Agent, Skill, 설정, 워크플로우 추가 |
| **수정** | MINOR/PATCH | 기능 변경(MINOR), 버그 수정(PATCH) |
| **삭제** | MINOR | Agent, Skill, 설정, 워크플로우 삭제 |
| **구조 변경** | MINOR | 디렉토리, 파일 구조 변경 |

**버저닝 체크포인트**:

1. CLAUDE.md 내용 변경 → 버저닝 필요
2. Agent/Skill **추가, 수정, 또는 삭제** → 버저닝 필요
3. 워크플로우 변경 → 버저닝 필요
4. 설정값 변경 → 버저닝 필요

**상세 규칙**: `gh api`로 SAX Core PRINCIPLES.md의 "7.2 버저닝 필수 상황" 참조

### Single Source of Truth

SAX의 버전과 변경 기록은 **단 두 개의 파일**에서만 관리됩니다:

| 파일 | 역할 | 설명 |
|------|------|------|
| 📌 `sax/VERSION` | 버전 번호 | 현재 버전 (예: `1.1.0`) |
| 📋 `sax/CHANGELOG.md` | 변경 기록 | Keep a Changelog 형식 |

> ⚠️ **중요**: 다른 모든 파일은 위 두 파일을 **참조**해야 합니다. 버전 정보를 직접 하드코딩하지 마세요.

### 버저닝 체크리스트

버전 변경 시 **반드시** 다음 순서로 수행:

1. ✅ `sax/VERSION` - 버전 번호 업데이트
2. ✅ `sax/CHANGELOG.md` - 변경 내용 기록
3. ✅ **커밋 수행** - 형식: `:pencil: [SAX] vX.X.X`

**커밋 메시지 예시**:

```text
📝 [SAX] v1.3.0
```

### Changelog

📋 **[sax/CHANGELOG.md](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG.md) 참조**

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Team Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/TEAM_RULES.md)
- [SAX Changelog](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG.md)
