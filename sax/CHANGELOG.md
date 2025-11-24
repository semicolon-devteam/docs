# SAX Changelog

All notable changes to SAX (Semicolon AI Transformation) packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-11-24

### Fixed

- **SAX-PO 에이전트 실제 삭제**: v1.3.0에서 기록만 되고 실제 삭제되지 않았던 개발자용 에이전트 4개 제거
  - `database-specialist.md`
  - `ddd-architect.md`
  - `semicolon-reviewer.md`
  - `supabase-architect.md`

### SAX-PO 최종 에이전트 구성

- `orchestrator`: 요청 라우팅
- `epic-master`: Epic 생성 전문가
- `spec-writer`: Spec 초안 작성

## [2.0.0] - 2025-11-24

### Added

- **SAX Core TEAM_RULES.md**: Semicolon 팀 공통 규칙을 SAX Core로 통합
  - 기본 설정 (응답 언어, Organization, 이슈 템플릿)
  - docs/wiki 필수 참조 문서
  - Quality Gates (lint, tsc, test)
  - Supabase Backend Integration 규칙
  - Git Workflow 규칙

### Changed

- **글로벌 컨텍스트 간소화**: `~/.claude/CLAUDE.md`의 Semicolon Team 섹션을 gh api 참조로 대체
- **SAX Core 참조 확장**: 모든 패키지에 TEAM_RULES.md gh api 참조 추가
- **References 링크 추가**: SAX-Next, SAX-PO, .claude/CLAUDE.md에 TEAM_RULES.md 링크 추가

### Breaking Changes

- 글로벌 컨텍스트의 Semicolon Team 설정이 SAX Core로 이동
- 기존 글로벌 설정에 의존하던 워크플로우는 gh api 참조로 변경 필요

### 참조 방법

```bash
gh api repos/semicolon-devteam/docs/contents/sax/core/TEAM_RULES.md \
  --jq '.content' | base64 -d
```

## [1.9.0] - 2025-11-24

### Changed

- **SAX-Next 에이전트 정리**: sax-architect 제거 (SAX 메타작업은 docs 레포 전용)
- **SAX-Next Routing Table 정규화**: v1.3.0에서 이식된 4개 에이전트 등록

### Added (SAX-Next Routing Table)

- `semicolon-reviewer`: 코드 리뷰 ("리뷰", "코드 검토", "PR 리뷰")
- `ddd-architect`: DDD 아키텍처 ("DDD", "아키텍처", "도메인 설계")
- `database-specialist`: DB 전문가 ("DB", "데이터베이스", "스키마")
- `supabase-architect`: Supabase 통합 ("Supabase", "RPC", "supabase 연동")

### Removed (SAX-Next)

- `sax-architect` agent: SAX 메타작업은 docs 레포(SAX-PO)에서만 수행

## [1.8.0] - 2025-11-24

### Added

- **업데이트 시 CHANGELOG 확인 규칙**: SAX 업데이트 진행 시 CHANGELOG.md 확인 및 즉시 반영 필수 규칙 추가
- **gh api CHANGELOG 참조 명령**: 모든 패키지에 CHANGELOG 확인용 gh api 명령 추가

### 참조 방법

```bash
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG.md \
  --jq '.content' | base64 -d
```

## [1.7.0] - 2025-11-24

### Added

- **SAX Core gh api 참조 규칙**: SAX-Next, SAX-PO, .claude/ 모든 패키지에 gh api를 통한 SAX Core 참조 방법 추가
- **핵심 메시지 규칙 Quick Reference**: 각 패키지 CLAUDE.md에 메시지 포맷 빠른 참조 추가

### Changed

- **Source of Truth 강화**: SAX Core 문서를 `sax/core/`에서 gh api로 직접 참조하도록 변경
- **References 링크 정규화**: 모든 SAX Core 참조를 `docs/blob/main/sax/core/` 경로로 통일

### 참조 방법

```bash
gh api repos/semicolon-devteam/docs/contents/sax/core/MESSAGE_RULES.md \
  --jq '.content' | base64 -d
```

## [1.6.0] - 2025-11-24

### Added

- **업데이트 후 커밋 규칙**: 서비스 레포에서 SAX 동기화 완료 후 커밋 필수 규칙 추가
- **Installation & Update 섹션**: SAX-Next, SAX-PO에 설치 및 업데이트 가이드 추가

### 커밋 메시지 형식 (서비스 레포용)

```text
📝 [SAX] Sync to vX.X.X
```

## [1.5.0] - 2025-11-24

### Added

- **docs 레포 한정 동기화 규칙**: SAX-PO 개선 시 `.claude/`와 `sax/packages/sax-po/` 동시 업데이트 규칙 추가

### Changed

- **SAX-PO 패키지 소스 동기화**: `sax/packages/sax-po/CLAUDE.md`를 최신 상태로 업데이트
- **SAX-PO References 링크**: command-center → docs 레포로 수정
- **SAX Core 참조 경로**: docs/sax/core 경로로 통일

## [1.4.0] - 2025-11-24

### Changed

- **SAX-Next CLAUDE.md 정규화**: 버전 참조, SAX Core 참조를 docs 레포 기준으로 통일
- **SAX 정의 추가**: SAX-Next에 "Semicolon AI Transformation" 정의 추가

### Fixed

- SAX-Next References 링크: command-center → docs 레포로 수정
- SAX Core Principles 참조 경로 수정

## [1.3.0] - 2025-11-24

### Changed

- **SAX-PO 에이전트 정리**: 개발자용 에이전트 4개를 SAX-Next로 이식
- **SAX 메타작업 기본 경로**: `sax/` 폴더를 SAX 메타작업의 기본 경로로 지정

### Moved (SAX-PO → SAX-Next)

- `semicolon-reviewer` agent: 코드 리뷰
- `ddd-architect` agent: DDD 아키텍처
- `database-specialist` agent: DB 전문가
- `supabase-architect` agent: Supabase 통합

### SAX-PO 최종 에이전트 구성

- `orchestrator`: 요청 라우팅
- `epic-master`: Epic 생성 전문가
- `spec-writer`: Spec 초안 작성

## [1.2.0] - 2025-11-24

### Changed

- **Single Source of Truth 확립**: 버전/변경기록을 `sax/VERSION`, `sax/CHANGELOG.md`로 일원화
- **CLAUDE.md 간소화**: 버전 정보를 직접 기재하지 않고 참조 링크로 변경
- **버저닝 체크리스트 단순화**: 갱신 대상 파일을 2개로 축소

### Removed

- CLAUDE.md 내 중복 버전 정보 및 Changelog 테이블 제거

## [1.1.0] - 2025-11-24

### Changed

- **SAX 정의 변경**: Semicolon Agent eXperience → **Semicolon AI Transformation**
- **Source of Truth 변경**: command-center → **docs** 레포지토리
- **References 링크**: 모든 SAX Core 참조를 docs 레포로 변경

### Added

- **Versioning Rules**: 버저닝 필수 상황 및 Semantic Versioning 규칙 정의
- **sax/VERSION 갱신 규칙**: 버전 변경 시 반드시 sax/VERSION 파일 동기화

## [1.0.0] - 2024-11-24

### Added (Initial Release)

#### SAX-Core

- `PRINCIPLES.md`: 기본 원칙 (투명성, 일관성, 모듈성, 계층구조)
- `PACKAGING.md`: 패키지 분리 및 확장 규칙
- `MESSAGE_RULES.md`: SAX 메시지 포맷 및 출력 규칙

#### SAX-PO (PO/기획자용)

- `epic-master` agent: Epic 생성 전문가
- `spec-writer` agent: Spec 초안 작성
- `create-epic` skill: docs 레포에 Epic 이슈 생성
- `sync-tasks` skill: tasks.md → GitHub Issues 동기화
- `epic-template`: 간소화된 Epic 템플릿 (What만, How 제외)

#### SAX-Next (Next.js 개발자용)

- `orchestrator` agent: 요청 라우팅
- `spec-master` agent: SDD Phase 1-3
- `implementation-master` agent: ADD Phase 4
- `quality-master` agent: Phase 5 검증
- `spike-master` agent: 기술 탐색
- `migration-master` agent: 마이그레이션
- `teacher` agent: 학습 안내
- `advisor` agent: 조언 제공
- `sax-architect` agent: SAX 시스템 관리
- 다수의 skills (spec, implement, verify, etc.)

### Notes

- SAX 패키지 계층 구조 확립:
  - SAX-Core (command-center) → 기본 원칙
  - SAX-PO (docs) → PO/기획자용
  - SAX-Next (cm-\*) → Next.js 개발자용
  - SAX-Spring (core-\*) → Spring 개발자용 (예정)
