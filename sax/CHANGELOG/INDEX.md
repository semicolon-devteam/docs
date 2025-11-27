# SAX Changelog Index

All notable changes to SAX (Semicolon AI Transformation) packages are documented in version-specific files.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Quick Reference

**Latest Version**: [3.20.0](3.20.0.md) - 2025-11-27

## How to Read Changelog

### From Local Repository

각 버전의 변경사항은 개별 파일에 저장되어 있습니다:

```bash
# 최신 버전 확인
cat sax/CHANGELOG/3.17.0.md

# 특정 버전 확인
cat sax/CHANGELOG/2.8.0.md
```

### From GitHub API

원격에서 CHANGELOG를 참조할 때는 다음 명령을 사용하세요:

```bash
# 최신 버전 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/3.17.0.md \
  --jq '.content' | base64 -d

# 특정 버전 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/2.8.0.md \
  --jq '.content' | base64 -d

# INDEX 확인
gh api repos/semicolon-devteam/docs/contents/sax/CHANGELOG/INDEX.md \
  --jq '.content' | base64 -d
```

## Version History

### v3.x (2025-11-27)

- [3.20.0](3.20.0.md) - Agents Progressive Disclosure 대규모 적용 (10개 Agent)
- [3.19.0](3.19.0.md) - SAX-Next Agent 통폐합 (database-specialist + supabase-architect → database-master)
- [3.18.0](3.18.0.md) - Progressive Disclosure 및 토큰 효율성 가이드라인 추가
- [3.17.0](3.17.0.md) - 필수 메시지 체인 규칙 CRITICAL 섹션 추가 (전 패키지 적용)
- [3.16.0](3.16.0.md) - 시스템 메시지 규칙 개별화 (Orchestrator 위임 → Agent/Skill 개별 규칙)
- [3.15.0](3.15.0.md) - Skills 표준화 완료 및 SAX-Meta Progressive Disclosure 적용 (10개 Skills)
- [3.14.0](3.14.0.md) - Skills Progressive Disclosure 대규모 개편 (16개 Skills)
- [3.13.0](3.13.0.md) - Manager Agents에 Phase 4: Audit 추가 (분석/검토/감사)
- [3.12.0](3.12.0.md) - Creator Agent를 Manager Agent로 통합 (생성/수정/삭제)
- [3.11.0](3.11.0.md) - Orchestrator-First Policy 적용 및 CLAUDE.md 구조 개선
- [3.10.0](3.10.0.md) - SAX-Meta Orchestrator 및 Skill Creator Agent 추가
- [3.9.0](3.9.0.md) - docs 레포 패키지 구조 개선 (루트 CLAUDE.md 패키지 선택)
- [3.8.0](3.8.0.md) - SAX-Meta 패키지 분리 (Agent/Skill 생성 도구 통합)
- [3.7.0](3.7.0.md) - CHANGELOG 구조 개선 (단일 파일 → 버전별 파일)
- [3.6.0](3.6.0.md) - command-creator Agent, create-command Skill 추가
- [3.5.1](3.5.1.md) - 커맨드 파일명 수정 (이중 콜론 버그 수정)
- [3.5.0](3.5.0.md) - 커맨드 구조 개선 (commands/SAX/)
- [3.4.0](3.4.0.md) - Progressive Disclosure 패턴 적용
- [3.3.1](3.3.1.md) - health-check Skill Frontmatter, SAX-Next 동기화
- [3.3.0](3.3.0.md) - skill-creator Skill, template-skill 추가
- [3.2.0](3.2.0.md) - assign-project-label, detect-project-from-epic Skill 추가
- [3.1.0](3.1.0.md) - sax-architect Agent 추가
- [3.0.0](3.0.0.md) - draft-task-creator Agent, 7개 Skills 추가 (MAJOR)

### v2.x (2025-11-24 ~ 2025-11-25)

- [2.9.0](2.9.0.md) - /SAX:help Command 추가
- [2.8.0](2.8.0.md) - 신규 팀원 온보딩 시스템
- [2.7.0](2.7.0.md) - Reference 메시지 출력 규칙, CLAUDE.md 간소화
- [2.6.0](2.6.0.md) - SAX 메타 작업 필수 절차 정의
- [2.5.0](2.5.0.md) - Orchestrator-First Policy 명확화
- [2.4.0](2.4.0.md) - Teacher 에이전트 분리 (SAX-PO/SAX-Next)
- [2.3.0](2.3.0.md) - Epic 이식 라우팅
- [2.2.0](2.2.0.md) - Orchestrator-First Policy 추가
- [2.1.0](2.1.0.md) - SAX-PO 에이전트 실제 삭제
- [2.0.0](2.0.0.md) - SAX Core TEAM_RULES.md 통합 (MAJOR)

### v1.x (2024-11-24 ~ 2025-11-24)

- [1.9.0](1.9.0.md) - SAX-Next 에이전트 정리
- [1.8.0](1.8.0.md) - 업데이트 시 CHANGELOG 확인 규칙
- [1.7.0](1.7.0.md) - SAX Core gh api 참조 규칙
- [1.6.0](1.6.0.md) - 업데이트 후 커밋 규칙
- [1.5.0](1.5.0.md) - docs 레포 한정 동기화 규칙
- [1.4.0](1.4.0.md) - SAX-Next CLAUDE.md 정규화
- [1.3.0](1.3.0.md) - SAX-PO 에이전트 정리
- [1.2.0](1.2.0.md) - Single Source of Truth 확립
- [1.1.0](1.1.0.md) - SAX 정의 변경, Source of Truth 변경
- [1.0.0](1.0.0.md) - Initial Release (MAJOR)

## Breaking Changes

MAJOR 버전 업데이트 (하위 호환성 깨짐):

- **v3.0.0**: sync-tasks Skill 제거, draft-task-creator로 대체
- **v2.0.0**: 글로벌 컨텍스트의 Semicolon Team 설정이 SAX Core로 이동
- **v1.0.0**: 초기 릴리스

## Migration Guides

각 버전 파일에는 마이그레이션 가이드가 포함되어 있습니다:

- **v3.0.0**: Epic → Draft Task 워크플로우 변경
- **v2.0.0**: TEAM_RULES.md gh api 참조 방법
- **v1.x**: 버저닝 규칙, 동기화 규칙 등

## Semantic Versioning

SAX는 [Semantic Versioning 2.0.0](https://semver.org/)을 따릅니다:

- **MAJOR** (x.0.0): 하위 호환성 깨지는 변경
- **MINOR** (0.x.0): 기능 추가 (하위 호환)
- **PATCH** (0.0.x): 버그 수정 (하위 호환)

## Changelog 작성 규칙

새 버전 릴리스 시:

1. `sax/CHANGELOG/{version}.md` 파일 생성
2. Keep a Changelog 형식 준수 (Added, Changed, Deprecated, Removed, Fixed, Security)
3. Migration Guide 포함 (Breaking Changes 시)
4. `sax/CHANGELOG/INDEX.md`의 "Latest Version" 업데이트
5. Version History에 새 버전 추가

## References

- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
- [SAX Core - Message Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [SAX Core - Team Rules](https://github.com/semicolon-devteam/docs/blob/main/sax/core/TEAM_RULES.md)
