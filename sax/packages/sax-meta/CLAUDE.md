# SAX-Meta Package Configuration

> SAX 패키지 자체 관리 및 개발을 위한 메타 패키지

## Package Info

- **Package**: SAX-Meta
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: docs repository (SAX Source of Truth)
- **Audience**: SAX 개발자, SAX 패키지 관리자
- **Extends**: SAX-Core (docs)

## SAX란?

**SAX** = **S**emicolon **A**I Transformation

Semicolon 팀의 AI 기반 개발 워크플로우 자동화 프레임워크입니다.

## Package Purpose

SAX-Meta는 SAX 패키지 자체를 관리하고 개발하기 위한 **메타 패키지**입니다.

### 대상 사용자

- **SAX 개발자**: SAX 프레임워크를 개선하고 확장하는 개발자
- **패키지 관리자**: SAX 패키지 구조, 버저닝, 배포를 담당하는 관리자

### 비대상 사용자

- ❌ **PO/기획자**: SAX-PO 패키지 사용
- ❌ **Next.js 개발자**: SAX-Next 패키지 사용
- ❌ **Spring 개발자**: SAX-Spring 패키지 사용

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

# 최신 버전 CHANGELOG 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/3.8.0.md \
  --jq '.content' | base64 -d

# 특정 버전 CHANGELOG 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/2.8.0.md \
  --jq '.content' | base64 -d
```

**확인 시점**: 업데이트 작업 시작 직후
**반영 범위**: 현재 버전 이후의 모든 변경사항

## 설치 대상

이 패키지는 `semicolon-devteam/docs` 레포지토리 전용입니다.

**설치 위치**: SAX 개발 작업 시에만 사용, `.claude/`에 설치하지 않음

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

## Package Components

### Agents

| Agent | 역할 | 파일 |
|-------|------|------|
| sax-architect | SAX 패키지 구조 설계 및 관리 | `agents/sax-architect.md` |
| command-creator | SAX 슬래시 커맨드 생성 | `agents/command-creator.md` |
| agent-creator | SAX Agent 생성 자동화 | `agents/agent-creator.md` |

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| skill-creator | SAX Skill 생성 자동화 | `skills/skill-creator/SKILL.md` |
| package-validator | SAX 패키지 구조 검증 | `skills/package-validator/SKILL.md` |
| version-manager | SAX 버저닝 자동화 | `skills/version-manager/SKILL.md` |

### Scripts

| Script | 역할 | 파일 |
|--------|------|------|
| sync_packages.sh | 패키지 동기화 자동화 | `scripts/sync_packages.sh` |

### Templates

| Template | 역할 | 파일 |
|----------|------|------|
| agent-template | Agent 파일 템플릿 | `templates/agent-template.md` |
| skill-template | Skill 디렉토리 템플릿 | `templates/skill-template/` |
| package-template | 패키지 구조 템플릿 | `templates/package-template/` |

## SAX Message Rules

이 패키지의 모든 Agent/Skill은 SAX 메시지 규칙을 준수합니다.

📖 **상세**: [SAX Core MESSAGE_RULES.md](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)

### 핵심 메시지 규칙 (Quick Reference)

**기본 포맷**:

```markdown
[SAX] {Type}: {name} {action}
```

**필수 요소**:

- `Type`: `Orchestrator`, `Agent`, `Skill`, `Reference`
- 각 메시지 별도 줄 출력
- 메시지 간 빈 줄 삽입

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

### Single Source of Truth

SAX의 버전과 변경 기록은 다음 파일에서만 관리됩니다:

| 파일 | 역할 | 설명 |
|------|------|------|
| 📌 `sax/VERSION` | 버전 번호 | 현재 버전 (예: `3.8.0`) |
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
📝 [SAX] v3.8.0
```

### Changelog

📋 **[sax/CHANGELOG/INDEX.md](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md) 참조**

각 버전의 상세 변경사항은 `sax/CHANGELOG/{version}.md` 파일에서 확인할 수 있습니다.

## Installation & Usage

### SAX-Meta 사용 방법

SAX-Meta는 별도 설치가 필요 없습니다. docs 레포지토리에서 직접 사용합니다.

```bash
# SAX 패키지 개선 작업 시작
cd semicolon-devteam/docs

# "Semicolon AX" 키워드로 메타 작업 트리거
# 예: "Semicolon AX - 새 Agent 추가해줘"
```

### 다른 패키지와의 관계

```
SAX-Meta (메타 관리)
    ↓ 관리
SAX-Core (공통 규칙)
    ↓ 상속
SAX-PO, SAX-Next, SAX-Spring (도메인 패키지)
```

- SAX-Meta는 다른 모든 SAX 패키지를 관리
- SAX-PO/Next/Spring은 SAX-Meta를 직접 사용하지 않음
- 최종 사용자(PO/개발자)는 SAX-Meta를 인지할 필요 없음

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Team Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/TEAM_RULES.md)
- [SAX Changelog Index](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md)
