---
name: check-backend-duplication
description: Check for duplicate backend implementation in core-backend. Use when (1) Epic analysis detects backend work (API, server, database keywords), (2) draft-task-creator creates backend tasks, (3) need to verify if similar functionality already exists in core-backend domain services.
---

# check-backend-duplication Skill

> core-backend 중복 구현 체크

## Purpose

Epic에서 백엔드 작업이 감지되었을 때, core-backend에 이미 유사 기능이 구현되어 있는지 확인합니다.

## Triggers

- Epic 내용에 백엔드 작업 키워드 감지
- "API", "서버", "데이터베이스", "RPC", "엔드포인트" 등
- draft-task-creator Agent가 백엔드 작업 판단 시 자동 호출

## Check Scope

**도메인 + Service 레벨 중복 체크**:

1. **도메인 레벨**: Epic 분석 → 관련 도메인 파악 (user, chat, point, posts, ranking 등)
2. **Service 레벨**: 해당 도메인의 Service 클래스에서 유사 기능 검색

## Process

### 1. Epic 분석

```bash
# Epic 내용에서 백엔드 작업 키워드 추출
# 예: "채팅방 삭제 기능" → domain: chat, action: delete, entity: room
```

### 2. core-backend 도메인 확인

```bash
# core-backend의 domain/ 디렉토리 확인
gh api repos/semicolon-devteam/core-backend/contents/src/main/kotlin/com/semicolon/corebackend/domain \
  --jq '.[] | select(.type == "dir") | .name'
```

### 3. Service 클래스 검색

해당 도메인이 존재하면:

```bash
# 예: chat 도메인의 Service 파일 목록
gh api repos/semicolon-devteam/core-backend/contents/src/main/kotlin/com/semicolon/corebackend/domain/chat/service \
  --jq '.[] | select(.name | endswith(".kt")) | .name'

# Service 파일 내용 확인
gh api repos/semicolon-devteam/core-backend/contents/src/main/kotlin/com/semicolon/corebackend/domain/chat/service/ChatRoomService.kt \
  --jq '.content' | base64 -d
```

### 4. 중복 여부 판단

**중복 조건**:
- 같은 도메인 존재 ✅
- Service에 유사 함수명 존재 ✅ (예: `deleteRoom()`, `removeRoom()`)

**중복 아님 조건**:
- 도메인 없음
- 도메인 있지만 Service에 해당 기능 없음

## Output Format

### 중복 발견 시

```json
{
  "is_duplicated": true,
  "domain": "chat",
  "service_class": "ChatRoomService",
  "existing_function": "deleteRoom(roomId: Long)",
  "file_path": "src/main/kotlin/com/semicolon/corebackend/domain/chat/service/ChatRoomService.kt",
  "recommendation": "core-backend Task 생성 스킵. Epic에 중복 정보 코멘트 추가"
}
```

### 중복 없음

```json
{
  "is_duplicated": false,
  "domain": "chat",
  "reason": "Service에 해당 기능 미구현",
  "recommendation": "core-backend에 Draft Task 생성 진행"
}
```

### 도메인 없음

```json
{
  "is_duplicated": false,
  "domain": null,
  "reason": "core-backend에 해당 도메인 미존재",
  "recommendation": "core-backend에 Draft Task 생성 진행 (신규 도메인)"
}
```

## Epic 코멘트 예시 (중복 발견 시)

```markdown
### ⚠️ core-backend 중복 확인

**도메인**: chat
**기존 구현**: `ChatRoomService.deleteRoom(roomId: Long)`
**파일**: `src/main/kotlin/com/semicolon/corebackend/domain/chat/service/ChatRoomService.kt`

**권장 사항**:
- core-backend Task는 생성하지 않습니다.
- 프론트엔드에서 기존 API 활용
- 필요 시 API 수정/개선은 별도 Issue로 관리
```

## SAX Message

```markdown
[SAX] Skill: check-backend-duplication 사용

[SAX] Reference: core-backend/domain/{domain}/service 참조
```

## Notes

- **검색 대상**: Service 클래스의 public 함수만 확인
- **유사 함수 판단**: 함수명 유사도 분석 (Levenshtein distance < 3)
- **컨텍스트 고려**: Epic의 User Stories와 Service 함수 기능 매칭

## Related

- [draft-task-creator Agent](../../agents/draft-task-creator.md)
- [Epic Template](../../templates/epic-template.md)
