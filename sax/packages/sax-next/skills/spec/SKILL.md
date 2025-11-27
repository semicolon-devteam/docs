---
name: spec
description: Execute SDD Phase 1-3 workflow (specify → plan → tasks). Use when (1) starting new feature needing specification, (2) user requests spec creation, (3) need to create spec.md/plan.md/tasks.md before implementation.
tools: [Read, Write, Edit]
location: project
---

# Spec Skill (Enhanced)

**Purpose**: Orchestrate complete Spec-Driven Development (SDD) Phase 1-3 workflow with automatic clarification and optional enhancements

## When to Use

Agents should invoke this skill when:

- Starting a new feature that needs specification
- User requests feature documentation
- Requirement gathering is needed before implementation
- SDD workflow must be followed (Constitution Principle VIII)

## What It Does

### Phase 1 - Specify

1. Run `/speckit.specify [feature-description]`
   - Create feature branch: `N-short-name`
   - Generate `specs/N-short-name/spec.md`
   - Validate quality

### Phase 2 - Clarify (Automatic)

2. Run `/speckit.clarify`
   - Analyze spec.md for underspecified areas
   - Generate up to 5 targeted clarification questions
   - Collect user answers
   - Update spec.md with clarifications
   - **Skip if**: No [NEEDS CLARIFICATION] markers found

### Phase 3 - Plan

3. Run `/speckit.plan`
   - Map requirements to DDD layers
   - Document technical approach
   - Create `specs/N-short-name/plan.md`

### Phase 4 - Checklist (Optional)

4. Ask user: "커스텀 체크리스트 생성할까요? (y/n)"
   - **yes** → Run `/speckit.checklist`
     - Generate domain-specific checklist
     - Create `specs/N-short-name/checklist.md`
   - **no** → Skip to next phase

### Phase 5 - Tasks

5. Run `/speckit.tasks`
   - Break down plan into actionable tasks
   - Group by DDD layer
   - Create `specs/N-short-name/tasks.md`

### Phase 6 - Create Issues (Optional)

6. Ask user: "GitHub Issues로 변환할까요? (y/n)"
   - **yes** → Invoke `skill:create-issues`
     - Convert tasks to GitHub Issues
     - Link to parent Epic
     - Add issue references to tasks.md
   - **no** → Skip

### Phase 7 - Report Completion

7. Summarize all created artifacts
   - List generated files
   - Show GitHub Issue links (if created)
   - Suggest next steps

## Usage

```javascript
// Agent invokes this skill
skill: spec("Add real-time notifications for post comments");

// Skill executes all phases with user interaction:
// 1. /speckit.specify "Add real-time notifications..."
// 2. /speckit.clarify (automatic if needed)
//    → User answers clarification questions
// 3. /speckit.plan
// 4. Ask: "커스텀 체크리스트 생성할까요?"
// 5. /speckit.tasks
// 6. Ask: "GitHub Issues로 변환할까요?"
// 7. Return completion report
```

## Output Format

```
✅ Specification Complete: [Feature Name]

Created Files:
- specs/N-short-name/spec.md       (Requirements, acceptance criteria)
- specs/N-short-name/plan.md       (Technical approach, DDD mapping)
- specs/N-short-name/checklist.md  (Domain-specific checklist) [if enabled]
- specs/N-short-name/tasks.md      (Actionable work items)

GitHub Issues: [if created]
- #145: Repository Layer implementation
- #146: API Client implementation
- #147: Hooks implementation
- ... (15 issues total)

Branch: N-short-name
Location: specs/N-short-name/

Next Steps:
- Review spec.md for completeness
- Ready to implement: skill:implement
```

## Phase Flow Diagram

```
specify → clarify? → plan → checklist? → tasks → issues? → report
   ↓         ↓         ↓         ↓          ↓        ↓        ↓
 spec.md  (auto)   plan.md   (ask)    tasks.md   (ask)   summary
                                      checklist.md      GitHub
```

## Dependencies

### Foundation Commands (Layer 1)

- `/speckit.specify` - Create spec.md
- `/speckit.plan` - Create plan.md
- `/speckit.tasks` - Create tasks.md
- `/speckit.clarify` - Clarify underspecified areas
- `/speckit.checklist` - Generate custom checklist

### Skills (Layer 2)

- `skill:create-issues` - Convert tasks to GitHub Issues (optional)

## Related Skills

- `implement` - ADD Phase 4 implementation
- `verify` - Phase 5 verification
- `spike` - Technical exploration
- `create-issues` - GitHub Issues automation

## Constitution Compliance

- **Principle VIII**: Spec-Driven Development (NON-NEGOTIABLE)
- Ensures WHAT and WHY documented before HOW
- Creates single source of truth for features
- Automatic clarification reduces ambiguity

## Error Handling

If any phase fails:

1. Report specific error to agent
2. Suggest remediation (e.g., clarify requirements, check branch)
3. Do not proceed to next phase
4. Agent decides next action

## Configuration Options

```yaml
# Agent can configure behavior
auto_clarify: true # Always run clarify (default: true)
auto_checklist: false # Skip checklist prompt (default: false)
auto_issues: false # Skip issues prompt (default: false)
```

## Success Criteria

This skill succeeds when:

- ✅ spec.md exists with all required sections
- ✅ No [NEEDS CLARIFICATION] markers remain
- ✅ plan.md maps to DDD 4-layer architecture
- ✅ tasks.md has actionable, dependency-ordered items
- ✅ User has approved all optional phases
- ✅ All files are in correct location (specs/N-short-name/)
