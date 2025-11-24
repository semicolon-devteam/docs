# SAX-Next Package Configuration

> Next.js 개발자를 위한 SAX 패키지

## Package Info

- **Package**: SAX-Next
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: cm-template, cm-\* 프로젝트 (Next.js 기반)
- **Audience**: Frontend/Fullstack 개발자
- **Extends**: SAX-Core (docs)

## SAX란?

**SAX** = **S**emicolon **A**I Transformation

Semicolon 팀의 AI 기반 개발 워크플로우 자동화 프레임워크입니다.

### 업데이트 시 CHANGELOG 확인 (필수)

> ⚠️ **중요**: SAX 업데이트 진행 시, **반드시** CHANGELOG.md를 확인하고 변경사항을 **즉시 반영**해야 합니다.

```bash
# CHANGELOG.md 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG.md \
  --jq '.content' | base64 -d
```

**확인 시점**: 업데이트 작업 시작 직후
**반영 범위**: 현재 버전 이후의 모든 변경사항

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

> ⚠️ **핵심 규칙**: SAX-Next가 설치된 환경에서는 **모든 요청이 Orchestrator를 먼저 거쳐야 합니다.**

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

| Intent       | Route To                | Trigger Keywords                     |
| ------------ | ----------------------- | ------------------------------------ |
| 명세 작성    | `spec-master`           | "spec 작성", "명세", "/speckit"      |
| 구현         | `implementation-master` | "구현해줘", "개발", "코딩"           |
| 검증         | `quality-master`        | "검증", "확인", "PR 전"              |
| 기술 탐색    | `spike-master`          | "스파이크", "기술 검토", "POC"       |
| 마이그레이션 | `migration-master`      | "마이그레이션", "이식"               |
| 학습         | `teacher`               | "알려줘", "설명해줘", "왜"           |
| 조언         | `advisor`               | "어떻게 해야", "추천", "조언"        |
| 코드 리뷰    | `semicolon-reviewer`    | "리뷰", "코드 검토", "PR 리뷰"       |
| DDD 설계     | `ddd-architect`         | "DDD", "아키텍처", "도메인 설계"     |
| DB 작업      | `database-specialist`   | "DB", "데이터베이스", "스키마"       |
| Supabase     | `supabase-architect`    | "Supabase", "RPC", "supabase 연동"   |

## Workflow: SDD + ADD

### SDD (Spec-Driven Development) - Phase 1-3

```
/speckit.specify → specs/{domain}/spec.md
/speckit.plan → specs/{domain}/plan.md
/speckit.tasks → specs/{domain}/tasks.md
```

### ADD (Agent-Driven Development) - Phase 4

```
v0.0.x CONFIG → 환경 설정
v0.1.x PROJECT → 도메인 구조 생성
v0.2.x TESTS → TDD 테스트 작성
v0.3.x DATA → 타입, 인터페이스 정의
v0.4.x CODE → 구현 코드 작성
```

### Verification - Phase 5

```
skill:verify → 종합 검증
skill:check-team-codex → 팀 코덱스 준수 확인
skill:validate-architecture → DDD 아키텍처 검증
```

## Architecture: DDD 4-Layer

```
src/app/{domain}/
├── _repositories/     # 서버사이드 데이터 접근 (Layer 1)
├── _api-clients/      # 브라우저 HTTP 통신 (Layer 2)
├── _hooks/            # React 상태 관리 (Layer 3)
├── _components/       # 도메인 전용 UI (Layer 4)
└── page.tsx
```

## Package Components

### Agents

| Agent                 | 역할             | 파일                                    |
| --------------------- | ---------------- | --------------------------------------- |
| orchestrator          | 요청 라우팅      | `agents/orchestrator.md`                |
| spec-master           | SDD Phase 1-3    | `agents/spec-master.md`                 |
| implementation-master | ADD Phase 4      | `agents/implementation-master.md`       |
| quality-master        | Phase 5 검증     | `agents/quality-master.md`              |
| spike-master          | 기술 탐색        | `agents/spike-master.md`                |
| migration-master      | 마이그레이션     | `agents/migration-master.md`            |
| teacher               | 학습 안내        | `agents/teacher.md`                     |
| advisor               | 조언 제공        | `agents/advisor.md`                     |
| semicolon-reviewer    | 코드 리뷰        | `agents/semicolon-reviewer.md`          |
| ddd-architect         | DDD 아키텍처     | `agents/ddd-architect.md`               |
| database-specialist   | DB 전문가        | `agents/database-specialist.md`         |
| supabase-architect    | Supabase 통합    | `agents/supabase-architect.md`          |

### Skills

| Skill                  | 역할                   |
| ---------------------- | ---------------------- |
| spec                   | SDD 명세 워크플로우    |
| implement              | ADD 구현 워크플로우    |
| verify                 | Phase 5 종합 검증      |
| check-team-codex       | 팀 코덱스 검증         |
| validate-architecture  | DDD 아키텍처 검증      |
| scaffold-domain        | 도메인 구조 생성       |
| fetch-supabase-example | Supabase 패턴 참조     |
| fetch-api-spec         | API 스펙 참조          |
| git-workflow           | Git 워크플로우 자동화  |
| create-issues          | GitHub Issues 생성     |
| project-context        | 프로젝트 컨텍스트 제공 |

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

## Installation & Update

### 설치 방법

```bash
# 대상 레포로 이동 (예: cm-land)
cd semicolon-devteam/cm-land

# .claude 디렉토리 생성 (없으면)
mkdir -p .claude/agents .claude/skills

# SAX-Next 패키지 복사
cp docs/sax/packages/sax-next/CLAUDE.md .claude/
cp -r docs/sax/packages/sax-next/agents/* .claude/agents/
cp -r docs/sax/packages/sax-next/skills/* .claude/skills/
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

## PO 연동 (SAX-PO)

SAX-PO에서 생성된 Epic은 다음과 같이 연동됩니다:

1. **PO (SAX-PO)**: Epic 생성 → docs 레포에 이슈 생성
2. **PO (SAX-PO)**: (선택) Spec 초안 생성
3. **개발자 (SAX-Next)**: `/speckit.specify`로 spec.md 보완
4. **개발자 (SAX-Next)**: `/speckit.plan`, `/speckit.tasks`
5. **개발자 (SAX-Next)**: `implementation-master`로 구현
6. **개발자 (SAX-Next)**: `quality-master`로 검증
7. **개발자/PO**: `skill:sync-tasks`로 GitHub Issues 동기화

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Team Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/TEAM_RULES.md)
- [SAX Changelog](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG.md)
- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [Development Philosophy](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy)
