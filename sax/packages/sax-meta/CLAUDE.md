# SAX-Meta Package Configuration

> SAX 패키지 자체 관리 및 개발을 위한 메타 패키지

## Package Info

- **Package**: SAX-Meta
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: docs repository (SAX Source of Truth)
- **Audience**: SAX 개발자, SAX 패키지 관리자
- **Extends**: SAX-Core

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

@sax-core/PRINCIPLES.md
@sax-core/MESSAGE_RULES.md

> 📖 Core 문서는 `.claude/sax-core/` 디렉토리에서 자동 로드됩니다.

## Package Purpose

SAX-Meta는 SAX 패키지 자체를 관리하고 개발하기 위한 **메타 패키지**입니다.

### 대상 사용자

- **SAX 개발자**: SAX 프레임워크를 개선하고 확장하는 개발자
- **패키지 관리자**: SAX 패키지 구조, 버저닝, 배포를 담당하는 관리자

### 비대상 사용자

- ❌ **PO/기획자**: SAX-PO 패키지 사용
- ❌ **Next.js 개발자**: SAX-Next 패키지 사용
- ❌ **Spring 개발자**: SAX-Spring 패키지 사용

## 설치 대상

이 패키지는 `semicolon-devteam/docs` 레포지토리의 `.claude/` 디렉토리에 설치됩니다.

### docs 레포 한정 동기화 규칙

> ⚠️ **중요**: docs 레포지토리에서 SAX-Meta 개선 작업 시, 다음 두 위치를 **동시에** 업데이트해야 합니다:

| 위치 | 역할 |
|------|------|
| `.claude/sax-meta/` | SAX-Meta 실제 사용 (설치된 상태) |
| `sax/packages/sax-meta/` | SAX-Meta 패키지 소스 (배포용) |

**동기화 명령**:

```bash
rsync -av --delete --exclude='.git' \
  sax/packages/sax-meta/ \
  .claude/sax-meta/
```

## Package Components

### Agents

| Agent | 역할 | 파일 |
|-------|------|------|
| orchestrator | 요청 라우팅 | `agents/orchestrator.md` |
| agent-manager | Agent 라이프사이클 관리 | `agents/agent-manager/` |
| skill-manager | Skill 라이프사이클 관리 | `agents/skill-manager/` |
| command-manager | Command 라이프사이클 관리 | `agents/command-manager/` |
| sax-architect | SAX 패키지 설계 | `agents/sax-architect.md` |

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| package-validator | SAX 패키지 구조 검증 | `skills/package-validator/` |
| version-manager | SAX 버저닝 자동화 | `skills/version-manager/` |
| package-sync | 패키지 소스 → .claude 동기화 | `skills/package-sync/` |
| package-deploy | 외부 프로젝트 SAX 배포 | `skills/package-deploy/` |

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

## Installation & Usage

### SAX-Meta 사용 방법

SAX-Meta는 별도 설치가 필요 없습니다. docs 레포지토리에서 직접 사용합니다.

```bash
# SAX 패키지 개선 작업 시작
cd semicolon-devteam/docs

# "[SAX]" 또는 "[Semicolon AX]" 키워드로 메타 작업 트리거
# 예: "[SAX] 새 Agent 추가해줘"
```

### 다른 패키지와의 관계

```text
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
