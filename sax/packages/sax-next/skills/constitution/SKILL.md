---
name: constitution
description: Manage and update project Constitution. Detects violations, proposes amendments, and synchronizes dependent templates. Used by agents when Constitution changes are needed.
location: project
---

# Constitution Skill

**Purpose**: Project Constitution management with violation detection and template synchronization

## When to Use

Agents should invoke this skill when:

- Constitution violation detected during implementation
- New development pattern needs to be codified
- Existing principle requires clarification or update
- Team standard conflicts with Constitution
- User explicitly requests Constitution changes

## What It Does

### Phase 1 - Analyze Current State

1. **Read Constitution**
   - Load `.specify/memory/constitution.md`
   - Parse all 9 principles
   - Identify version and last update date

2. **Detect Context**
   - Violation: Implementation conflicts with principle
   - Gap: New pattern not covered by existing principles
   - Clarification: Existing principle ambiguous
   - Update: Principle needs refinement

### Phase 2 - Propose Changes

3. **Generate Proposal**
   - **For Violations**: Suggest code fix vs principle amendment
   - **For Gaps**: Draft new principle or extend existing
   - **For Clarification**: Propose clarifying language
   - **For Updates**: Show before/after comparison

4. **Rationale**
   - Explain why change is needed
   - Show impact on existing code
   - Identify affected templates and docs

### Phase 3 - User Approval

5. **Present Proposal**

   ```markdown
   ## Constitution Amendment Proposal

   **Type**: [Violation Fix | New Principle | Clarification | Update]
   **Affected Principle**: [Principle Number/Name]

   ### Current State

   [Show existing principle text]

   ### Proposed Change

   [Show new/updated principle text]

   ### Rationale

   [Why this change is needed]

   ### Impact Analysis

   - Affected files: [count]
   - Breaking changes: [yes/no]
   - Template updates required: [list]

   ### Recommendation

   [Approve | Reject | Modify]
   ```

6. **User Decision**
   - Approve → Proceed to Phase 4
   - Reject → Exit with explanation
   - Modify → Iterate on proposal

### Phase 4 - Apply Changes

7. **Update Constitution**
   - Bump version (v1.1.0 → v1.2.0 for new principles)
   - Update last modified date
   - Add changelog entry
   - Write to `.specify/memory/constitution.md`

8. **Synchronize Templates**
   - Update affected templates in `.claude/commands/speckit.*.md`
   - Sync principle references in `help.md`
   - Update `README.md` if needed
   - Regenerate any auto-generated docs

9. **Validate Consistency**
   - Verify all templates reference correct version
   - Check no orphaned principle references
   - Ensure numbering consistency

### Phase 5 - Report

10. **Generate Change Summary**

    ```markdown
    ✅ Constitution Updated: v1.2.0

    **Changes**:

    - Updated Principle VII: Type Safety
      - Added exception for RPC type assertions
      - Clarified `as unknown as Type` pattern

    **Synchronized Templates**:

    - .claude/commands/speckit.specify.md
    - .claude/commands/help.md
    - README.md

    **Next Steps**:

    - Review changes: git diff .specify/memory/constitution.md
    - Commit: "docs(constitution): Update Principle VII - Type Safety"
    - Inform team of new version
    ```

## Usage

```javascript
// Violation detected during implementation
skill: constitution({
  type: "violation",
  principle: "VII",
  context: "RPC type assertions use 'as unknown as Type'",
});

// New pattern needs codification
skill: constitution({
  type: "gap",
  proposal: "Add principle for error boundary usage",
});

// Clarification needed
skill: constitution({
  type: "clarification",
  principle: "II",
  question: "Does SSR-First apply to admin panels?",
});

// Manual update request
skill: constitution({
  type: "update",
  principle: "V",
  reason: "API mode now supports GraphQL",
});
```

## Output Format

```markdown
# Constitution Amendment Report

**Version**: v1.1.0 → v1.2.0
**Date**: 2025-01-20
**Type**: Clarification

---

## Summary

Updated **Principle VII: Type Safety** to clarify RPC type assertion patterns.

---

## Changes

### Before
```

VII. **Type Safety** (NON-NEGOTIABLE)

- No `any` types in codebase
- Proper TypeScript types for all functions

```

### After
```

VII. **Type Safety** (NON-NEGOTIABLE)

- No `any` types in codebase
- Proper TypeScript types for all functions
- **Exception**: RPC calls use `as unknown as Type` for jsonb returns
  - Pattern: `return data as unknown as Post[];`
  - Rationale: Supabase RPC jsonb type mismatch

````

---

## Impact Analysis

**Breaking Changes**: No
**Affected Files**: 3
- app/posts/_repositories/PostsRepository.ts (already compliant)
- app/dashboard/_repositories/ActivityRepository.ts (already compliant)
- app/profile/_repositories/ProfileRepository.ts (already compliant)

**Template Updates**: 2
- .claude/commands/speckit.specify.md (updated Principle VII ref)
- .claude/commands/help.md (updated Type Safety section)

---

## Validation

✅ Constitution v1.2.0 validated
✅ All templates synchronized
✅ No orphaned references
✅ Principle numbering consistent

---

## Git Commit

```bash
git add .specify/memory/constitution.md .claude/commands/
git commit -m "📝 docs(constitution): Update Principle VII - Type Safety exceptions

- Added RPC type assertion exception
- Clarified 'as unknown as Type' pattern for Supabase jsonb
- Synchronized templates with new version

Constitution: v1.1.0 → v1.2.0"
````

---

## Team Communication

**Announcement**:

> 📢 Constitution updated to v1.2.0
>
> Principle VII (Type Safety) now includes exception for RPC type assertions.
> Pattern: `return data as unknown as Type;` is approved for Supabase jsonb returns.
>
> All existing code already compliant. No action needed.

````

## Constitution Structure

The Constitution follows this format:

```markdown
# Project Constitution v1.2.0

**Last Updated**: 2025-01-20
**Status**: ACTIVE

---

## Preamble

[Purpose and scope]

---

## I. [Principle Name] (NON-NEGOTIABLE | FLEXIBLE)

**Statement**: [Core principle]

**Rationale**: [Why this matters]

**Implementation**:
- [Requirement 1]
- [Requirement 2]
- **Exception**: [If any]

**Validation**: [How to check compliance]

---

## Changelog

### v1.2.0 (2025-01-20)
- Updated Principle VII: Added RPC type assertion exception

### v1.1.0 (2025-01-15)
- Initial SDD + ADD integration
````

## Principle Categories

### NON-NEGOTIABLE

Cannot be violated without Constitution amendment:

- Principle I: DDD Architecture
- Principle II: SSR-First
- Principle III: Test-Driven Quality
- Principle VII: Type Safety
- Principle VIII: Spec-Driven Development

### FLEXIBLE

Can have exceptions with justification:

- Principle IV: Performance Excellence
- Principle V: API Mode Flexibility
- Principle VI: Atomic Design System
- Principle IX: Agent-Driven Collaboration

## Violation Handling

When a violation is detected:

### Critical Violations (NON-NEGOTIABLE)

1. **Stop implementation immediately**
2. Invoke `skill:constitution` with violation context
3. **Options**:
   - Fix code to comply
   - Propose Constitution amendment (requires strong rationale)
4. **Never proceed** without resolution

### Minor Violations (FLEXIBLE)

1. **Document exception** in code comments
2. Invoke `skill:constitution` for clarification
3. **Options**:
   - Add exception to principle
   - Fix code if straightforward
4. **May proceed** with documented justification

## Template Synchronization

These files must stay synchronized with Constitution:

### Required Updates

- `.specify/memory/constitution.md` (primary source)
- `.claude/commands/help.md` (user-facing guide)
- `README.md` (quick reference)

### Conditional Updates

- `.claude/commands/speckit.*.md` (if principles referenced)
- `.claude/skills/*/SKILL.md` (if principles mentioned)
- `docs/` directory (if principle guides exist)

## Versioning Rules

### Version Format: `vMAJOR.MINOR.PATCH`

**MAJOR** (v1 → v2):

- Complete Constitution rewrite
- Fundamental principle changes
- Breaking changes to workflow

**MINOR** (v1.1 → v1.2):

- New principle added
- Existing principle significantly updated
- Non-breaking enhancements

**PATCH** (v1.1.0 → v1.1.1):

- Clarifications
- Typo fixes
- Minor wording improvements

## Dependencies

### Foundation Commands (Layer 1)

- `/speckit.constitution` - Base constitution management
  - **Note**: This command still exists for direct user access
  - Skill wraps command with violation detection and automation

### Skills (Layer 2)

- None (standalone skill)

### External Tools

- `git diff` - Show Constitution changes
- `git commit` - Commit Constitution updates

## Related Skills

- `verify` - Uses Constitution for validation
- `implement` - Follows Constitution principles
- `spec` - References Constitution in planning

## Error Handling

If Constitution update fails:

1. **Validation Error**
   - Report which validation failed
   - Suggest fix
   - Do not apply changes

2. **Template Sync Error**
   - Partial update may occur
   - Report which templates failed
   - Provide manual sync instructions

3. **Version Conflict**
   - Detect concurrent modifications
   - Show diff
   - Request user resolution

## Success Criteria

This skill succeeds when:

- ✅ Constitution change proposed with clear rationale
- ✅ User approved changes
- ✅ Constitution file updated with correct version
- ✅ All dependent templates synchronized
- ✅ Validation passed (no orphaned refs, consistent numbering)
- ✅ Git commit prepared with descriptive message
- ✅ Team communication draft ready
