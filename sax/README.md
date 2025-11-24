# SAX (Semicolon Agent eXperience)

> Semicolon 팀의 AI Agent 협업 표준 패키지

## 개요

SAX는 Claude Code와 같은 AI 에이전트가 Semicolon 팀의 프로젝트에서 일관되게 동작하도록 하는 표준 패키지 시스템입니다.

## 패키지 계층

```
SAX-Core                    ← 기본 원칙, 메시지 규칙 (모든 패키지의 기반)
    ├─ SAX-PO               ← PO/기획자용
    ├─ SAX-Next             ← Next.js 개발자용
    └─ SAX-Spring           ← Spring 개발자용 (예정)
```

## 디렉토리 구조

```
sax/
├── VERSION                 # 현재 버전
├── CHANGELOG.md            # 변경 이력
├── README.md               # 이 문서
│
├── core/                   # SAX-Core 원본
│   ├── PRINCIPLES.md       # 기본 원칙
│   ├── PACKAGING.md        # 패키지 규칙
│   └── MESSAGE_RULES.md    # 메시지 규칙
│
├── packages/               # 역할별 패키지
│   ├── sax-po/            # PO용
│   ├── sax-next/          # Next.js용
│   └── sax-spring/        # Spring용 (예정)
│
└── scripts/               # 유틸리티 스크립트
    └── deploy.sh          # 패키지 배포
```

## 설치 방법

### 새 프로젝트에 SAX 패키지 설치

```bash
# docs 레포에서 실행
./sax/scripts/deploy.sh <package-name> <target-repo-path>

# 예시: SAX-Next를 cm-newproject에 설치
./sax/scripts/deploy.sh sax-next /path/to/cm-newproject
```

### 기존 프로젝트 업데이트

```bash
# 대상 레포에서 실행
./sax/scripts/deploy.sh sax-next . --update
```

## 버저닝

SAX는 [Semantic Versioning](https://semver.org/)을 따릅니다:

- **MAJOR**: 호환성 깨지는 변경 (메시지 포맷 변경 등)
- **MINOR**: 새 기능 추가 (새 Agent/Skill)
- **PATCH**: 버그 수정, 문서 개선

## 패키지별 대상 레포지토리

| 패키지 | 대상 레포지토리 | 설명 |
|--------|----------------|------|
| SAX-Core | command-center | 모든 패키지가 상속하는 기본 원칙 |
| SAX-PO | docs | PO/기획자가 사용하는 Epic/Spec 도구 |
| SAX-Next | cm-\* | Next.js 기반 프로젝트용 |
| SAX-Spring | core-\* | Spring 기반 프로젝트용 (예정) |

## 기여 방법

1. 이 레포지토리(docs)의 `sax/` 디렉토리에서 변경
2. VERSION 업데이트
3. CHANGELOG.md에 변경 사항 기록
4. PR 생성 및 리뷰
5. 머지 후 `deploy.sh`로 대상 레포에 배포

## 참고 문서

- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [Development Philosophy](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy)
- [Collaboration Process](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process)
