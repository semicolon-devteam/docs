---
name: scaffold-domain
description: Bootstrap DDD 4-layer domain structure. Use when (1) starting new domain implementation, (2) during v0.1.x PROJECT phase, (3) need to create repositories/api-clients/hooks/components with __tests__ and index.ts exports.
tools: [Bash, Write]
---

# Scaffold Domain Skill

**Purpose**: Generate complete DDD 4-layer architecture structure for a new domain

## When to Use

Agents should invoke this skill when:

- Starting new domain implementation
- During v0.1.x PROJECT phase
- Implementing feature in new domain
- Refactoring existing code to DDD

## Quick Start

### Generated Structure

```text
app/{domain}/
├── _repositories/
│   ├── __tests__/
│   └── index.ts
├── _api-clients/
│   └── index.ts
├── _hooks/
│   ├── __tests__/
│   └── index.ts
├── _components/
│   ├── __tests__/
│   └── index.ts
└── page.tsx
```

### Usage

```javascript
// Agent invokes this skill
skill: scaffoldDomain("posts");

// Creates:
// app/posts/_repositories/ + _api-clients/ + _hooks/ + _components/ + page.tsx
// + all test boilerplates + index.ts exports
```

## Standard Components Created

Each domain gets 6 standard components:

| Component | Purpose |
|-----------|---------|
| `{Domain}Header` | Page header with title and actions |
| `{Domain}Filter` | Filter controls (search, sort) |
| `{Domain}List` | Main list/grid display |
| `{Domain}EmptyState` | Empty state UI |
| `{Domain}LoadingState` | Loading skeletons |
| `{Domain}ErrorState` | Error display |

## Critical Rules

1. **All 4 Layers**: Must create repositories, api-clients, hooks, components
2. **Test Directories**: Always create `__tests__/` for testable layers
3. **Index Exports**: Always create `index.ts` for clean imports
4. **Factory Pattern**: API clients must export singleton instances

## Constitution Compliance

- **Principle I**: DDD Architecture (4-layer structure)
- Creates proper separation of concerns
- Follows established patterns

## Dependencies

- File system operations
- Template files (optional, can use inline templates)

## Related Skills

- `implement` - Uses this skill during v0.1.x PROJECT phase
- `fetch-supabase-example` - Used to implement Repository
- `validate-architecture` - Validates created structure

## References

For detailed documentation, see:

- [Layer Templates](references/layer-templates.md) - Repository, API Client, Hooks, Components boilerplate
- [Test Templates](references/test-templates.md) - Vitest test boilerplates for each layer
- [Output Format](references/output-format.md) - Success output, naming conventions, error handling
