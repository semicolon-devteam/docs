# SAX (Semicolon Agent eXperience)

> Semicolon 팀의 AI Agent 협업 표준 패키지

## 개요

SAX는 Claude Code와 같은 AI 에이전트가 Semicolon 팀의 프로젝트에서 일관되게 동작하도록 하는 표준 패키지 시스템입니다.

## 배포 방식 변경 안내 (v3.27.0+)

> **v3.27.0부터 Git Submodule 방식으로 전환되었습니다.**

### 패키지 레포지토리

각 SAX 패키지는 독립 GitHub 레포지토리로 관리됩니다:

| 패키지 | GitHub Repository | 설명 |
|--------|------------------|------|
| sax-core | [semicolon-devteam/sax-core](https://github.com/semicolon-devteam/sax-core) | 공통 원칙 및 규칙 |
| sax-meta | [semicolon-devteam/sax-meta](https://github.com/semicolon-devteam/sax-meta) | SAX 패키지 관리 도구 |
| sax-po | [semicolon-devteam/sax-po](https://github.com/semicolon-devteam/sax-po) | PO/기획자용 |
| sax-next | [semicolon-devteam/sax-next](https://github.com/semicolon-devteam/sax-next) | Next.js 개발자용 |

### 설치 방법 (v3.27.0+)

```bash
# 1. sax-core 설치 (필수)
git submodule add https://github.com/semicolon-devteam/sax-core.git .claude/sax-core

# 2. 도메인 패키지 선택 설치
# PO/기획자용
git submodule add https://github.com/semicolon-devteam/sax-po.git .claude/sax-po

# 또는 Next.js 개발자용
git submodule add https://github.com/semicolon-devteam/sax-next.git .claude/sax-next
```

### 업데이트 방법

```bash
# 모든 서브모듈 최신화
git submodule update --remote

# 변경사항 커밋
git add .claude/
git commit -m "🔧 Update SAX packages"
```

### 팀원 동기화

```bash
# 신규 클론 시
git clone --recurse-submodules <repo-url>

# 기존 레포 업데이트 시
git pull
git submodule update --init --recursive
```

## 패키지 계층

```text
SAX-Core                    ← 기본 원칙, 메시지 규칙 (모든 패키지의 기반)
    ├─ SAX-Meta             ← SAX 패키지 관리용 (docs 레포 전용)
    ├─ SAX-PO               ← PO/기획자용
    ├─ SAX-Next             ← Next.js 개발자용
    └─ SAX-Spring           ← Spring 개발자용 (예정)
```

## 이 디렉토리 구조

```text
sax/
├── VERSION                 # 현재 버전
├── CHANGELOG/              # 변경 이력 (버전별 파일)
│   ├── INDEX.md           # 전체 버전 인덱스
│   ├── 3.27.0.md          # v3.27.0 변경사항 (Git Submodule 전환)
│   └── ...
└── README.md               # 이 문서
```

> 📌 **참고**: v3.27.0부터 패키지 소스는 각 GitHub 레포지토리에서 관리됩니다.
> 이 디렉토리는 버전 정보와 변경 이력만 보관합니다.

## 버저닝

SAX는 [Semantic Versioning](https://semver.org/)을 따릅니다:

- **MAJOR**: 호환성 깨지는 변경 (메시지 포맷 변경 등)
- **MINOR**: 새 기능 추가 (새 Agent/Skill)
- **PATCH**: 버그 수정, 문서 개선

## 마이그레이션 가이드

기존 rsync/copy 방식에서 Git Submodule 방식으로 전환하려면:

**[CHANGELOG/3.27.0.md](CHANGELOG/3.27.0.md)** 참조

## 참고 문서

- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [Development Philosophy](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy)
- [Collaboration Process](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process)
