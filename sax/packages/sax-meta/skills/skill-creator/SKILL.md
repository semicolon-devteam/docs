---
name: skill-creator
description: Create new SAX skills following Anthropic best practices. Use when (1) need to create a new skill that extends SAX capabilities, (2) implementing specialized workflows or domain knowledge, (3) packaging reusable logic as a skill. Follows Progressive Disclosure pattern with SKILL.md + references/.
---

# Skill Creator

Create well-structured SAX skills following Anthropic Agent Skills specification.

## Quick Start

```
Define skill purpose → Generate SKILL.md with frontmatter → Create references/ if needed → Validate
```

## Skill Creation Process

### 1. Define Skill Purpose

Ask clarifying questions:

```markdown
**Skill 생성을 위한 정보 수집**:

1. **What** (무엇을 하는 스킬인가요?):
   - 핵심 기능은?
   - 입력은 무엇이고 출력은 무엇인가요?

2. **When** (언제 사용하나요?):
   - 트리거 조건은? (키워드, 상황, Agent 호출)
   - 자동 호출되나요, 수동 호출되나요?

3. **How Complex** (복잡도는?):
   - 간단한 작업 (< 100 lines)
   - 중간 복잡도 (100-300 lines)
   - 복잡한 작업 (> 300 lines, references/ 필요)
```

### 2. Generate SKILL.md

**Frontmatter (Required)**:

```yaml
---
name: skill-name
description: What the skill does and when to use it. Use when (1) condition 1, (2) condition 2, (3) condition 3.
---
```

**Body Structure**:

```markdown
# Skill Name

Brief 1-2 sentence description

## Quick Start

Minimal usage example (3-5 lines)

## Process (Optional)

Step-by-step workflow if needed

## Advanced Usage (For complex skills)

For detailed information, see:
- [Advanced Guide](references/advanced.md)
- [Examples](references/examples.md)

## Output Format

Expected output structure

## SAX Message

```markdown
[SAX] Skill: skill-name 사용
```

## Related

- [Related Agent](../../agents/agent-name.md)
- [Related Skill](../related-skill/SKILL.md)
```

### 3. Apply Progressive Disclosure

> ⚠️ **중요**: Progressive Disclosure는 초기 컨텍스트 로드를 최소화하여 Claude의 토큰 효율성을 높이는 핵심 패턴입니다.

#### Line Count Thresholds

| Total Lines | Action | SKILL.md Target | Reduction |
|-------------|--------|-----------------|-----------|
| < 100 | 단일 파일 유지 | ~100 lines | N/A |
| 100-200 | references/ 고려 (선택) | ~60-80 lines | ~30-40% |
| 200-300 | references/ 권장 | ~50-70 lines | ~60-75% |
| **> 300** | **references/ 필수** | **~50-80 lines** | **~80-85%** |

#### Complexity-Based Strategy

**Simple Skill** (<100 lines total):

- SKILL.md only
- All content in main file
- Quick Start + 간단한 설명

**Medium Skill** (100-200 lines):

- SKILL.md with core instructions (~60-80 lines)
- Optional: 1-2 reference files for detailed workflows
- 예: assign-project-label (181 lines → references/ 선택)

**Complex Skill** (200-300 lines):

- SKILL.md with Quick Start + overview (~50-70 lines)
- references/ directory with 2-3 files
- 예: health-check (291 lines → 65 lines, 77.7% reduction)

**Very Complex Skill** (>300 lines):

- SKILL.md with minimal overview (~50-80 lines)
- references/ directory with 3-5 files:
  - `rules.md` or `validation.md` - Core rules and validation logic
  - `workflow.md` or `execution.md` - Detailed process and flow
  - `examples.md` or `integration.md` - Usage examples and integrations
  - `output.md` or `formats.md` - Output formats and templates
- 예: check-team-codex (462 lines → 62 lines, 86.6% reduction)

#### What to Separate into references/

**✅ Move to references/**:

- Detailed validation rules (>50 lines)
- Multiple workflow scenarios (>30 lines each)
- Extensive code examples (>20 lines)
- Output format templates (>40 lines)
- Integration examples (Husky, VS Code, CI/CD)
- Long bash scripts or command sequences
- Comprehensive checklists (>15 items)

**❌ Keep in SKILL.md**:

- Frontmatter (always)
- Purpose and role (1-2 sentences)
- When to use / triggers (bullet list)
- Quick Start (minimal 3-5 line example)
- Advanced Usage section (links to references/)
- SAX Message format
- Related links

#### Real Examples from SAX-PO

**check-team-codex** (462 → 62 lines, **86.6% reduction**):

```text
SKILL.md (62 lines):

- Frontmatter
- Purpose + When to Use
- Quick Start (3 bash commands)
- Advanced Usage (4 reference links)
- SAX Message + Related

references/:

- codex-rules.md (Git/Code/DDD rules)
- validation-checks.md (6 validation categories)
- execution-flow.md (Quick/Full/CI-CD workflows)
- integration.md (Husky/VS Code examples)
```

**health-check** (291 → 65 lines, **77.7% reduction**):

```text
SKILL.md (65 lines):

- Frontmatter
- 역할 + 트리거
- Quick Start (4 bash one-liners)
- Advanced Usage (3 reference links)
- SAX Message + Related

references/:

- validation-items.md (4 validation categories)
- output-formats.md (Success/Failure examples)
- workflow.md (Flow diagram + re-validation policy)
```

**epic-master** (already done, 65% reduction):

```text
SKILL.md (~50 lines):

- Frontmatter + overview
- Quick Start
- 2 reference links

references/:

- workflow-creation.md
- workflow-migration.md
```

### 4. Follow Anthropic Principles

**Concise is Key**:
- Claude is already smart - only add what Claude doesn't know
- Avoid repeating general knowledge
- Focus on specific SAX context and workflows

**What to Include**:
- ✅ Specific trigger conditions
- ✅ SAX-specific workflows
- ✅ GitHub API commands
- ✅ Team conventions (Semicolon rules)
- ✅ Output formats specific to SAX

**What to Exclude**:
- ❌ General programming concepts
- ❌ How to use GitHub (Claude knows this)
- ❌ Obvious explanations
- ❌ Verbose documentation

**Description Format**:
```yaml
# Good
description: Assign project labels to Epics and connect to GitHub Projects #1. Use when (1) creating new Epic, (2) migrating Epic, (3) Epic needs categorization.

# Bad
description: This skill assigns labels
```

### 5. Validate Skill

**Checklist**:

- [ ] Frontmatter has `name` and `description`
- [ ] Description includes "what" + "when to use"
- [ ] SKILL.md < 300 lines (or split to references/)
- [ ] Quick Start section exists
- [ ] SAX Message format included
- [ ] Related links added
- [ ] No verbose/redundant content

### 6. Create Directory Structure

```bash
# Simple skill
sax/packages/sax-po/skills/{skill-name}/
  SKILL.md

# Complex skill with references
sax/packages/sax-po/skills/{skill-name}/
  SKILL.md
  references/
    workflow.md
    examples.md
    api.md
```

## Output Format

After creating skill:

```markdown
## ✅ Skill 생성 완료

**Skill**: {skill-name}
**Location**: `sax/packages/sax-po/skills/{skill-name}/SKILL.md`
**Size**: {line_count} lines
**References**: {Yes/No} - {reference_files}

### Skill Structure

- **What**: {skill_purpose}
- **When**: {trigger_conditions}
- **Complexity**: {Simple/Medium/Complex}

### Next Steps

1. Test skill by invoking it manually
2. Update agent that uses this skill
3. Sync to .claude/ directory
4. Update VERSION and CHANGELOG
```

## SAX Message

```markdown
[SAX] Skill: skill-creator 사용

[SAX] Reference: Anthropic Agent Skills Spec
```

## Template Reference

Use [template-skill](../template-skill/SKILL.md) as starting point for new skills.

## Examples

**Example 1: Simple Skill (assign-project-label)**

- Single SKILL.md file
- ~120 lines total
- No references needed (could add if grows to 200+)

**Example 2: Complex Skill (health-check)**

- SKILL.md: 65 lines (overview + quick start)
- references/validation-items.md: 4 validation categories
- references/output-formats.md: Success/failure examples
- references/workflow.md: Flow + re-validation policy
- **Result**: 291 → 65 lines (77.7% reduction)

**Example 3: Very Complex Skill (check-team-codex)**

- SKILL.md: 62 lines (minimal overview)
- references/codex-rules.md: Git/Code/DDD/Test rules
- references/validation-checks.md: 6 validation categories with bash
- references/execution-flow.md: Quick/Full/CI-CD workflows + output
- references/integration.md: Husky/VS Code/Package.json examples
- **Result**: 462 → 62 lines (86.6% reduction)

**Example 4: Complex Agent (epic-master)**

- SKILL.md: ~50 lines (overview + quick start)
- references/workflow-creation.md: ~100 lines
- references/workflow-migration.md: ~80 lines
- **Result**: Total ~230 lines, well organized (65% reduction)

## Related

- [Anthropic Skills Analysis](../../../../claudedocs/anthropic-skills-analysis.md)
- [template-skill](../template-skill/SKILL.md)
- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
