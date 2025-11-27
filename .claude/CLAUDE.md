# SAX-Meta Configuration (docs 레포 전용)

> SAX 패키지 관리 및 개발을 위한 메타 환경

## Package Info

- **Package**: SAX-Meta
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: docs repository (SAX Source of Truth)
- **Audience**: SAX 개발자, SAX 패키지 관리자

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

@sax-core/PRINCIPLES.md
@sax-core/MESSAGE_RULES.md

> 📖 Core 문서는 `.claude/sax-core/` 디렉토리에서 자동 로드됩니다.

## 패키지 구조

```
.claude/
├── CLAUDE.md           # 이 파일 (SAX-Meta 진입점)
├── sax-core/           # SAX Core 규칙
│   ├── PRINCIPLES.md
│   ├── MESSAGE_RULES.md
│   ├── PACKAGING.md
│   └── TEAM_RULES.md
└── sax-meta/           # SAX-Meta 패키지
    ├── agents/
    ├── skills/
    ├── scripts/
    └── templates/
```

## 🔴 SAX 개발 필수 원칙

### 1. 세션 컨텍스트 비의존 원칙

> **SAX는 세션 컨텍스트에 의지하지 않는다.**

- 꼭 필요한 원칙과 규칙은 **sax-core**, **docs 레포지토리 내 문서**를 통해 참조되어야 함
- Agent, Skill의 **Reference Chain** 안에서 모든 필수 정보가 접근 가능해야 함
- 세션이 종료되거나 컨텍스트가 손실되어도 동일한 결과를 보장

**Reference Chain 구조**:

```text
Agent/Skill → references/ → sax-core/ → docs 레포 문서
```

### 2. 중복 체크 필수 원칙

> **어떤 문서를 생성하거나 수정하든, 반드시 중복 체크를 먼저 수행한다.**

**체크 범위**:

- `sax/core/` - Core 규칙 문서
- `sax/packages/{package}/agents/` - Agent 정의
- `sax/packages/{package}/skills/` - Skill 정의
- `docs/` 레포지토리 내 관련 문서 (wiki 포함)

**중복 발견 시**:

1. 기존 문서 수정 우선
2. 새 문서 생성 시 기존 문서 참조(@import)
3. 절대로 동일 내용을 복사하지 않음

---

## Package Components

### Agents

| Agent | 역할 | 파일 |
|-------|------|------|
| orchestrator | 요청 라우팅 | `sax-meta/agents/orchestrator.md` |
| agent-manager | Agent 라이프사이클 관리 | `sax-meta/agents/agent-manager/` |
| skill-manager | Skill 라이프사이클 관리 | `sax-meta/agents/skill-manager/` |
| command-manager | Command 라이프사이클 관리 | `sax-meta/agents/command-manager/` |
| sax-architect | SAX 패키지 설계 | `sax-meta/agents/sax-architect.md` |

### Skills

| Skill | 역할 | 파일 |
|-------|------|------|
| package-validator | SAX 패키지 구조 검증 | `sax-meta/skills/package-validator/` |
| version-manager | SAX 버저닝 자동화 | `sax-meta/skills/version-manager/` |
| package-sync | 패키지 소스 → .claude 동기화 | `sax-meta/skills/package-sync/` |
| package-deploy | 외부 프로젝트 SAX 배포 | `sax-meta/skills/package-deploy/` |

## 동기화 규칙

docs 레포지토리에서 SAX 패키지 작업 시:

### Core 변경 시

```bash
rsync -av --delete sax/core/ .claude/sax-core/
```

### SAX-Meta 변경 시

```bash
rsync -av --delete sax/packages/sax-meta/ .claude/sax-meta/
```

### 동기화 트리거

- sax/core/ 또는 sax/packages/sax-meta/ 변경 시
- 버저닝 작업 후 (VERSION, CHANGELOG 업데이트 후)
- 커밋 직전

## PO/기획자용 패키지 (SAX-PO)

> ⚠️ **SAX-PO는 별도 레포지토리에서 사용합니다.**

SAX-PO는 기획자 전용 워크스페이스에 배포됩니다:

```bash
# 기획자용 레포에 배포
./sax/scripts/deploy.sh sax-po /path/to/po-workspace
```

**SAX-PO 소스 위치**: `sax/packages/sax-po/`

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Changelog Index](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md)
