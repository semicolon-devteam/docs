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

**Simple Skill** (<100 lines total):
- SKILL.md only
- All content in main file

**Medium Skill** (100-300 lines):
- SKILL.md with core instructions
- Optional: 1-2 reference files for detailed workflows

**Complex Skill** (>300 lines):
- SKILL.md with Quick Start + overview
- references/ directory with:
  - `workflow.md` - Detailed process
  - `examples.md` - Usage examples
  - `api.md` - API/command reference

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

**Example 1: Simple Skill (health-check)**
- Single SKILL.md file
- ~60 lines total
- No references needed

**Example 2: Medium Skill (assign-project-label)**
- SKILL.md with core logic
- ~120 lines total
- No references (could add if grows)

**Example 3: Complex Skill (epic-master)**
- SKILL.md ~50 lines (overview + quick start)
- references/workflow-creation.md ~100 lines
- references/workflow-migration.md ~80 lines
- Total: ~230 lines, well organized

## Related

- [Anthropic Skills Analysis](../../../../claudedocs/anthropic-skills-analysis.md)
- [template-skill](../template-skill/SKILL.md)
- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
