# package-validator Skill

> SAX 패키지 구조 및 규칙 준수 검증 Skill

## Purpose

SAX 패키지의 구조적 완전성과 규칙 준수를 자동으로 검증합니다.

- Agent/Skill 파일의 Frontmatter 규칙 검증
- CLAUDE.md 구조 및 내용 일관성 검증
- orchestrator.md 라우팅 테이블 완전성 검증
- 파일 네이밍 규칙 검증 (kebab-case, 이중 콜론 방지)
- Progressive Disclosure 패턴 준수 검증

## Triggers

- SAX 패키지 변경 후 검증 필요 시
- Agent/Skill 추가/수정/삭제 후
- CLAUDE.md 업데이트 후
- 버저닝 전 품질 확인 시

## Input

```json
{
  "package": "sax-po|sax-next|sax-meta",
  "scope": "full|agents|skills|commands|config"
}
```

**Parameters**:
- `package`: 검증 대상 패키지
- `scope`: 검증 범위 (full=전체, agents=Agent만, skills=Skill만, commands=Command만, config=CLAUDE.md만)

## Validation Rules

### 1. Frontmatter 검증

**Agent Frontmatter**:
```yaml
---
name: {agent-name}                    # 파일명과 일치 (확장자 제외)
description: {역할 요약}. {When to use}.  # 1-2줄, 마침표로 종료
tools:                                 # 최소 1개 이상
  - read_file
  - write_file
---
```

**Skill Frontmatter** (선택적):
```yaml
---
name: {skill-name}                    # 디렉토리명과 일치
description: {역할 요약}
triggers:                             # 선택적
  - {trigger1}
---
```

**검증 항목**:
- ✅ name 필드 존재 및 파일명 일치
- ✅ description 필드 존재 및 형식 준수
- ✅ tools 필드 존재 (Agent만)
- ✅ YAML 문법 오류 없음

### 2. 파일 네이밍 검증

**규칙**:
- ✅ kebab-case 사용 (`agent-name.md`, `skill-name/`)
- ✅ 명확한 역할 표현
- ❌ camelCase, snake_case 금지
- ❌ 이중 콜론 발생 구조 금지 (예: `SAX/:command.md` → `/SAX::command`)

**검증**:
```bash
# Agent 파일명 검증
agents/*.md → kebab-case 확인

# Skill 디렉토리명 검증
skills/*/ → kebab-case 확인

# Command 파일명 검증
commands/SAX/*.md → 콜론 프리픽스 없음 확인
```

### 3. CLAUDE.md 검증

**필수 섹션**:
```markdown
## Package Info
## SAX란?
## Package Components
### Agents
### Skills
### Commands (선택적)
## Versioning Rules
## References
```

**검증 항목**:
- ✅ 모든 필수 섹션 존재
- ✅ Agents 테이블에 실제 파일 존재하는 Agent만 나열
- ✅ Skills 테이블에 실제 디렉토리 존재하는 Skill만 나열
- ✅ Commands 테이블에 실제 파일 존재하는 Command만 나열
- ✅ 파일 경로 정확성 (상대 경로)
- ✅ Version 참조 경로 정확성

### 4. orchestrator.md 검증 (해당 시)

**Routing Decision Table**:
```markdown
| User Intent | Route To | Detection Keywords |
|-------------|----------|-------------------|
| {intent} | `{agent-name}` | "{keyword1}", "{keyword2}" |
```

**검증 항목**:
- ✅ 테이블에 나열된 Agent가 실제 존재
- ✅ Agent 파일명과 Route To 값 일치
- ✅ Detection Keywords 형식 정확 (쌍따옴표)

### 5. Progressive Disclosure 검증 (Skill만)

**구조**:
```
skills/{skill-name}/
    ├── SKILL.md        # 필수: 핵심 워크플로우
    └── references/     # 선택적: 상세 레퍼런스
        ├── api.md
        └── examples.md
```

**검증 항목**:
- ✅ SKILL.md 파일 존재
- ✅ references/ 디렉토리 존재 시 최소 1개 파일 포함
- ✅ SKILL.md에서 references/ 파일 참조 시 경로 정확성

## Validation Process

### Phase 1: 파일 구조 스캔

```bash
# 1. Agent 파일 수집
agents/*.md

# 2. Skill 디렉토리 수집
skills/*/

# 3. Command 파일 수집 (해당 시)
commands/SAX/*.md

# 4. 설정 파일 확인
CLAUDE.md, agents/orchestrator.md
```

### Phase 2: Frontmatter 검증

각 Agent/Skill 파일에 대해:

1. YAML Frontmatter 파싱
2. 필수 필드 존재 검증
3. 필드 값 형식 검증
4. name 필드와 파일명 일치 검증

### Phase 3: CLAUDE.md 일관성 검증

1. **Agents 섹션**:
   - 테이블 내 각 Agent 파일 존재 확인
   - 누락된 Agent 없는지 확인
   - 파일 경로 정확성 확인

2. **Skills 섹션**:
   - 테이블 내 각 Skill 디렉토리 존재 확인
   - 누락된 Skill 없는지 확인
   - 파일 경로 정확성 확인

3. **Commands 섹션**:
   - 테이블 내 각 Command 파일 존재 확인
   - 누락된 Command 없는지 확인

### Phase 4: orchestrator 라우팅 검증

1. Routing Decision Table 파싱
2. 각 Route To Agent 실제 존재 확인
3. Agent 파일명과 라우팅 이름 일치 확인

### Phase 5: 네이밍 규칙 검증

```bash
# kebab-case 검증 (소문자, 하이픈만 허용)
pattern: ^[a-z0-9]+(-[a-z0-9]+)*$

# 이중 콜론 방지 검증
commands/SAX/ 내 파일명에 ':' 프리픽스 없음 확인
```

## Output Format

### 성공 시

```json
{
  "status": "✅ PASS",
  "package": "sax-po",
  "scope": "full",
  "summary": {
    "agents": 5,
    "skills": 8,
    "commands": 3,
    "errors": 0,
    "warnings": 0
  },
  "message": "모든 검증 통과"
}
```

### 실패 시

```json
{
  "status": "❌ FAIL",
  "package": "sax-po",
  "scope": "full",
  "summary": {
    "agents": 5,
    "skills": 8,
    "commands": 3,
    "errors": 3,
    "warnings": 1
  },
  "errors": [
    {
      "type": "frontmatter",
      "file": "agents/epic-master.md",
      "message": "description 필드 누락"
    },
    {
      "type": "naming",
      "file": "skills/createEpic/SKILL.md",
      "message": "kebab-case 위반: createEpic → create-epic"
    },
    {
      "type": "consistency",
      "file": "CLAUDE.md",
      "message": "Agents 테이블에 누락: draft-task-creator"
    }
  ],
  "warnings": [
    {
      "type": "progressive-disclosure",
      "file": "skills/sync-tasks/",
      "message": "references/ 디렉토리 없음 (선택적)"
    }
  ]
}
```

## Error Handling

### 치명적 에러 (즉시 중단)

- CLAUDE.md 파일 없음
- agents/ 디렉토리 없음
- YAML 문법 오류

### 경고 (계속 진행)

- Progressive Disclosure references/ 누락 (선택적이므로)
- orchestrator.md 없음 (패키지에 따라 선택적)

## SAX Message

```markdown
[SAX] Skill: package-validator 사용

[SAX] Validation: {package} 패키지 검증 완료
```

## Related

- [sax-architect Agent](../../agents/sax-architect.md)
- [agent-creator Agent](../../agents/agent-creator.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)
