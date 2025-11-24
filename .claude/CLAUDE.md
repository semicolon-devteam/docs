# SAX-PO Package Configuration

> PO/기획자를 위한 SAX 패키지

## Package Info

- **Package**: SAX-PO v1.1.0
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

## 설치 대상

이 패키지는 `semicolon-devteam/docs` 레포지토리의 `.claude/` 디렉토리에 설치됩니다.

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

**상속 원칙**:
- Transparency (투명성)
- Consistency (일관성)
- Modularity (모듈성)
- Hierarchy (계층구조)

**참조**: [SAX Core Principles](https://github.com/semicolon-devteam/docs/.claude/sax-core/PRINCIPLES.md)

## Agent Routing

### Primary Router

이 패키지의 모든 요청은 `orchestrator`를 통해 라우팅됩니다.

### Routing Table

| Intent | Route To | Trigger Keywords |
|--------|----------|------------------|
| Epic 생성 | `epic-master` | "Epic 만들어", "기능 정의", "새 기능" |
| Spec 초안 | `spec-writer` | "Spec 초안", "명세 초안" |
| Task 동기화 | `skill:sync-tasks` | "이슈 동기화", "Tasks 생성" |
| 워크플로우 질문 | 직접 응답 | "어떻게 해", "다음 뭐해" |

## Workflow Overview

```
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

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| create-epic | Epic 이슈 생성 | `skills/create-epic/skill.md` |
| sync-tasks | Tasks ↔ Issues 동기화 | `skills/sync-tasks/skill.md` |

### Templates

| Template | 역할 | 파일 |
|----------|------|------|
| epic-template | Epic 이슈 본문 | `templates/epic-template.md` |

## Installation

docs 레포지토리에 설치:

```bash
# docs 레포로 이동
cd semicolon-devteam/docs

# SAX-PO 패키지 복사
cp -r {source}/.claude/sax-po/* .claude/
```

## Versioning Rules

SAX 패키지 변경 시 반드시 버저닝을 수행합니다.

### Semantic Versioning

- **MAJOR** (x.0.0): 호환성 깨지는 변경, 구조 대폭 변경
- **MINOR** (0.x.0): 기능 추가, 설정 변경, 새 Agent/Skill 추가
- **PATCH** (0.0.x): 버그 수정, 오타 수정, 문서 보완

### 버저닝 필수 상황

다음 변경 시 반드시 Package Info의 버전을 업데이트:

1. CLAUDE.md 내용 변경
2. Agent/Skill 추가 또는 수정
3. 워크플로우 변경
4. 설정값 변경

### Changelog

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.1.0 | 2025-11-24 | SAX 약어 정의 추가, Source of Truth를 docs로 변경, 버저닝 룰 추가 |
| v1.0.0 | - | 초기 버전 |

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/.claude/sax-core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/.claude/sax-core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/.claude/sax-core/MESSAGE_RULES.md)
