# SAX Changelog

All notable changes to SAX (Semicolon AI Transformation) packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.0] - 2025-11-25

### Added

- **Reference 메시지 출력 규칙** (SAX Core 컨텍스트 조회 시)
  - SAX Core 문서 참조 전 `[SAX] Reference:` 메시지 출력 필수
  - MESSAGE_RULES.md 2.4절 준수
  - 투명성(Transparency) 원칙 강화

### Changed

- **CLAUDE.md 간소화 및 위임 구조 개선**
  - Routing Table → orchestrator.md로 완전 위임
  - Workflow Overview 제거 (orchestrator.md 참조)
  - SAX Message Rules 상세 예시 제거 (MESSAGE_RULES.md 참조)
  - 역할 명확화: CLAUDE.md = 패키지 메타 + 핵심 정책, orchestrator.md = 라우팅 로직

### Removed

- **SAX-PO CLAUDE.md 중복 섹션 제거**
  - Agent Routing > Routing Table (L177-185)
  - Workflow Overview (L187-195)
  - SAX Message Rules 상세 예시 (L207-227)
- **SAX-Next CLAUDE.md 중복 섹션 제거**
  - Agent Routing > Routing Table (L148-161)
  - SAX Message Rules 상세 예시

## [2.6.0] - 2025-11-25

### Added

- **SAX 메타 작업 필수 절차 정의** (PRINCIPLES.md 3.0.1)
  - "Semicolon AX" 키워드 트리거 시 7단계 필수 절차 명시
  - Orchestrator + sax-architect Agent 메시지 필수 출력
  - 버저닝(VERSION + CHANGELOG + commit) 필수 포함
  - 작업 완료 판단 기준 명확화
  - 버저닝 기준: CLAUDE.md 변경 → MINOR, Agent/Skill 추가/삭제/수정 → MINOR, 버그 수정 → PATCH

### Changed

- **SAX 작업 응답 정책**
  - 감정 표현 배제 (변명, 사과, 공감 제거)
  - 원인 분석 및 결과 보고 중심
  - 해결 방안 제시 중심

## [2.5.0] - 2025-11-25

### Changed

- **Orchestrator-First Policy 명확화**
  - "예외 사항" 의미 재정의: "Agent 위임 생략"이지 "Orchestrator 메시지 출력 생략" 아님
  - Orchestrator 메시지는 **항상 출력** 명시
  - 올바른 사용 예시 추가
  - 적용: SAX-PO, SAX-Next CLAUDE.md
- **SAX Core 컨텍스트 우선 조회 규칙 추가**
  - SAX 관련 작업 시작 전 SAX Core 문서 **먼저 조회** 필수화
  - 조회가 필요한 5가지 상황 명시
  - 구체적인 조회 절차 제공 (gh api 명령어)
  - 적용: SAX-PO, SAX-Next CLAUDE.md
- **CLAUDE.md 핵심 규칙 요약 및 레퍼런스 매핑**
  - Quick Reference 섹션 개선 (기본 포맷 + 필수 요소만)
  - 상세 내용은 GitHub 링크로 레퍼런스 매핑
  - 📖 아이콘으로 외부 참조 명확화
  - 적용: SAX-PO, SAX-Next CLAUDE.md

### Fixed

- **투명성(Transparency) 원칙 강화**
  - Orchestrator 메시지 누락 문제 해결
  - 시스템 동작이 사용자에게 명시적으로 노출되도록 개선
- **일관성(Consistency) 원칙 강화**
  - 예외 상황에서도 일관된 메시지 패턴 유지
  - 예측 가능한 동작 패턴 확립

### Documentation

- **wiki와 sax 문서 간 중복 분석 완료**
  - SAX Core: AI 에이전트 동작 규칙
  - Wiki: 개발 철학, 협업 프로세스 (인간 중심)
  - 역할 분리 및 상호 참조 구조 명확화

## [2.4.0] - 2025-11-24

### Added

- **Teacher 에이전트 분리**: SAX-PO와 SAX-Next 각각에 맞춤형 Teacher 에이전트 배치
  - **SAX-PO Teacher**: 협업 프로세스, 업무 관리, 기획 방법론, PO 관점 팀 규칙
  - **SAX-Next Teacher**: 아키텍처 패턴, 프레임워크/기술, 개발 방법론, 팀 개발 규칙
  - Cross-reference 패턴: 각 Teacher가 범위 외 질문 시 상대 Teacher 안내
- **Routing Table에 Teacher 추가**: "알려줘", "배우고 싶어", "어떻게 해야", "설명해줘" 키워드로 라우팅

### Changed

- **워크플로우 질문 키워드 조정**: "어떻게 해" 제거 (학습 요청과 구분), "다음 뭐해", "뭐부터 해"로 한정

### Removed

- **SAX-PO 잘못 배치된 스킬 삭제**: 개발자용 스킬 3개 제거
  - `database-compliance`, `fetch-supabase-example`, `scaffold-domain`
- **SAX-PO 잘못 배치된 에이전트 정리**: `.claude/` 디렉토리에 남아있던 개발자용 에이전트 4개 삭제
  - `database-specialist.md`, `ddd-architect.md`, `semicolon-reviewer.md`, `supabase-architect.md`

### SAX-PO 최종 구성

**Agents**: orchestrator, epic-master, spec-writer, teacher
**Skills**: create-epic, sync-tasks, check-team-codex

### SAX-Next Teacher 역할 구분

| SAX-PO Teacher | SAX-Next Teacher |
|----------------|------------------|
| 협업 프로세스 | 아키텍처 패턴 |
| 업무 관리 | 프레임워크/기술 |
| 기획 방법론 | 개발 방법론 |
| 팀 규칙 (PO 관점) | 팀 개발 규칙 |

## [2.3.0] - 2025-11-24

### Added

- **Epic 이식 라우팅**: Routing Table에 Epic 이식/마이그레이션 키워드 추가
  - "이식", "마이그레이션", "옮기기", "복사해줘" 키워드로 epic-master 라우팅
  - SAX-PO CLAUDE.md, orchestrator.md에 반영
  - Epic 이식 예시 추가

### Changed

- **Routing Table 확장**: 기존 Epic 생성 외에 Epic 이식 Intent 분리 정의

### 참조 방법

```bash
# Routing Table 확인
gh api repos/semicolon-devteam/docs/contents/sax/packages/sax-po/CLAUDE.md \
  --jq '.content' | base64 -d | grep -A 10 "Routing Table"
```

## [2.2.0] - 2025-11-24

### Added

- **Orchestrator-First Policy**: SAX 패키지 설치 환경에서 모든 요청이 Orchestrator를 먼저 거치도록 규칙 추가
  - SAX Core PRINCIPLES.md에 "3.0 Orchestrator-First Policy" 섹션 추가
  - SAX-PO, SAX-Next CLAUDE.md에 규칙 반영
  - 예외 사항 정의 (단순 질문, 일반 대화, 명시적 직접 요청)

### Changed

- **버저닝 필수 상황 개선**: "추가 또는 수정" → "추가, 수정, 또는 삭제"로 명시적 확장
  - SAX Core PRINCIPLES.md의 "7.2 버저닝 필수 상황" 섹션 신설
  - 변경 유형별 버전 업데이트 기준표 추가
  - 버저닝 체크포인트 및 절차 명시

### 참조 방법

```bash
# Orchestrator-First Policy 확인
gh api repos/semicolon-devteam/docs/contents/sax/core/PRINCIPLES.md \
  --jq '.content' | base64 -d | grep -A 30 "3.0 Orchestrator-First"

# 버저닝 필수 상황 확인
gh api repos/semicolon-devteam/docs/contents/sax/core/PRINCIPLES.md \
  --jq '.content' | base64 -d | grep -A 20 "7.2 버저닝 필수"
```

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
