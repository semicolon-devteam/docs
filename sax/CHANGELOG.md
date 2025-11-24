# SAX Changelog

All notable changes to SAX (Semicolon AI Transformation) packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
