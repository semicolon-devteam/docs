# SAX Core Principles

> **SAX (Semicolon Agent eXperience)**: Semicolon 팀의 AI 에이전트 협업 표준

## 1. 핵심 원칙

### 1.1 투명성 (Transparency)

모든 AI 에이전트 동작은 사용자에게 **명시적으로 노출**되어야 합니다.

- Agent 활성화 시 SAX 메시지 출력
- Skill 사용 시 SAX 메시지 출력
- 외부 참조 시 SAX 메시지 출력

### 1.2 일관성 (Consistency)

모든 SAX 패키지는 **동일한 메시지 포맷**을 사용합니다.

```markdown
[SAX] {Type}: {name} {action}
```

### 1.3 모듈성 (Modularity)

SAX는 **패키지 단위로 분리**되어 각 레포지토리에 맞게 구성됩니다.

- SAX-Core: 공통 원칙 및 규칙
- SAX-PO: PO/기획자용 에이전트
- SAX-Next: Next.js 개발용 에이전트
- SAX-Spring: Spring Boot 개발용 에이전트

### 1.4 계층성 (Hierarchy)

```
SAX-Core (command-center)
    │
    ├── SAX-PO (docs)
    ├── SAX-Next (cm-template, cm-*)
    └── SAX-Spring (core-backend)
```

각 패키지는 Core를 **상속**하고 **확장**합니다.

---

## 2. SAX 메시지 규칙

### 2.1 필수 메시지 타입

| Type | 설명 | 예시 |
|------|------|------|
| `Agent` | 에이전트 활성화 | `[SAX] Agent: epic-master 호출` |
| `Skill` | 스킬 사용 | `[SAX] Skill: create-epic 사용` |
| `Reference` | 외부 참조 | `[SAX] Reference: core-supabase 참조` |
| `Orchestrator` | 라우팅 결정 | `[SAX] Orchestrator: 의도 분석 완료` |

### 2.2 메시지 포맷

```markdown
[SAX] {Type}: {name} {action} (사유: {reason})
```

**필수 요소**:
- `[SAX]` 접두사
- `Type`: Agent, Skill, Reference, Orchestrator 중 하나
- `name`: 에이전트/스킬/참조 대상 이름
- `action`: 동작 (호출, 사용, 참조, 위임 등)

**선택 요소**:
- `(사유: {reason})`: 왜 이 동작을 하는지 설명

### 2.3 메시지 출력 규칙

1. **각 SAX 메시지는 별도의 줄에 출력**
2. **SAX 메시지들 사이에 빈 줄 삽입**
3. **SAX 메시지 출력 후 일반 텍스트 시작 전에도 빈 줄 필수**

**예시**:
```markdown
[SAX] Orchestrator: 의도 분석 완료 → Epic 생성 요청

[SAX] Agent: epic-master 호출 (사유: Epic 생성)

## Epic 생성을 시작합니다

...
```

---

## 3. Orchestrator 원칙

### 3.1 Routing-Only Policy

Orchestrator는 **라우팅만 담당**합니다.

**허용**:
- 의도 분석
- 적절한 Agent 선택
- Agent 위임

**금지**:
- 직접 코드 작성
- 직접 파일 생성
- 직접 명세 작성

### 3.2 라우팅 실패 처리

적절한 Agent가 없는 경우, **반드시 사용자에게 알림**:

```markdown
[SAX] Orchestrator: 라우팅 실패 → 적절한 Agent 없음

⚠️ **직접 처리 필요**

현재 요청에 적합한 전담 Agent가 없습니다.
```

---

## 4. Agent 원칙

### 4.1 단일 책임

각 Agent는 **하나의 도메인**에만 집중합니다.

| Agent | 책임 |
|-------|------|
| epic-master | Epic 생성 |
| spec-master | Spec 작성 |
| implementation-master | 코드 구현 |
| quality-master | 품질 검증 |

### 4.2 SAX 규칙 준수

모든 Agent는 다음을 준수합니다:

1. Skill 사용 시 SAX 메시지 출력
2. Reference 참조 시 SAX 메시지 출력
3. 다른 Agent 호출 시 Orchestrator를 통해 위임

### 4.3 컨텍스트 보존

Agent는 작업 중 다음을 항상 표시합니다:

- 현재 브랜치
- 관련 이슈 번호
- 현재 Phase (SDD/ADD)

---

## 5. Skill 원칙

### 5.1 명시적 트리거

Skill은 다음 방식으로만 실행됩니다:

- 명시적 호출: `skill:{name}`
- Agent에 의한 호출
- 자동 트리거 조건 충족

### 5.2 SAX 메시지 출력

Skill 실행 시 반드시 SAX 메시지 출력:

```markdown
[SAX] Skill: {skill-name} 사용
```

### 5.3 부작용 최소화

Skill은 **선언된 동작만** 수행합니다.

- 예상치 못한 파일 생성 금지
- 예상치 못한 외부 API 호출 금지
- 예상치 못한 상태 변경 금지

---

## 6. 패키지 확장 규칙

### 6.1 Core 상속

모든 SAX 패키지는 Core 원칙을 상속합니다.

```markdown
# 각 패키지의 CLAUDE.md에서

## SAX 패키지

이 레포지토리는 **SAX-{PackageName}** 패키지를 사용합니다.

SAX Core 원칙: https://github.com/semicolon-devteam/command-center/.claude/sax-core/PRINCIPLES.md
```

### 6.2 확장 허용 범위

패키지는 다음을 확장할 수 있습니다:

- 새로운 Agent 추가
- 새로운 Skill 추가
- 도메인 특화 규칙 추가

패키지는 다음을 **변경할 수 없습니다**:

- SAX 메시지 포맷
- Orchestrator 원칙
- Core 메시지 규칙

### 6.3 패키지 선언

각 레포지토리의 CLAUDE.md에서 패키지 선언:

```markdown
## SAX Configuration

**Package**: SAX-Next
**Version**: 1.0.0
**Core Reference**: command-center/.claude/sax-core/
```

---

## 7. 버전 관리

### 7.1 Core 버전

SAX Core는 시맨틱 버저닝을 따릅니다:

- **Major**: 호환되지 않는 변경
- **Minor**: 하위 호환되는 기능 추가
- **Patch**: 버그 수정

### 7.2 패키지 호환성

각 패키지는 지원하는 Core 버전을 명시합니다:

```yaml
sax:
  package: SAX-Next
  core_version: ">=1.0.0 <2.0.0"
```

---

## 8. 참조

- **SAX Message Rules**: [MESSAGE_RULES.md](./MESSAGE_RULES.md)
- **Packaging Guide**: [PACKAGING.md](./PACKAGING.md)
- **Team Codex**: https://github.com/semicolon-devteam/docs/wiki/Team-Codex
