# version-manager Skill

> SAX 패키지 버저닝 자동화 Skill

## Purpose

SAX 패키지의 Semantic Versioning 관리를 자동화합니다.

- VERSION 파일 업데이트
- CHANGELOG/{version}.md 파일 생성
- CHANGELOG/INDEX.md 업데이트
- 버전 타입 자동 판단 (MAJOR/MINOR/PATCH)
- Keep a Changelog 형식 준수

## Triggers

- SAX 패키지 변경 후 버저닝 필요 시
- Agent/Skill 추가/삭제/수정 후
- CLAUDE.md 업데이트 후
- 구조 변경 완료 후

## Input

```json
{
  "changes": [
    {
      "type": "added|changed|removed|fixed",
      "component": "Agent|Skill|Command|Config",
      "name": "component-name",
      "description": "변경 사항 설명",
      "package": "sax-po|sax-next|sax-meta"
    }
  ],
  "version_hint": "major|minor|patch|auto"
}
```

**Parameters**:
- `changes`: 변경 사항 목록 (Keep a Changelog 섹션용)
- `version_hint`: 버전 타입 힌트 (`auto`면 자동 판단)

## Semantic Versioning Rules

### MAJOR (x.0.0)

**트리거**:
- 호환성 깨지는 변경
- 워크플로우 근본 변경
- Orchestrator 라우팅 규칙 대폭 변경
- 패키지 구조 근본 변경

**예시**:
- sync-tasks Skill 제거, draft-task-creator로 대체
- Agent 실행 방식 변경 (Orchestrator-First Policy 도입)

### MINOR (0.x.0)

**트리거**:
- 기능 추가 (하위 호환)
- Agent 추가/삭제
- Skill 추가/삭제
- Command 추가/삭제
- CLAUDE.md 섹션 추가/변경
- 워크플로우 개선

**예시**:
- draft-task-creator Agent 추가
- command-creator Agent 추가
- CHANGELOG 구조 개선

### PATCH (0.0.x)

**트리거**:
- 버그 수정
- 오타 수정
- 문서 보완
- 성능 개선 (API 변경 없음)

**예시**:
- Agent 파일 오타 수정
- CLAUDE.md 설명 보완
- 코드 주석 개선

## Version Inference Algorithm

```python
def infer_version_type(changes):
    # MAJOR 조건
    if any(c['type'] == 'removed' and c['breaking'] for c in changes):
        return 'major'
    if any('호환성' in c['description'] for c in changes):
        return 'major'
    if any('근본' in c['description'] for c in changes):
        return 'major'

    # MINOR 조건
    if any(c['type'] == 'added' for c in changes):
        return 'minor'
    if any(c['type'] == 'removed' for c in changes):
        return 'minor'
    if any(c['component'] in ['Agent', 'Skill', 'Command'] for c in changes):
        return 'minor'

    # PATCH (기본값)
    return 'patch'
```

## Workflow

### Phase 1: 현재 버전 확인

```bash
# VERSION 파일 읽기
cat sax/VERSION
# 예: 3.7.0
```

### Phase 2: 버전 타입 판단

1. **version_hint 확인**:
   - `major|minor|patch` → 직접 사용
   - `auto` → Algorithm으로 자동 판단

2. **변경사항 분석**:
   - Added → MINOR
   - Removed → MINOR (또는 MAJOR if breaking)
   - Changed → MINOR (또는 PATCH if minor)
   - Fixed → PATCH

### Phase 3: 새 버전 계산

```python
def calculate_new_version(current, version_type):
    major, minor, patch = map(int, current.split('.'))

    if version_type == 'major':
        return f"{major + 1}.0.0"
    elif version_type == 'minor':
        return f"{major}.{minor + 1}.0"
    elif version_type == 'patch':
        return f"{major}.{minor}.{patch + 1}"
```

**예시**:
- 3.7.0 + MINOR → 3.8.0
- 3.8.0 + PATCH → 3.8.1
- 3.8.1 + MAJOR → 4.0.0

### Phase 4: CHANGELOG 파일 생성

**파일 위치**: `sax/CHANGELOG/{new_version}.md`

**템플릿**:

```markdown
# SAX v{new_version} - {YYYY-MM-DD}

{changes를 Keep a Changelog 형식으로 변환}

### Added

- **{Component Name}** ({Package})
  - {설명}

### Changed

- **{Component Name}** ({Package})
  - {변경 내용}

### Removed

- **{Component Name}** ({Package})
  - {제거 이유}

### Fixed

- **{Component Name}** ({Package})
  - {수정 내용}

### Migration Guide (MAJOR/MINOR만)

**{Package} 사용자**:

1. {변경사항 설명}
2. {마이그레이션 절차}
```

**날짜**: 현재 시스템 날짜 (`date +%Y-%m-%d`)

### Phase 5: INDEX.md 업데이트

**작업**:

1. **Latest Version 업데이트**:
   ```markdown
   **Latest Version**: [3.8.0](3.8.0.md) - 2025-11-26
   ```

2. **Version History 섹션에 추가**:
   ```markdown
   ### v3.x (2025-11-26)

   - [3.8.0](3.8.0.md) - SAX-Meta 패키지 분리
   - [3.7.0](3.7.0.md) - CHANGELOG 구조 개선
   ```

3. **Breaking Changes 업데이트** (MAJOR만):
   ```markdown
   ## Breaking Changes

   - **v4.0.0**: {변경사항 설명}
   ```

### Phase 6: VERSION 파일 업데이트

```bash
# 새 버전 쓰기
echo "{new_version}" > sax/VERSION
```

## Output Format

### 성공 시

```json
{
  "status": "✅ SUCCESS",
  "old_version": "3.7.0",
  "new_version": "3.8.0",
  "version_type": "minor",
  "files_created": [
    "sax/CHANGELOG/3.8.0.md"
  ],
  "files_updated": [
    "sax/VERSION",
    "sax/CHANGELOG/INDEX.md"
  ],
  "summary": {
    "added": 4,
    "changed": 0,
    "removed": 2,
    "fixed": 0
  },
  "next_steps": [
    ".claude/ 동기화 (SAX-PO만)",
    "git commit -m '📝 [SAX] v3.8.0'"
  ]
}
```

### 실패 시

```json
{
  "status": "❌ FAIL",
  "error": "VERSION 파일을 찾을 수 없습니다",
  "current_version": null
}
```

## Validation

**버저닝 전**:
- ✅ VERSION 파일 존재
- ✅ CHANGELOG/ 디렉토리 존재
- ✅ INDEX.md 파일 존재
- ✅ changes 배열 비어있지 않음

**버저닝 후**:
- ✅ VERSION 파일 업데이트 확인
- ✅ CHANGELOG/{new_version}.md 생성 확인
- ✅ INDEX.md Latest Version 업데이트 확인
- ✅ Keep a Changelog 형식 준수 확인

## Edge Cases

### 동일 버전 재생성

**시나리오**: 3.8.0이 이미 존재하는데 3.8.0 재생성 요청

**처리**:
- ❌ 에러 반환: "버전 3.8.0이 이미 존재합니다"
- 해결 방법: PATCH 버전으로 변경 (3.8.1) 또는 기존 파일 수동 삭제

### 빈 변경사항

**시나리오**: changes 배열이 빈 상태

**처리**:
- ❌ 에러 반환: "변경사항이 없습니다"
- 버저닝 중단

### VERSION 파일 없음

**시나리오**: sax/VERSION 파일이 존재하지 않음

**처리**:
- ❌ 에러 반환: "VERSION 파일을 찾을 수 없습니다"
- 해결 방법: VERSION 파일 생성 후 재시도

## Migration Guide Generation

MAJOR 또는 MINOR 버전 변경 시, Migration Guide 자동 생성:

```markdown
### Migration Guide

**{영향받는 패키지} 사용자**:

{변경 유형에 따른 가이드}

**Added**:
- 새 기능 사용법 안내

**Changed**:
- 변경된 API 사용법
- 기존 코드 수정 방법

**Removed**:
- 대체 방법 안내
- 마이그레이션 절차
```

## SAX Message

```markdown
[SAX] Skill: version-manager 사용

[SAX] Versioning: {old_version} → {new_version} ({version_type})
```

## Related

- [sax-architect Agent](../../agents/sax-architect.md)
- [package-validator Skill](../package-validator/SKILL.md)
- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
