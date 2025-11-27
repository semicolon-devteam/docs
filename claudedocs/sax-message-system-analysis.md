# SAX 시스템 메시지 미출력 문제 분석 보고서

> Orchestrator → Agent → Skill 메시지 체인이 기대대로 동작하지 않는 원인 분석

**분석 일시**: 2025-01-27
**문제 유형**: SAX Message Rules 준수 실패
**심각도**: High (사용자 경험 및 투명성 원칙 위반)

---

## 1. 문제 정의

### 1.1 기대 동작

```markdown
[SAX] System: SAX-Meta 패키지 활성화

[SAX] Orchestrator: 의도 분석 완료 → {intent_category}

[SAX] Agent 위임: {agent_name} (사유: {reason})

--- Agent 전환 ---

[SAX] Agent: {agent_name} 호출 (트리거: {trigger})

[SAX] Skill: {skill_name} 사용

## 실제 작업 수행...
```

### 1.2 현재 동작

```markdown
[SAX] System: SAX-Meta 패키지 활성화

## 실제 작업 수행...
(Orchestrator 메시지 없음)
(Agent 호출 메시지 없음)
(Skill 사용 메시지 없음)
```

---

## 2. 원인 분석

### 2.1 근본 원인: Claude Code의 Context Loading 방식

**핵심 문제**: Claude Code는 `.claude/` 디렉토리의 파일들을 **정적 컨텍스트**로 로드합니다.

```
CLAUDE.md → 읽혀서 Context에 포함
agents/*.md → 읽혀서 Context에 포함
skills/*/SKILL.md → 읽혀서 Context에 포함
```

**그러나**:
- 이 파일들은 **지시사항으로 해석**될 뿐
- Claude가 **실제로 "Agent 전환"을 수행하는 것이 아님**
- "Orchestrator → Agent" 라우팅은 **개념적 가이드**일 뿐 **런타임 메커니즘이 아님**

### 2.2 Claude Code의 실제 동작 방식

```
사용자 메시지 입력
    ↓
Claude Code가 모든 .claude/ 파일을 Context에 로드
    ↓
Claude는 전체 Context를 참조하여 응답 생성
    ↓
(Agent/Skill 파일들은 "참조 자료"로만 기능)
```

**SAX가 가정하는 방식** vs **실제 동작**:

| SAX 가정 | 실제 동작 |
|----------|-----------|
| Orchestrator가 먼저 실행됨 | 모든 파일이 동시에 Context에 로드됨 |
| Agent 위임 시 "전환"이 발생 | 전환 없음, 동일 Context에서 계속 |
| Skill 사용 시 별도 "호출" | 호출 없음, 동일 Context에서 참조만 |

### 2.3 메시지 출력 메커니즘 부재

**현재 SAX 구조의 한계**:

1. **CLAUDE.md** (루트):
   - 패키지 선택 후 `[SAX] System: ... 패키지 활성화` 출력 지시
   - **문제**: 이것만 명시적으로 강조됨

2. **orchestrator.md**:
   - 라우팅 메시지 포맷 정의됨
   - **문제**: "이 메시지를 반드시 출력하라"는 강제 규칙 없음
   - 예시로만 제공되어 Claude가 선택적으로 따름

3. **각 Agent 파일**:
   - 호출 시 메시지 포맷이 없거나 약함
   - **문제**: Agent가 "자신이 호출됐음"을 알리는 필수 규칙 없음

4. **각 Skill 파일**:
   - `[SAX] Skill: {name} 사용` 포맷 정의
   - **문제**: 역시 "반드시 출력"이라는 강제성 부족

---

## 3. 문서 구조 분석

### 3.1 루트 CLAUDE.md

**현재 상태**:
```markdown
3. **시스템 메시지 출력** (필수):
   [SAX] System: {선택된 패키지} 패키지 활성화

   > ⚠️ **중요**: 이 메시지는 **반드시 출력**해야 합니다.

4. **컨텍스트 전환**:
   - Orchestrator가 모든 요청을 라우팅
```

**문제점**:
- 시스템 메시지만 "반드시 출력" 강조
- Orchestrator 라우팅 메시지에 대한 강제 규칙 없음
- "컨텍스트 전환" 후 **Orchestrator 메시지 출력 지시 없음**

### 3.2 SAX-Meta CLAUDE.md

**현재 상태**:
```markdown
## Orchestrator-First Policy

> ⚠️ **중요**: 모든 SAX-Meta 요청은 **Orchestrator를 먼저 통과**합니다.
```

**문제점**:
- "통과한다"는 개념적 설명만 있음
- **통과 시 메시지 출력** 규칙 누락
- Orchestrator의 메시지 포맷만 참조, 강제성 없음

### 3.3 orchestrator.md

**현재 상태**:
```markdown
### SAX 메시지 포맷

#### 라우팅 성공 시

[SAX] Orchestrator: 의도 분석 완료 → {intent_category}

[SAX] Agent 위임: {target_agent} (사유: {reason})
```

**문제점**:
- 포맷은 정의되어 있음
- **그러나 "이 메시지를 항상 출력하라"는 강제 규칙 없음**
- 예시 섹션에만 있어 Claude가 "참고용"으로 해석

### 3.4 MESSAGE_RULES.md

**현재 상태**:
```markdown
### 7.1 메시지 생략

SAX 메시지는 **생략 불가**
```

**문제점**:
- 규칙은 존재하지만 **각 문서에서 이를 참조/강제하지 않음**
- MESSAGE_RULES.md가 Core 문서로 분리되어 있어 Context에 기본 로드되지 않음
- 각 Agent/Skill이 MESSAGE_RULES를 참조하도록 강제되지 않음

---

## 4. 해결 방안

### 4.1 즉시 적용: 필수 출력 규칙 강화

#### A. 루트 CLAUDE.md 수정

**현재**:
```markdown
4. **컨텍스트 전환**:
   - Orchestrator가 모든 요청을 라우팅
```

**개선안**:
```markdown
4. **컨텍스트 전환** (필수 메시지):
   - 선택된 패키지의 CLAUDE.md 적용

   **⚠️ 필수 출력 순서**:

   ```markdown
   [SAX] System: {패키지} 패키지 활성화

   [SAX] Orchestrator: 의도 분석 완료 → {intent}

   [SAX] Agent 위임: {agent} (사유: {reason})
   ```

   > 이 메시지 체인은 **생략 불가**입니다. 반드시 순서대로 출력하세요.
```

#### B. SAX-Meta CLAUDE.md 수정

**현재**:
```markdown
## Orchestrator-First Policy

> ⚠️ **중요**: 모든 SAX-Meta 요청은 **Orchestrator를 먼저 통과**합니다.
```

**개선안**:
```markdown
## Orchestrator-First Policy (필수 메시지 출력)

> ⚠️ **중요**: 모든 SAX-Meta 요청은 **Orchestrator를 먼저 통과**합니다.

### 필수 메시지 체인

**모든 요청에서 반드시 다음 순서로 메시지를 출력하세요**:

1. **Orchestrator 분석 메시지** (필수):
   ```markdown
   [SAX] Orchestrator: 의도 분석 완료 → {category}

   [SAX] Agent 위임: {agent} (사유: {reason})
   ```

2. **Agent 호출 메시지** (필수):
   ```markdown
   [SAX] Agent: {agent} 전환
   ```

3. **Skill 사용 시** (해당 시 필수):
   ```markdown
   [SAX] Skill: {skill} 사용
   ```

> ❌ **절대 생략 금지**: 이 메시지들 없이 작업을 시작하면 안 됩니다.
```

#### C. orchestrator.md 수정

**추가할 섹션**:
```markdown
## ⚠️ 필수 출력 규칙 (Critical)

**모든 라우팅에서 아래 메시지를 반드시 출력하세요. 생략 불가.**

### 라우팅 시작 시 (항상)
```markdown
[SAX] Orchestrator: 의도 분석 완료 → {category}

[SAX] Agent 위임: {agent} (사유: {reason})
```

### Agent 위임 직후 (항상)
위임받은 Agent는 첫 줄에 다음을 출력:
```markdown
[SAX] Agent: {agent_name} 전환
```

> ❌ 이 메시지 없이 작업을 시작하면 SAX 원칙 위반입니다.
```

### 4.2 구조적 개선: Agent/Skill 첫 줄 규칙

#### 각 Agent 파일 상단에 추가

**agent-manager.md 예시**:
```markdown
---
name: agent-manager
description: ...
---

# Agent Manager

> **⚠️ 호출 시 첫 출력**: `[SAX] Agent: agent-manager 전환`

## 역할
...
```

#### 각 Skill 파일 상단에 추가

**version-manager/SKILL.md 예시**:
```markdown
---
name: version-manager
description: ...
---

# Version Manager Skill

> **⚠️ 사용 시 첫 출력**: `[SAX] Skill: version-manager 사용`

## Process
...
```

### 4.3 장기 개선: 메시지 강제 메커니즘

#### Option A: Hooks 활용

Claude Code의 `user-prompt-submit` hook을 사용하여 SAX 메시지 포함 여부 검증:

```json
// settings.json
{
  "hooks": {
    "user-prompt-submit": {
      "command": "echo 'SAX message chain required'"
    }
  }
}
```

#### Option B: CLAUDE.md 최상단 강조

```markdown
# SAX Package Selector

## 🔴 CRITICAL: 필수 메시지 체인

**모든 응답은 다음 메시지로 시작해야 합니다**:

1. `[SAX] System: {패키지} 패키지 활성화`
2. `[SAX] Orchestrator: 의도 분석 완료 → {intent}`
3. `[SAX] Agent 위임: {agent} (사유: {reason})`
4. `[SAX] Agent: {agent} 전환`

> 이 체인 없이 응답하면 SAX 규칙 위반입니다.
```

---

## 5. 근본 원인 요약

### 5.1 Claude Code의 한계

| 기대 | 현실 |
|------|------|
| Agent가 실제로 "호출"됨 | Agent 파일은 Context의 일부일 뿐 |
| Orchestrator가 "라우팅 결정"을 함 | Claude가 전체 Context를 보고 판단 |
| Skill이 "사용"됨 | Skill 파일 내용이 참조될 뿐 |

### 5.2 SAX 문서의 한계

| 문제 | 원인 |
|------|------|
| 메시지가 출력되지 않음 | "필수" 강조가 부족함 |
| 메시지 체인이 끊김 | 각 단계별 출력 규칙이 분산됨 |
| 일관성 없음 | 강제 메커니즘 부재 |

### 5.3 해결의 핵심

> **SAX 메시지는 "가이드라인"이 아니라 "필수 규칙"으로 강제되어야 함**

---

## 6. 권장 조치

### 즉시 (Today)

1. ✅ 루트 CLAUDE.md에 필수 메시지 체인 명시
2. ✅ SAX-Meta CLAUDE.md에 "필수 출력" 섹션 추가
3. ✅ orchestrator.md에 "생략 불가" 규칙 강화

### 단기 (This Week)

4. ⏳ 모든 Agent 파일 상단에 호출 메시지 규칙 추가
5. ⏳ 모든 Skill 파일 상단에 사용 메시지 규칙 추가
6. ⏳ MESSAGE_RULES.md 내용을 각 패키지 CLAUDE.md에 인라인

### 중기 (This Month)

7. ⏳ Claude Code Hooks로 메시지 검증 자동화
8. ⏳ 메시지 출력 테스트 케이스 작성
9. ⏳ SAX 버전 업데이트로 변경사항 반영

---

## 7. 결론

**문제의 본질**: SAX 시스템은 Claude Code의 동작 방식과 불일치하는 "런타임 라우팅" 개념을 가정하고 있습니다.

**현실**: Claude Code는 모든 `.claude/` 파일을 정적으로 로드하고, Claude는 이를 참조하여 응답을 생성합니다. "Orchestrator → Agent → Skill" 체인은 개념적 가이드일 뿐, 실제 런타임 메커니즘이 아닙니다.

**해결책**: 메시지 출력을 "선택 사항"이 아닌 "필수 규칙"으로 문서에 명시적으로 강조해야 합니다. 각 단계에서 "이 메시지 없이 진행하면 안 됨"이라는 강제성을 부여해야 합니다.

---

## 8. 참조

- [SAX Core MESSAGE_RULES.md](sax/core/MESSAGE_RULES.md)
- [SAX Core PRINCIPLES.md](sax/core/PRINCIPLES.md)
- [루트 CLAUDE.md](.claude/CLAUDE.md)
- [SAX-Meta CLAUDE.md](.claude/sax-meta/CLAUDE.md)
- [orchestrator.md](sax/packages/sax-meta/agents/orchestrator.md)
