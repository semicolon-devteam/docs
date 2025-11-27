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

> ⚠️ **중요**: SAX 업데이트 진행 시, **반드시** CHANGELOG를 확인하고 변경사항을 **즉시 반영**해야 합니다.

```bash
# CHANGELOG INDEX 확인 (버전 목록)
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/INDEX.md \
  --jq '.content' | base64 -d

# 최신 버전 CHANGELOG 확인 (예: 3.6.0)
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/3.6.0.md \
  --jq '.content' | base64 -d

# 특정 버전 CHANGELOG 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/2.8.0.md \
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
| `.claude/sax-po/` | SAX-PO 실제 사용 (설치된 상태) |
| `sax/packages/sax-po/` | SAX-PO 패키지 소스 (배포용) |

**동기화 대상**: CLAUDE.md, agents/, skills/, templates/, commands/

**동기화 명령**:

```bash
# SAX-PO 소스 → .claude/sax-po/ 동기화
rsync -av --delete --exclude='.git' \
  sax/packages/sax-po/ \
  .claude/sax-po/
```

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

**상속 원칙**:

- Transparency (투명성)
- Consistency (일관성)
- Modularity (모듈성)
- Hierarchy (계층구조)

### SAX Core 컨텍스트 우선 조회 (필수)

> ⚠️ **최우선 규칙**: SAX 관련 작업 시작 전, SAX Core 문서를 **먼저 조회**하여 컨텍스트를 확보해야 합니다.

**조회가 필요한 상황**:

1. **SAX 메시지 규칙** 관련 작업 (Agent/Skill/Reference 메시지 출력)
2. **Orchestrator 라우팅** 관련 질문 또는 개선
3. **패키지 구조 변경** (Agent/Skill 추가, 삭제, 수정)
4. **버저닝** 관련 작업
5. **SAX 규칙 충돌** 발생 시

**조회 절차**:

1. **Reference 메시지 출력**:

   ```markdown
   [SAX] Reference: sax/core/{문서명} 참조
   ```

2. **SAX Core 문서 조회**:

   ```bash
   # 기본 원칙
   gh api repos/semicolon-devteam/docs/contents/sax/core/PRINCIPLES.md \
     --jq '.content' | base64 -d

   # 메시지 규칙
   gh api repos/semicolon-devteam/docs/contents/sax/core/MESSAGE_RULES.md \
     --jq '.content' | base64 -d
   ```

3. **조회 결과를 컨텍스트로 보유**

4. **이후 작업 진행**

**중요**: SAX Core 컨텍스트 없이 SAX 관련 작업을 진행하지 마세요. 잘못된 메시지 포맷이나 규칙 위반이 발생할 수 있습니다.

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

**기본 포맷**:

```markdown
[SAX] {Type}: {name} {action}
```

**필수 요소**:

- `Type`: `Orchestrator`, `Agent`, `Skill`, `Reference`
- 각 메시지 별도 줄 출력
- 메시지 간 빈 줄 삽입

📖 **상세**: [SAX Core MESSAGE_RULES.md](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)

## Orchestrator-First Policy (필수)

> 🚨 **강제 규칙**: SAX-PO 환경에서는 **Orchestrator 메시지 없이 그 어떤 응답도 하지 않습니다.**

### 강제 체크 프로세스

**Claude는 SAX-PO 패키지가 활성화된 상태에서 다음 절차를 반드시 따릅니다:**

1. **요청 수신 즉시** Orchestrator 의도 분석 수행
2. **`[SAX] Orchestrator:` 메시지를 첫 번째로 출력**
3. 그 후에만 Agent 위임 또는 직접 응답 진행

### ❌ 절대 금지

- Orchestrator 메시지 없이 바로 응답
- Orchestrator 메시지 없이 Agent 호출
- Orchestrator 메시지 없이 Skill 실행
- Orchestrator 메시지 없이 코드/분석 결과 제공

**위반 발견 시**: 해당 응답은 무효이며, Orchestrator 메시지부터 다시 시작해야 합니다.

### SAX 시스템 메시지 체이닝

모든 SAX 작업은 다음 메시지 체인을 따릅니다:

```markdown
[SAX] Orchestrator: 의도 분석 완료 → {category}

[SAX] Agent 위임: {agent_name} (사유: {reason})

[SAX] Agent: {agent_name} 호출 - {context}

[SAX] Skill: {skill_name} 사용

[SAX] Reference: {resource_path} 참조
```

**필수 규칙**:

- 각 메시지는 별도 줄에 출력
- 메시지 간 빈 줄 삽입
- **Orchestrator 메시지가 항상 첫 번째**

### 올바른 예시

```markdown
User: 7번 에픽으로 Task 만들어줘

[SAX] Orchestrator: 의도 분석 완료 → Draft Task 생성 요청

[SAX] Agent 위임: draft-task-creator (사유: Epic #7 기반 Draft Task 생성)

[SAX] Agent: draft-task-creator 호출 - Epic #7

[이후 작업 내용...]
```

### 직접 응답 케이스 (Agent 위임 생략)

다음 경우에만 Agent 위임을 생략하고 직접 응답합니다. **단, Orchestrator 메시지는 여전히 필수입니다.**

- 단순 정보 질문: "이게 뭐야?", "설명해줘"
- 일반 대화: 인사, 감사, 확인

```markdown
User: SAX가 뭐야?

[SAX] Orchestrator: 의도 분석 완료 → 단순 정보 질문 (직접 응답)

SAX는 Semicolon AI Transformation의 약자로...
```

### Agent Routing

라우팅 판단은 [Orchestrator Agent](agents/orchestrator.md)가 직접 수행합니다.

CLAUDE.md에는 라우팅 테이블을 두지 않으며, Orchestrator가 요청의 의도를 분석하여 적절한 Agent로 위임합니다.

## 개발자 연동

SAX-PO로 생성된 Epic은 개발자(SAX-Next)와 다음과 같이 연동됩니다:

1. **PO**: Epic 생성 → docs 레포에 이슈 생성
2. **PO**: Draft Task 생성 → 서비스 레포/core-backend에 Draft Task Issues 생성
3. **개발자**: 할당된 Draft Task 확인
4. **개발자**: 대상 레포에서 `/speckit.specify` 실행
5. **개발자**: spec.md 보완 후 `/speckit.plan`, `/speckit.tasks`
6. **개발자**: Draft Task Issue 업데이트 (tasks/ 내용 반영, draft 라벨 제거)

## Package Components

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| health-check | 개발 환경 검증 | `skills/health-check/skill.md` |
| create-epic | Epic 이슈 생성 | `skills/create-epic/skill.md` |
| assign-project-label | 프로젝트 라벨 및 Projects 연결 | `skills/assign-project-label/SKILL.md` |
| detect-project-from-epic | Epic 프로젝트 라벨 감지 | `skills/detect-project-from-epic/SKILL.md` |
| check-backend-duplication | core-backend 중복 체크 | `skills/check-backend-duplication/SKILL.md` |
| assign-estimation-point | Estimation Point 할당 | `skills/assign-estimation-point/SKILL.md` |
| generate-acceptance-criteria | AC 자동 생성 | `skills/generate-acceptance-criteria/SKILL.md` |
| create-design-task | 디자인 Task 생성 | `skills/create-design-task/SKILL.md` |
| validate-task-completeness | Draft Task 필수 항목 검증 | `skills/validate-task-completeness/SKILL.md` |
| auto-label-by-scope | Epic 범위 기반 자동 라벨링 | `skills/auto-label-by-scope/SKILL.md` |
| estimate-epic-timeline | Epic 전체 일정 예측 | `skills/estimate-epic-timeline/SKILL.md` |
| check-team-codex | 팀 규칙 검증 | `skills/check-team-codex/SKILL.md` |

### Commands

| Command           | 역할                    | 파일                      |
| ----------------- | ----------------------- | ------------------------- |
| /SAX:onboarding   | 신규 PO/기획자 온보딩   | `commands/SAX/onboarding.md`  |
| /SAX:health-check | 개발 환경 검증          | `commands/SAX/health-check.md`|
| /SAX:help         | 대화형 도우미 (PO/기획자)| `commands/SAX/help.md`        |

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
| 📌 `sax/VERSION` | 버전 번호 | 현재 버전 (예: `3.6.0`) |
| 📋 `sax/CHANGELOG/` | 변경 기록 | 버전별 CHANGELOG 파일 디렉토리 |
| 📋 `sax/CHANGELOG/INDEX.md` | CHANGELOG 인덱스 | 버전 목록 및 참조 방법 |

> ⚠️ **중요**: 다른 모든 파일은 위 파일들을 **참조**해야 합니다. 버전 정보를 직접 하드코딩하지 마세요.

### 버저닝 체크리스트

버전 변경 시 **반드시** 다음 순서로 수행:

1. ✅ `sax/VERSION` - 버전 번호 업데이트
2. ✅ `sax/CHANGELOG/{version}.md` - 새 버전 CHANGELOG 작성
3. ✅ `sax/CHANGELOG/INDEX.md` - Latest Version 및 Version History 업데이트
4. ✅ **커밋 수행** - 형식: `📝 [SAX] vX.X.X`

**커밋 메시지 예시**:

```text
📝 [SAX] v3.7.0
```

### Changelog

📋 **[sax/CHANGELOG/INDEX.md](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md) 참조**

각 버전의 상세 변경사항은 `sax/CHANGELOG/{version}.md` 파일에서 확인할 수 있습니다.

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Team Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/TEAM_RULES.md)
- [SAX Changelog Index](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md)
