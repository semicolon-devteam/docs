# Claude Code Sub-Agent 최적화 분석 보고서

> SAX 시스템의 Task Agent 패턴 개선을 위한 Claude Code Sub-Agent 아키텍처 학습 결과

**분석 일시**: 2025-01-27
**대상**: Claude Code Sub-Agent 공식 문서 및 커뮤니티 Best Practices
**목적**: SAX 패키지의 Agent 시스템 효율화 방향 도출

---

## 1. Sub-Agent 핵심 개념

### 1.1 Sub-Agent란?

> "Sub-Agent는 Claude Code가 특정 작업을 위임할 수 있는 사전 구성된 AI 성격(pre-configured AI personality)"

**핵심 특징**:
- **독립적 컨텍스트**: 주 대화와 분리된 별도의 컨텍스트 윈도우 사용
- **맞춤형 구성**: 커스텀 시스템 프롬프트, 특정 도구, 역할별 지침 포함
- **전문화된 기능**: 특정 목적과 전문 분야에 특화된 구조
- **컨텍스트 오염 방지**: 주 대화의 품질을 유지하면서 복잡한 작업 수행

### 1.2 SAX Task Agent와의 비교

| 구분 | Claude Sub-Agent | SAX Task Agent |
|------|------------------|----------------|
| 컨텍스트 | 독립적 윈도우 | 메인 컨텍스트 공유 |
| 호출 방식 | 자동 위임 + 명시적 호출 | Orchestrator 라우팅 |
| 도구 권한 | 세밀한 도구 제한 가능 | 모든 도구 접근 |
| 재개 기능 | resume 파라미터 지원 | 미지원 |
| 모델 선택 | 에이전트별 모델 지정 | 단일 모델 |

---

## 2. Sub-Agent 설계 원칙

### 2.1 파일 기반 구성 (File-based Configuration)

**저장 위치**:
```
프로젝트 수준: .claude/agents/
사용자 수준: ~/.claude/agents/
(프로젝트 > 사용자 우선순위)
```

**YAML Frontmatter 구조**:
```markdown
---
name: code-reviewer           # 필수: 소문자-하이픈
description: Expert code...   # 필수: 호출 시점 명시
tools: Read, Grep, Glob       # 선택: 도구 제한 (생략시 전체 상속)
model: haiku                  # 선택: sonnet/opus/haiku/inherit
---

# System Prompt 본문
```

### 2.2 호출 시점 결정 (Trigger Conditions)

**자동 위임 트리거**:
```yaml
auto_delegation:
  primary: description 필드와 요청 매칭
  boosters:
    - "PROACTIVELY" 키워드 포함
    - "MUST BE USED" 강조 문구
    - "Use when..." 명시적 조건
```

**SAX 개선 방향**:
- Agent의 description에 "PROACTIVELY" 패턴 도입
- 트리거 조건을 description에 명시 (Skills 분석 보고서와 동일)

### 2.3 도구 권한 전략 (Tool Permissions)

**역할별 도구 제한 패턴**:

| 역할 유형 | 허용 도구 | 목적 |
|-----------|-----------|------|
| **Read-only** | Read, Grep, Glob | 분석/리뷰 (수정 불가) |
| **Research** | Read, Grep, Glob, WebFetch, WebSearch | 정보 수집 |
| **Code Writer** | Read, Write, Edit, Bash, Glob, Grep | 코드 작성/실행 |
| **Orchestrator** | 모든 도구 | 전체 조율 |

**SAX 적용 가능**:
- `spec-writer`: Read, Write, Edit (코드 실행 불필요)
- `epic-validator`: Read, Grep, Glob (검증만 수행)
- `draft-task-creator`: Read, Write, Edit, Bash (GitHub API 필요)

---

## 3. 컨텍스트 최적화 전략

### 3.1 컨텍스트 분리의 이점

> "Each subagent operates in its own conversation context, preventing the 'context pollution' that degrades performance in long conversations."

**효과**:
- 메인 컨텍스트 보존으로 더 긴 세션 가능
- 복잡한 탐색 작업을 분리하여 핵심 대화 유지
- 서브에이전트의 상세 결과는 요약되어 메인에 반환

**SAX 현재 문제**:
- 모든 Agent가 동일 컨텍스트 공유
- 긴 Epic 작업 시 컨텍스트 부족 발생
- Orchestrator가 모든 정보를 메모리에 유지

### 3.2 토큰 효율성 (Token Efficiency)

**초기화 토큰 최적화**:
> "One of the most important aspects when designing custom agents is to carefully engineer how many tokens your custom agent needs to initialize."

**최적화 목적**:
1. 초기화 속도 향상
2. 비용 절감
3. 최고 성능 유지
4. 효율적인 체이닝 가능

**SAX 개선 방향**:
- Agent 시스템 프롬프트 간결화 (Skills 분석과 동일)
- 필수 정보만 포함, 상세 가이드는 references로 분리
- Progressive Disclosure 패턴 적용

### 3.3 모델 선택 최적화 (Model Selection)

**동적 모델 선택 패턴**:
```yaml
model_strategy:
  default: haiku          # 빠르고 저렴한 기본값
  escalation: sonnet      # 검증 실패 시 상위 모델
  critical: opus          # 핵심 의사결정만
```

**Haiku 4.5 효율성** (2025년 10월 출시):
- Sonnet 4.5 대비 90% 성능
- 2배 빠른 속도
- 3배 비용 절감 ($1/$5 vs $3/$15)

**SAX 적용 가능**:
- 탐색/분석 Agent: `model: haiku`
- 코드 작성 Agent: `model: sonnet` 또는 `inherit`
- 아키텍처 결정: `model: opus`

---

## 4. 병렬 처리 패턴

### 4.1 Multi-Agent Orchestration

> "Anthropic's Research system uses a multi-agent architecture with an orchestrator-worker pattern, where a lead agent coordinates the process while delegating to specialized subagents that operate in parallel."

**병렬화 유형**:
1. **수평 병렬화**: 3-5개 서브에이전트 동시 실행
2. **도구 병렬화**: 각 서브에이전트 내 3+ 도구 동시 사용
3. **배치 처리**: 작업 배치 완료 후 다음 배치 시작

**병렬 실행 한계**:
- 최대 10개 병렬 실행 (초과 시 큐잉)
- 쓰기 충돌 방지를 위한 보수적 접근

### 4.2 Git Worktree 패턴

**독립 환경 병렬 실행**:
```bash
# 3개의 독립 worktree에서 병렬 작업
git worktree add ../feature-auth
git worktree add ../feature-ui
git worktree add ../feature-api
```

**장점**:
- 완전히 독립된 파일 시스템
- 쓰기 충돌 없음
- 각각 다른 구현 방식 시도 가능

### 4.3 파이프라인 체이닝

**순차 워크플로우 패턴**:
```
analyst → architect → implementer → tester → security-audit
```

**병렬 + 순차 조합**:
```
                    ┌─ UI Agent ──────┐
analyst → architect ─┼─ API Agent ────┼→ integration-tester
                    └─ DB Agent ──────┘
```

**SAX 적용 가능**:
- Epic 생성 워크플로우에 병렬 처리 도입
- spec-writer와 validator 분리
- 독립적인 Task들은 병렬 생성

---

## 5. 내장 Explore Sub-Agent

### 5.1 Explore Agent 특징

> "The Explore subagent is a fast, lightweight agent optimized for searching and analyzing codebases. It operates in strict read-only mode."

**핵심 특성**:
- **Read-only 모드**: 코드베이스 검색/분석 전용
- **경량화**: 빠른 파일 발견과 코드 탐색에 최적화
- **컨텍스트 효율**: 탐색 결과가 메인 대화를 bloat하지 않음

**자동 위임 조건**:
- 코드베이스 검색/이해가 필요하지만 수정은 불필요한 경우
- 메인 에이전트가 직접 여러 검색 명령을 실행하는 것보다 효율적

### 5.2 SAX에서의 활용

**현재 SAX 패턴**:
```markdown
Orchestrator가 직접 탐색 → 컨텍스트 소비 → 작업 수행
```

**개선된 패턴**:
```markdown
Orchestrator → Explore Agent (탐색/분석) → 요약 반환 → 작업 수행
```

---

## 6. 재개(Resume) 메커니즘

### 6.1 컨텍스트 복구

**재개 파라미터**:
```typescript
{
  "subagent_type": "code-analyzer",
  "resume": "abc123"  // 이전 실행 ID로 컨텍스트 복구
}
```

**사용 사례**:
- **장기 분석**: 여러 세션에 걸친 코드 분석
- **반복적 개선**: 피드백 후 이전 상태에서 계속
- **다단계 작업**: 복잡한 워크플로우의 단계별 진행

### 6.2 SAX에서의 활용 가능성

**Epic 작업 시나리오**:
```yaml
session_1:
  - Epic 초기 분석 (agent_id: "epic-123")
  - 사용자 피드백 수집

session_2:
  - resume: "epic-123"으로 이전 컨텍스트 복구
  - 피드백 반영하여 계속 작업
```

---

## 7. 예시 Sub-Agent 패턴

### 7.1 Code Reviewer (Best Practice 예시)

```markdown
---
name: code-reviewer
description: Expert code review. PROACTIVELY review after changes.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code readability
- Proper error handling
- No exposed secrets
- Input validation
- Test coverage

Provide feedback by priority:
- Critical issues
- Warnings
- Suggestions
```

**패턴 분석**:
- `PROACTIVELY` 키워드로 자동 호출 유도
- 구체적인 실행 순서 명시
- 체크리스트로 일관된 품질 보장
- 우선순위별 출력 형식 정의

### 7.2 Debugger (문제 해결 전문)

```markdown
---
name: debugger
description: Debugging specialist. Use PROACTIVELY for errors.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate failure location
4. Implement minimal fix
5. Verify solution

For each issue provide:
- Root cause explanation
- Evidence supporting diagnosis
- Specific code fix
- Testing approach
```

### 7.3 Data Scientist (도메인 전문)

```markdown
---
name: data-scientist
description: SQL/BigQuery expert. Use PROACTIVELY for data tasks.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL analysis.

Key practices:
- Write optimized SQL with proper filters
- Use appropriate aggregations
- Include comments explaining logic
- Format results for readability
- Provide data-driven recommendations

Ensure queries are efficient and cost-effective.
```

---

## 8. SAX 시스템 개선 제안

### 8.1 Agent 파일 구조 표준화

**현재 SAX 구조**:
```
agents/
└── agent-name/
    └── AGENT.md (전체 내용 포함)
```

**개선안 (Claude Code 패턴)**:
```
agents/
└── agent-name/
    ├── AGENT.md (간결한 시스템 프롬프트)
    │   ├── YAML frontmatter (name, description, tools, model)
    │   └── 핵심 지시사항만
    └── references/
        ├── workflow.md (상세 워크플로우)
        └── examples.md (예시 모음)
```

### 8.2 Description 작성 가이드라인

**필수 포함 사항**:
1. **What**: Agent가 무엇을 하는가
2. **When**: 언제 호출되어야 하는가 (트리거 조건)
3. **PROACTIVELY**: 자동 호출이 필요한 경우 명시

**나쁜 예**:
```yaml
description: "Epic 관리를 담당합니다"
```

**좋은 예**:
```yaml
description: "Epic lifecycle management. Use PROACTIVELY when: (1) New Epic creation requested, (2) Epic status update needed, (3) Epic validation required. Handles full Epic workflow from draft to release."
```

### 8.3 도구 권한 세분화

**현재**: 모든 Agent가 모든 도구 접근
**개선안**:

| Agent | 허용 도구 | 이유 |
|-------|-----------|------|
| epic-master | Read, Write, Edit, Bash | GitHub API 필요 |
| spec-writer | Read, Write, Edit | 문서 작성만 |
| validator | Read, Grep, Glob | 검증만 (수정 불가) |
| orchestrator | All | 전체 조율 필요 |

### 8.4 모델 선택 전략 도입

**SAX Agent별 모델 제안**:

```yaml
orchestrator:
  model: inherit  # 사용자 선택 모델 유지

explore-agent:
  model: haiku    # 빠른 탐색에 최적

spec-writer:
  model: sonnet   # 품질 중요한 문서 작성

architect:
  model: opus     # 핵심 아키텍처 결정
```

### 8.5 컨텍스트 분리 전략

**Phase 1**: Explore 패턴 도입
- 탐색/분석 작업을 별도 Agent로 분리
- 요약된 결과만 메인 컨텍스트로 반환

**Phase 2**: 병렬 처리 도입
- 독립적인 Task들 병렬 생성
- Orchestrator가 결과 통합

**Phase 3**: Resume 기능 도입
- 장기 Epic 작업의 세션 간 연속성
- 피드백 반영 후 재개 가능

---

## 9. 비용/성능 최적화

### 9.1 토큰 사용량 관리

**핵심 인사이트**:
> "Token usage by itself explains 80% of the variance in performance."

**최적화 전략**:
1. Agent 시스템 프롬프트 최소화
2. 필요한 컨텍스트만 로드 (Progressive Disclosure)
3. 탐색 결과는 요약하여 반환
4. 불필요한 체이닝 제거

### 9.2 비용-성능 트레이드오프

**전략 매트릭스**:

| 시나리오 | 모델 선택 | 트레이드오프 |
|----------|-----------|--------------|
| 빠른 탐색 | Haiku | 속도 ↑, 비용 ↓, 품질 중간 |
| 코드 작성 | Sonnet | 속도 중간, 비용 중간, 품질 ↑ |
| 아키텍처 결정 | Opus | 속도 ↓, 비용 ↑, 품질 최고 |
| 동적 선택 | Haiku → Sonnet | 실패 시 상위 모델로 에스컬레이션 |

---

## 10. 실행 계획

### Phase 1: 즉시 적용 가능

1. ✅ Agent description 개선 (PROACTIVELY 패턴 도입)
2. ✅ 도구 권한 세분화 (read-only vs write-enabled)
3. ✅ 시스템 프롬프트 간결화

### Phase 2: 단기 개선

4. ⏳ Progressive Disclosure 구조 도입
5. ⏳ Explore 패턴 Agent 추가
6. ⏳ 모델 선택 전략 구현

### Phase 3: 중기 개선

7. ⏳ 병렬 처리 지원
8. ⏳ Resume 기능 도입
9. ⏳ 토큰 사용량 모니터링

---

## 11. 핵심 Takeaways

### For SAX Agents

1. **Description is King**: `PROACTIVELY` 키워드와 명확한 트리거 조건 명시
2. **Tool Permissions**: 역할별 최소 권한 원칙 적용
3. **Model Selection**: 작업 특성에 맞는 모델 선택 (Haiku/Sonnet/Opus)
4. **Context Efficiency**: 탐색은 분리, 결과는 요약하여 반환

### For SAX Orchestrator

1. **Delegation Strategy**: Explore 패턴으로 탐색 분리
2. **Parallel Execution**: 독립 작업은 병렬 처리
3. **State Management**: Resume으로 장기 작업 지원
4. **Progressive Loading**: 필요 시에만 상세 정보 로드

### For SAX Architecture

1. **File Structure**: YAML frontmatter + 간결한 본문 + references 분리
2. **Token Budget**: Agent 초기화 토큰 최소화
3. **Cost Optimization**: 동적 모델 선택으로 비용 절감
4. **Quality Gates**: 도구 권한으로 안전성 확보

---

## 12. 참고 자료

### 공식 문서
- [Claude Code Sub-Agents 공식 문서](https://code.claude.com/docs/ko/sub-agents)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Building Agents with Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)

### 커뮤니티 자료
- [PyTorch Korea - Claude Code Sub-Agent 분석](https://discuss.pytorch.kr/t/claude-code-sub-agent-ai/7353)
- [Claude Code Subagent Deep Dive](https://cuong.io/blog/2025/06/24-claude-code-subagent-deep-dive)
- [Multi-Agent Parallel Coding with Claude](https://medium.com/@codecentrevibe/claude-code-multi-agent-parallel-coding-83271c4675fa)
- [Parallelizing AI Coding Agents](https://ainativedev.io/news/how-to-parallelize-ai-coding-agents)

### 관련 도구
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) - 100+ 프로덕션 서브에이전트 컬렉션
- [ClaudeLog - Agent Engineering Guide](https://claudelog.com/mechanics/agent-engineering/)

---

## 결론

Claude Code Sub-Agent 시스템은 SAX보다 **더 세분화되고, 더 효율적이며, 더 확장 가능한** 구조를 제공합니다.

**핵심 차이점**:
1. **컨텍스트 분리**: 독립 윈도우로 오염 방지 vs SAX의 공유 컨텍스트
2. **도구 권한**: 세밀한 권한 제어 vs SAX의 전체 접근
3. **모델 선택**: 작업별 최적 모델 vs SAX의 단일 모델
4. **재개 기능**: 세션 간 연속성 vs SAX의 세션 종속

**SAX 개선 효과 예상**:
- 컨텍스트 효율: **40-60% 개선**
- 비용 절감: **모델 선택으로 30-50%**
- 작업 속도: **병렬 처리로 2-3배 향상**
- 안정성: **도구 권한으로 오류 감소**

이제 SAX 시스템을 Claude Code Sub-Agent의 Best Practices에 맞춰 점진적으로 개선할 준비가 되었습니다.
