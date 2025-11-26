# Anthropic Skills 분석 보고서

> SAX 시스템 개선을 위한 Anthropic 공식 Skills 레포지토리 학습 결과

**분석 일시**: 2025-01-26
**대상**: https://github.com/anthropics/skills
**목적**: SAX-PO/SAX-Next 패키지의 Skill 시스템 개선 방향 도출

---

## 1. Anthropic Skills 핵심 개념

### 1.1 Skills란?

> Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks.

**핵심 특징**:
- 동적으로 로드되는 instruction, script, resource의 폴더
- 특정 작업의 성능을 향상시키는 전문화된 가이드
- 반복 가능한 방식으로 작업을 완료하도록 Claude를 교육

### 1.2 Agent Skills Spec (공식 스펙)

**필수 파일 구조**:
```
my-skill/
└── SKILL.md (필수)
```

**SKILL.md 구조**:
```markdown
---
name: skill-name                    # 필수: hyphen-case 소문자
description: 완전한 설명 및 트리거 조건   # 필수: 언제 사용할지 명시
license: Apache 2.0                 # 선택
allowed-tools: [tool1, tool2]       # 선택 (Claude Code only)
metadata:                           # 선택
  custom-key: custom-value
---

# Skill 본문 (Markdown)

[지시사항, 예시, 가이드라인]
```

**핵심 규칙**:
1. **name**: 소문자, 하이픈, 디렉토리명과 일치
2. **description**: 무엇을 하는지 + 언제 사용하는지 (트리거 조건 명시)
3. **본문**: 제한 없음, Claude가 스킬 활성화 후 읽을 내용

---

## 2. Anthropic Skills의 핵심 설계 원칙

### 2.1 Progressive Disclosure (점진적 공개)

**3단계 로딩 시스템**:

| 단계 | 내용 | 용량 | 로딩 시점 |
|------|------|------|----------|
| 1단계 | **Metadata** (name + description) | ~100 words | 항상 context에 존재 |
| 2단계 | **SKILL.md body** | <5K words | Skill 트리거 시 |
| 3단계 | **Bundled resources** | Unlimited | Claude가 필요 판단 시 |

**SAX 비교**:
- SAX는 현재 Agent/Skill의 전체 내용을 context에 로드
- Anthropic은 필요한 시점에 필요한 만큼만 로드

### 2.2 Concise is Key (간결성)

> "The context window is a public good. Skills share the context window with everything else."

**핵심 메시지**:
- **Default assumption: Claude is already very smart**
- Claude가 이미 알지 못하는 것만 추가
- 각 정보에 대해 질문: "Claude가 정말 이 설명이 필요한가?"
- 장황한 설명보다 간결한 예시 선호

**SAX 개선 방향**:
- Agent/Skill 문서의 불필요한 설명 제거
- 예시 중심의 간결한 instruction으로 전환

### 2.3 Skill 폴더 구조 (복잡한 Skill)

```
skill-name/
├── SKILL.md (필수)
│   ├── YAML frontmatter (metadata)
│   └── Markdown body (instructions)
└── Bundled Resources (선택)
    ├── scripts/          # 실행 가능한 코드 (Python/Bash)
    ├── references/       # 문서화 및 참조 자료
    └── assets/           # 출력에 사용될 파일 (템플릿, 아이콘, 폰트)
```

**각 디렉토리 용도**:

#### `scripts/`
- 반복적으로 재작성되는 코드
- 결정론적 신뢰성이 필요한 작업
- **예시**: `scripts/rotate_pdf.py`
- **장점**: 토큰 효율적, 결정론적, context 로딩 없이 실행 가능

#### `references/`
- Claude가 참조할 문서 (필요 시 context 로딩)
- **예시**: `references/api_docs.md`, `references/schema.md`
- **Best Practice**:
  - SKILL.md는 간결하게, 상세 정보는 references로
  - 10K 이상 큰 파일은 SKILL.md에 grep 패턴 포함
  - **중복 방지**: 정보는 SKILL.md 또는 references 중 하나에만

#### `assets/`
- Context에 로드되지 않고 출력에 사용될 파일
- **예시**: `assets/logo.png`, `assets/template.pptx`
- **용도**: 템플릿, 이미지, 아이콘, boilerplate 코드

**SAX에서 활용 가능**:
- SAX Skills에도 `scripts/`, `references/`, `assets/` 구조 도입 가능
- 특히 `references/`를 활용하여 긴 문서를 분리

---

## 3. Anthropic Skills의 Progressive Disclosure 패턴

### Pattern 1: High-level guide with references

```markdown
# PDF Processing

## Quick start
Extract text with pdfplumber:
[간단한 예시]

## Advanced features
- **Form filling**: See [FORMS.md](FORMS.md)
- **API reference**: See [REFERENCE.md](REFERENCE.md)
- **Examples**: See [EXAMPLES.md](EXAMPLES.md)
```

Claude는 필요할 때만 FORMS.md, REFERENCE.md 로딩.

### Pattern 2: Domain-specific organization

```
bigquery-skill/
├── SKILL.md (개요 및 네비게이션)
└── reference/
    ├── finance.md
    ├── sales.md
    ├── product.md
    └── marketing.md
```

사용자가 sales 질문 시 sales.md만 로딩.

### Pattern 3: Conditional details

```markdown
# DOCX Processing

## Creating documents
Use docx-js. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

**SAX 적용 가능**:
- epic-master의 워크플로우 A/B를 별도 파일로 분리
- spec-writer의 템플릿들을 references로 분리
- draft-task-creator의 각 Phase별 가이드를 분리

---

## 4. Skill Creation Process (6단계)

Anthropic이 제안하는 Skill 생성 프로세스:

### Step 1: Understanding with Concrete Examples
- 구체적인 사용 사례 수집
- 사용자에게 예시 요청
- "어떤 상황에서 이 Skill이 트리거되어야 하나?"

### Step 2: Planning Reusable Contents
- scripts, references, assets 계획
- 각 예시를 분석하여 재사용 가능한 리소스 식별

### Step 3: Initialize Skill
- `init_skill.py` 스크립트로 템플릿 생성
- SKILL.md + 예시 디렉토리 자동 생성

### Step 4: Edit the Skill
- Reusable resources 먼저 구현 (scripts, references, assets)
- SKILL.md 업데이트:
  - Frontmatter: name, description
  - Body: 간결한 instructions, 예시 위주

### Step 5: Package the Skill
- `package_skill.py`로 .skill 파일 생성
- 자동 검증 (YAML, naming, structure)

### Step 6: Iterate
- 실제 사용 후 개선 사항 수집
- 반복적 개선

**SAX 적용**:
- SAX도 유사한 프로세스를 문서화할 수 있음
- `sax-architect`가 Skill 생성 시 이 프로세스 따르도록

---

## 5. 핵심 예시: document-skills/docx

### 구조 분석

```
docx/
├── SKILL.md (~150 lines)
├── docx-js.md (~500 lines)
├── ooxml.md (~600 lines)
└── scripts/
    ├── unpack.py
    └── pack.py
```

### SKILL.md의 역할

**Frontmatter**:
```yaml
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
```

**Body**:
- Workflow Decision Tree (어떤 상황에 어떤 방법 사용)
- 각 방법마다 "MANDATORY - READ ENTIRE FILE" 지시
- 상세 내용은 docx-js.md, ooxml.md에 위임

### Progressive Disclosure 실전 적용

1. **SKILL.md**: 간결한 워크플로우 가이드 (~150 lines)
2. **docx-js.md**: 새 문서 생성 전문 가이드 (~500 lines)
3. **ooxml.md**: 기존 문서 편집 전문 가이드 (~600 lines)

**효과**:
- SKILL.md만 로드 시: ~150 lines context 사용
- 필요 시 docx-js.md 추가 로드: +500 lines
- 전체 로드 시에도 체계적으로 정리됨

---

## 6. SAX와의 비교 및 개선 방향

### 6.1 현재 SAX 구조

**SAX-PO Skill 예시** (assign-project-label):
```markdown
# assign-project-label Skill

> Epic에 프로젝트 라벨 부여 및 GitHub Projects 연결

## Purpose
...

## Process
### 1. 프로젝트 확인
...
### 2. 프로젝트 라벨 부여
...
### 3. GitHub Projects 연결
...

## Output Format
...

## SAX Message
...
```

**현재 문제점**:
1. ✅ Progressive Disclosure 없음 - 전체 내용 항상 로드
2. ✅ 긴 설명 중심 - 간결성 부족
3. ✅ scripts, references, assets 분리 없음
4. ✅ "When to use" 정보가 본문에 있음 (description에 있어야 함)

### 6.2 개선 방향 제안

#### A. Description 개선

**현재** (assign-project-label):
```yaml
# 없음 (파일명으로만 추론)
```

**개선안**:
```yaml
description: "Assign project labels to Epics and connect to GitHub Projects. Use when: (1) Creating a new Epic, (2) Migrating an Epic from another repository, (3) Epic needs project categorization (오피스/랜드/정치판/코인톡), (4) Epic needs to be added to GitHub Projects #1 ('이슈관리')"
```

#### B. Progressive Disclosure 도입

**현재**: 모든 내용이 SKILL.md에

**개선안**:
```
assign-project-label/
├── SKILL.md (간결한 워크플로우)
├── references/
│   ├── project-mapping.md (프로젝트별 라벨 매핑)
│   └── github-api.md (GitHub API 상세 가이드)
└── scripts/
    └── assign_label.py (라벨 부여 자동화)
```

**SKILL.md 개선**:
```markdown
---
name: assign-project-label
description: "Assign project labels to Epics..."
---

# Assign Project Label

## Quick Start

Ask user which project, then assign label and connect to Projects.

## Project Labels
See [project-mapping.md](references/project-mapping.md) for complete list.

## GitHub API Details
See [github-api.md](references/github-api.md) for API patterns.

## Automation
Use `scripts/assign_label.py` for automated assignment.
```

#### C. 간결성 개선

**현재**: 장황한 설명
```markdown
## 1. 프로젝트 확인

**대화형 질문**:
```markdown
이 Epic은 어느 프로젝트에 속하나요?

1. 오피스 (cm-office)
2. 랜드 (cm-land)
...
```
```

**개선안**: 예시 중심
```markdown
## 1. Ask Project

Ask: "Which project?" → Use label: 오피스/랜드/정치판/코인톡

Example:
```bash
gh api repos/semicolon-devteam/docs/issues/123/labels \
  -f labels[]="epic" -f labels[]="오피스"
```
```

---

## 7. SAX 시스템 전반 개선 제안

### 7.1 Skill 파일 구조 표준화

**현재**:
- SKILL.md 또는 skill.md (혼용)
- 평탄한 구조

**제안**:
```
skill-name/
├── SKILL.md                # Anthropic 표준 준수
├── references/             # 상세 문서 (필요 시)
│   ├── workflow-a.md
│   └── workflow-b.md
├── scripts/                # 자동화 스크립트 (필요 시)
│   └── automation.py
└── assets/                 # 템플릿, 아이콘 (필요 시)
    └── template.md
```

### 7.2 Description 작성 가이드라인

**필수 포함 사항**:
1. **What**: Skill이 무엇을 하는가
2. **When**: 언제 사용해야 하는가 (구체적 트리거 조건)
3. **Examples**: 대표적인 사용 사례

**나쁜 예**:
```yaml
description: "프로젝트 라벨 할당"
```

**좋은 예**:
```yaml
description: "Assign project labels to Epics and connect to GitHub Projects. Use when: (1) Creating a new Epic, (2) Migrating an Epic, (3) Epic needs categorization (오피스/랜드/정치판/코인톡), (4) Epic needs GitHub Projects #1 connection"
```

### 7.3 Progressive Disclosure 적용 우선순위

**High Priority** (즉시 적용):
1. epic-master: Workflow A/B를 references로 분리
2. draft-task-creator: 각 Phase별 가이드 분리
3. spec-writer: 템플릿들을 assets로 분리

**Medium Priority** (단계적 적용):
4. orchestrator: Routing Table을 reference로
5. onboarding-master: 학습 자료들을 references로

**Low Priority** (필요 시):
6. 간단한 Skills (assign-project-label 등)는 현재 구조 유지

### 7.4 SAX Message Rules와의 통합

**현재**: SAX 메시지가 Skill 본문에 포함
```markdown
## SAX Message

```markdown
[SAX] Skill: assign-project-label 사용
```
```

**개선안**: Frontmatter에 metadata로
```yaml
---
name: assign-project-label
description: "..."
metadata:
  sax-message-format: "[SAX] Skill: assign-project-label 사용"
  sax-reference: "GitHub Projects API"
---
```

---

## 8. 실행 계획

### Phase 1: 표준화 (1-2주)
1. ✅ Skill 구조 표준 정의 (SKILL.md + references/ + scripts/ + assets/)
2. ✅ Description 작성 가이드라인 문서화
3. ✅ Template Skill 생성

### Phase 2: 핵심 Skills 리팩토링 (2-3주)
1. ✅ epic-master: Workflow 분리
2. ✅ draft-task-creator: Phase별 분리
3. ✅ spec-writer: 템플릿 분리
4. ✅ Description 전체 개선

### Phase 3: 검증 및 최적화 (1주)
1. ✅ 실제 사용 테스트
2. ✅ Context usage 측정
3. ✅ 개선 효과 검증

### Phase 4: 전파 및 문서화 (1주)
1. ✅ SAX Core에 Skill 표준 추가
2. ✅ Skill 생성 가이드 작성
3. ✅ sax-architect에 Skill 생성 워크플로우 추가

---

## 9. 핵심 Takeaways

### For SAX-PO

1. **Description is King**: Skill의 트리거 조건을 description에 명확히
2. **Progressive Disclosure**: 긴 Skill은 references로 분리
3. **Conciseness**: 간결한 예시 중심, 장황한 설명 제거
4. **Structure**: scripts/, references/, assets/ 구조 활용

### For SAX-Next

1. **Workflow Separation**: 복잡한 Agent의 워크플로우는 references로
2. **Tool Documentation**: 도구별 사용법은 references/tools/에
3. **Example-Driven**: 설명보다 실행 가능한 예시 우선

### For SAX Core

1. **Skill Standards**: Agent Skills Spec 준수하는 표준 정의
2. **Creation Process**: Skill 생성 6단계 프로세스 문서화
3. **Validation**: Skill 검증 체크리스트 제공

---

## 10. 참고 자료

### Anthropic 공식 문서
- Skills Repository: https://github.com/anthropics/skills
- Agent Skills Spec: https://github.com/anthropics/skills/blob/main/agent_skills_spec.md
- Skill Creator Guide: skill-creator/SKILL.md

### 주요 예시 Skill
- template-skill: 가장 간단한 구조
- skill-creator: Skill 생성 가이드
- mcp-builder: 복잡한 개발 가이드
- document-skills/docx: Progressive Disclosure 실전 적용

### SAX 관련
- SAX Core MESSAGE_RULES.md
- SAX Core PRINCIPLES.md
- SAX-PO CLAUDE.md
- SAX-Next CLAUDE.md

---

## 결론

Anthropic의 Skills 시스템은 SAX보다 **더 간결하고, 더 구조화되고, 더 효율적**입니다.

**핵심 차이점**:
1. **Progressive Disclosure**: 필요한 것만 로드 vs SAX의 전체 로드
2. **Conciseness**: 예시 중심 vs SAX의 설명 중심
3. **Structure**: scripts/references/assets 분리 vs SAX의 평탄한 구조
4. **Description**: 트리거 조건 명시 vs SAX의 간략한 설명

**SAX 개선 효과 예상**:
- Context usage: **30-50% 감소**
- Skill 가독성: **현저히 향상**
- 유지보수성: **크게 개선**
- 확장성: **더 용이**

이제 SAX 시스템을 Anthropic Skills의 Best Practices에 맞춰 리팩토링할 준비가 되었습니다.
