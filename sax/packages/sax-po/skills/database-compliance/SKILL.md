---
name: database-compliance
description: Use this skill for ANY database operations (schema changes, SQL, migrations, Supabase interactions). It contains EMBEDDED RULES to minimize token usage.
---

# Database Compliance Skill (Token Optimized)

## Core Rules (EMBEDDED - DO NOT READ EXTERNAL DOCS FOR THESE)

You MUST follow these rules without reading `constitution.md`:

1.  **DDD Architecture**:
    - All database access code MUST live in `src/app/{domain}/_repositories/`.
    - NEVER import Supabase client directly in UI components.

2.  **Type Safety**:
    - ALWAYS use generated types from `database.types.ts`.
    - Import pattern: `import { Database } from '@/shared/types/database.types';`

3.  **Supabase & RLS**:
    - Every table MUST have RLS enabled.
    - Use `auth.uid()` for user-scoped policies.

4.  **Migrations**:
    - Migrations MUST be reversible (include down migration).
    - Place migrations in `supabase/migrations/`.

## Conditional Context Loading (ONLY READ IF NEEDED)

- **IF** you are designing a "Board" or "Post" system:
  - Read `docs/database/BOARD-EXAMPLES.md` for schema patterns.
- **IF** you need to reset the database:
  - Read `docs/database/reset-and-create-boards.sql`.

## Execution Procedure

1.  **Plan**: State your plan, explicitly confirming it adheres to the **Core Rules** above.
2.  **Execute**: Perform the task (create migration, write SQL, etc.).
3.  **Verify**: Ensure the output matches the `src/app/{domain}/` structure.
