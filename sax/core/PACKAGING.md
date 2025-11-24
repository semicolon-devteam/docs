# SAX Packaging Guide

> SAX 패키지 정의 및 레포지토리별 구성 가이드

## 1. 패키지 정의

### 1.1 공식 패키지 목록

| Package | 대상 레포 | 역할 | 상태 |
|---------|----------|------|------|
| **SAX-Core** | command-center | 공통 원칙, 규칙 | Active |
| **SAX-PO** | docs | PO/기획자용 에이전트 | Active |
| **SAX-Next** | cm-template, cm-* | Next.js 개발용 | Active |
| **SAX-Spring** | core-backend | Spring Boot 개발용 | Planned |
| **SAX-Infra** | devops 관련 | 인프라/배포용 | Planned |

### 1.2 패키지 계층 구조

```
SAX-Core (command-center)
│
│   ┌─────────────────────────────────────────┐
│   │ 공통 요소                                │
│   │ - PRINCIPLES.md (기본 원칙)              │
│   │ - MESSAGE_RULES.md (메시지 규칙)         │
│   │ - PACKAGING.md (패키지 가이드)           │
│   │ - agents/orchestrator.md (공통)         │
│   │ - agents/sax-architect.md (공통)        │
│   │ - skills/git-workflow/ (공통)           │
│   └─────────────────────────────────────────┘
│
├── SAX-PO (docs)
│   │ ┌─────────────────────────────────────────┐
│   │ │ PO 전용 요소                            │
│   │ │ - agents/epic-master.md                │
│   │ │ - agents/spec-writer.md                │
│   │ │ - skills/create-epic/                  │
│   │ │ - skills/sync-tasks/                   │
│   │ │ - templates/epic-template.md           │
│   │ └─────────────────────────────────────────┘
│
├── SAX-Next (cm-template)
│   │ ┌─────────────────────────────────────────┐
│   │ │ Next.js 개발 전용 요소                   │
│   │ │ - agents/implementation-master.md      │
│   │ │ - agents/spec-master.md                │
│   │ │ - agents/quality-master.md             │
│   │ │ - skills/scaffold-domain/              │
│   │ │ - skills/fetch-api-spec/               │
│   │ │ - skills/fetch-supabase-example/       │
│   │ └─────────────────────────────────────────┘
│
└── SAX-Spring (core-backend) [Planned]
    │ ┌─────────────────────────────────────────┐
    │ │ Spring Boot 개발 전용 요소              │
    │ │ - agents/spring-master.md              │
    │ │ - agents/api-designer.md               │
    │ │ - skills/entity-generator/             │
    │ │ - skills/rpc-generator/                │
    │ └─────────────────────────────────────────┘
```

---

## 2. SAX-Core (command-center)

### 2.1 역할

- SAX 기본 원칙 정의 (Single Source of Truth)
- 공통 에이전트/스킬 제공
- 패키지 표준 정의

### 2.2 디렉토리 구조

```
command-center/.claude/
├── sax-core/
│   ├── PRINCIPLES.md       # SAX 기본 원칙
│   ├── MESSAGE_RULES.md    # 메시지 포맷 규칙
│   └── PACKAGING.md        # 패키지 가이드 (이 문서)
├── agents/
│   ├── orchestrator.md     # 공통 라우터
│   └── sax-architect.md    # SAX 메타 관리
├── skills/
│   └── git-workflow/       # 공통 Git 워크플로우
└── CLAUDE.md               # command-center 컨텍스트
```

### 2.3 참조 방법

다른 패키지에서 Core 참조:

```markdown
# CLAUDE.md에서

## SAX Core Reference

SAX 기본 원칙은 command-center의 sax-core를 따릅니다.

- 원칙: https://github.com/semicolon-devteam/command-center/blob/main/.claude/sax-core/PRINCIPLES.md
- 메시지 규칙: https://github.com/semicolon-devteam/command-center/blob/main/.claude/sax-core/MESSAGE_RULES.md
```

---

## 3. SAX-PO (docs)

### 3.1 역할

- PO/기획자가 Epic 생성
- Spec 초안 작성
- GitHub Issues 동기화

### 3.2 대상 사용자

- Product Owner (PO)
- 기획자
- 프로젝트 매니저

### 3.3 디렉토리 구조

```
docs/.claude/
├── agents/
│   ├── orchestrator.md     # Core 상속 + PO 라우팅
│   ├── epic-master.md      # Epic 생성 전문
│   └── spec-writer.md      # Spec 초안 작성
├── skills/
│   ├── create-epic/        # Epic 생성
│   │   └── skill.md
│   └── sync-tasks/         # tasks.md → Issues 동기화
│       └── skill.md
├── templates/
│   └── epic-template.md    # 간소화된 Epic 템플릿
└── CLAUDE.md               # SAX-PO 선언
```

### 3.4 주요 에이전트

| Agent | 트리거 | 역할 |
|-------|--------|------|
| `epic-master` | "Epic 만들어줘", "기능 정의" | Epic 생성 |
| `spec-writer` | "Spec 초안", "명세 작성" | Spec 초안 생성 |

### 3.5 주요 스킬

| Skill | 트리거 | 역할 |
|-------|--------|------|
| `create-epic` | epic-master 호출 | Epic 이슈 생성 |
| `sync-tasks` | "동기화", "이슈 생성" | tasks.md → GitHub Issues |

---

## 4. SAX-Next (cm-template)

### 4.1 역할

- Next.js 기반 프론트엔드 개발
- DDD 아키텍처 구현
- Supabase 연동

### 4.2 대상 사용자

- 프론트엔드 개발자
- 풀스택 개발자

### 4.3 디렉토리 구조

```
cm-template/.claude/
├── agents/
│   ├── orchestrator.md           # Core 상속 + Next 라우팅
│   ├── sax-architect.md          # SAX 메타 관리
│   ├── implementation-master.md  # 구현 담당
│   ├── spec-master.md            # 명세 담당
│   ├── quality-master.md         # 품질 검증
│   ├── spike-master.md           # 기술 탐색
│   ├── teacher.md                # 학습 지원
│   └── advisor.md                # 조언
├── skills/
│   ├── scaffold-domain/          # DDD 도메인 스캐폴딩
│   ├── fetch-api-spec/           # API 스펙 조회
│   ├── fetch-supabase-example/   # Supabase 예제 조회
│   ├── verify/                   # 품질 검증
│   ├── git-workflow/             # Git 워크플로우
│   └── project-context/          # 프로젝트 컨텍스트
└── CLAUDE.md                     # SAX-Next 선언
```

### 4.4 주요 에이전트

| Agent | 트리거 | 역할 |
|-------|--------|------|
| `implementation-master` | "구현해줘", "코드 작성" | ADD Phase 4 구현 |
| `spec-master` | "명세 작성", `/speckit.*` | SDD Phase 1-3 |
| `quality-master` | "검증해줘", "PR 전에" | Phase 5 검증 |
| `spike-master` | "A vs B", "어떤게 좋아" | 기술 탐색 |

### 4.5 주요 스킬

| Skill | 트리거 | 역할 |
|-------|--------|------|
| `scaffold-domain` | v0.1.x PROJECT | DDD 디렉토리 생성 |
| `fetch-api-spec` | API 구현 시 | core-interface 스펙 조회 |
| `fetch-supabase-example` | Supabase 연동 시 | core-supabase 예제 조회 |
| `verify` | 구현 완료 후 | 품질 검증 |

---

## 5. SAX-Spring (core-backend) [Planned]

### 5.1 역할

- Spring Boot 백엔드 개발
- API 설계 및 구현
- 데이터베이스 엔티티 관리

### 5.2 대상 사용자

- 백엔드 개발자

### 5.3 예상 구조

```
core-backend/.claude/
├── agents/
│   ├── orchestrator.md       # Core 상속 + Spring 라우팅
│   ├── spring-master.md      # Spring 구현 담당
│   └── api-designer.md       # API 설계
├── skills/
│   ├── entity-generator/     # JPA Entity 생성
│   └── rpc-generator/        # RPC 함수 생성
└── CLAUDE.md                 # SAX-Spring 선언
```

---

## 6. 패키지 CLAUDE.md 템플릿

### 6.1 기본 구조

```markdown
# CLAUDE.md

## SAX Configuration

**Package**: SAX-{PackageName}
**Version**: 1.0.0
**Core Reference**: https://github.com/semicolon-devteam/command-center/.claude/sax-core/

## SAX Core 원칙

이 레포지토리는 SAX Core 원칙을 따릅니다.

- [SAX Principles](https://github.com/semicolon-devteam/command-center/.claude/sax-core/PRINCIPLES.md)
- [Message Rules](https://github.com/semicolon-devteam/command-center/.claude/sax-core/MESSAGE_RULES.md)

## 패키지 전용 에이전트

| Agent | 역할 |
|-------|------|
| ... | ... |

## 패키지 전용 스킬

| Skill | 역할 |
|-------|------|
| ... | ... |

## 프로젝트 컨텍스트

...
```

---

## 7. 패키지 간 통신

### 7.1 Cross-Package Reference

다른 패키지의 리소스를 참조할 때:

```markdown
[SAX] Reference: command-center/sax-core/PRINCIPLES.md 참조
```

### 7.2 GitHub API를 통한 접근

Private 레포지토리 접근 시:

```bash
gh api repos/semicolon-devteam/{repo}/contents/{path} --jq '.content' | base64 -d
```

### 7.3 패키지 간 의존성

```yaml
SAX-PO:
  depends_on:
    - SAX-Core

SAX-Next:
  depends_on:
    - SAX-Core
  optional:
    - SAX-PO  # Epic 참조 시

SAX-Spring:
  depends_on:
    - SAX-Core
  optional:
    - SAX-Next  # API 연동 시
```

---

## 8. 마이그레이션 가이드

### 8.1 기존 레포지토리에 SAX 패키지 적용

1. `.claude/` 디렉토리 생성
2. 패키지에 맞는 에이전트/스킬 복사
3. CLAUDE.md에 SAX Configuration 추가
4. 기존 워크플로우와 통합 테스트

### 8.2 버전 업그레이드

Core 버전 업그레이드 시:

1. CHANGELOG 확인
2. Breaking Changes 검토
3. 패키지별 호환성 테스트
4. CLAUDE.md의 core_version 업데이트

---

## 9. 참조

- [SAX Principles](./PRINCIPLES.md)
- [Message Rules](./MESSAGE_RULES.md)
- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
