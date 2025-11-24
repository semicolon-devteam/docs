---
name: validate-architecture
description: Validate DDD 4-layer architecture compliance. Checks layer structure, pattern adherence, SSR rules, and Supabase integration patterns. Used by agents during verification.
---

# Validate Architecture Skill

**Purpose**: Ensure DDD 4-layer architecture compliance and pattern adherence

## When to Use

Agents should invoke this skill when:

- After implementation completion
- During verification phase (Phase 5)
- Before PR creation
- Architecture refactoring validation
- Constitution Principle I compliance check

## What It Does

Validates architecture across multiple dimensions:

### **1. DDD 4-Layer Structure**

```bash
# Check each domain has all 4 layers
app/{domain}/
├── _repositories/      ✓ Must exist
├── _api-clients/       ✓ Must exist
├── _hooks/             ✓ Must exist
└── _components/        ✓ Must exist
```

Validates:

- All 4 directories exist
- Each has `__tests__/` subdirectory (except api-clients)
- Each has `index.ts` export file
- Proper naming conventions (`_` prefix for private)

### **2. Layer Pattern Compliance**

#### Repository Layer Rules

```typescript
// ✅ CORRECT
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class PostsRepository {
  async getPosts() {
    const supabase = await createServerSupabaseClient();
    // ...
  }
}

// ❌ WRONG: No 'use client'
("use client");
export class PostsRepository {}

// ❌ WRONG: No browser Supabase client
import { createBrowserClient } from "@/lib/supabase/client";
```

Checks:

- No `'use client'` directive
- Uses `createServerSupabaseClient`
- No browser-only APIs (localStorage, window, etc.)
- Proper error handling

#### API Client Layer Rules

```typescript
// ✅ CORRECT: Factory Pattern
export const postsClient = new PostsApiClient();

// ✅ CORRECT: Singleton export
export { postsClient } from "@/app/posts/_api-clients";

// ❌ WRONG: No singleton
export class PostsApiClient {} // Missing singleton export
```

Checks:

- Factory Pattern implemented
- Singleton instance exported
- Registered in `lib/api-clients/index.ts`
- No Supabase direct access

#### Hooks Layer Rules

```typescript
// ✅ CORRECT
import { useQuery } from "@tanstack/react-query";
import { postsClient } from "../_api-clients";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => postsClient.getPosts(),
  });
}

// ❌ WRONG: Direct Supabase access
import { createBrowserClient } from "@/lib/supabase/client";

// ❌ WRONG: Direct fetch
const response = await fetch("/api/posts");
```

Checks:

- Uses React Query (useQuery/useMutation)
- Calls API client (not direct fetch)
- No Supabase direct access
- Proper queryKey structure

#### Components Layer Rules

```typescript
// ✅ CORRECT
import { usePosts } from "../_hooks";

export function PostsList() {
  const { data } = usePosts();
  // ...
}

// ❌ WRONG: Direct API client access
import { postsClient } from "../_api-clients";

// ❌ WRONG: Direct Supabase access
import { createBrowserClient } from "@/lib/supabase/client";
```

Checks:

- Uses hooks (not API clients directly)
- No Supabase direct access
- No business logic (only UI)
- Follows Atomic Design for shared components

### **3. SSR-First Compliance**

```typescript
// ✅ CORRECT: Server Component (default)
export default async function PostsPage() {
  const repository = new PostsRepository();
  const posts = await repository.getPosts();
  return <PostsList posts={posts} />;
}

// ❌ WRONG: Unnecessary 'use client'
'use client';
export default function PostsPage() { }

// ✅ CORRECT: Client component when needed
'use client';
export function PostsFilter() {
  const [filter, setFilter] = useState('');
  // Interactive logic
}
```

Checks:

- Pages are Server Components by default
- `'use client'` only when necessary
- No event handlers in Server Components
- Client components minimized

### **4. Supabase Integration Patterns**

```typescript
// ✅ CORRECT: Repository pattern
const { data, error } = await supabase.rpc("posts_read", {
  p_limit: params.limit ?? 20,
});

if (error) throw new Error(`Failed: ${error.message}`);
return data as unknown as Post[];

// ❌ WRONG: Raw SQL
const { data } = await supabase.from("posts").select("*");

// ❌ WRONG: No error handling
const { data } = await supabase.rpc("posts_read", {});
return data; // Missing error check and type assertion
```

Checks:

- Uses RPC functions (not raw queries)
- Proper error handling
- Type assertions (`as unknown as Type`)
- Parameter naming (`p_` prefix)

### **5. Import/Export Validation**

```typescript
// ✅ CORRECT: Clean imports via index.ts
import { postsClient } from "@/app/posts/_api-clients";
import { usePosts } from "@/app/posts/_hooks";

// ❌ WRONG: Direct file imports
import { PostsApiClient } from "@/app/posts/_api-clients/posts.client";
```

Checks:

- All layers export via `index.ts`
- External imports use barrel exports
- No circular dependencies

### **6. Test Structure Validation**

```
app/{domain}/
├── _repositories/__tests__/
│   └── {Domain}Repository.test.ts    ✓ Must exist
├── _hooks/__tests__/
│   └── use{Domain}s.test.ts          ✓ Must exist
└── _components/__tests__/
    └── {Domain}Header.test.tsx       ✓ Must exist
```

Checks:

- Test files exist for each layer
- Test files follow naming convention
- Proper test structure (describe, it, expect)

## Usage

```javascript
// Full architecture validation
skill: validateArchitecture();

// Validate specific domain
skill: validateArchitecture("posts");

// Validate specific layer
skill: validateArchitecture({ domain: "posts", layer: "repositories" });

// Quick check (structure only)
skill: validateArchitecture({ quick: true });
```

## Output Format

```markdown
# Architecture Validation Report

**Domain**: posts
**Layers**: 4/4 present ✅

---

## Layer Structure ✅
```

app/posts/
├── \_repositories/
│ ├── **tests**/ ✅
│ ├── PostsRepository.ts ✅
│ └── index.ts ✅
├── \_api-clients/
│ ├── posts.client.ts ✅
│ └── index.ts ✅
├── \_hooks/
│ ├── **tests**/ ✅
│ ├── usePosts.ts ✅
│ └── index.ts ✅
└── \_components/
├── **tests**/ ✅
├── PostsHeader.tsx ✅
└── index.ts ✅

```

---

## Pattern Compliance

### Repository Layer ✅
- Server-side only: ✅
- Uses createServerSupabaseClient: ✅
- No 'use client': ✅
- Proper error handling: ✅

### API Client Layer ✅
- Factory Pattern: ✅
- Singleton exported: ✅
- Registered globally: ✅

### Hooks Layer ✅
- Uses React Query: ✅
- Calls API client: ✅
- No direct fetch: ✅

### Components Layer ⚠️
- Uses hooks: ✅
- No direct API access: ✅
- SSR-first: ⚠️ (1 unnecessary 'use client' found)

---

## SSR Compliance ⚠️

**Issues Found**:
1. app/posts/_components/PostsHeader.tsx:1
   - Unnecessary 'use client' directive
   - Component has no interactive logic
   - **Fix**: Remove 'use client'

---

## Supabase Patterns ✅

**Repository Files Checked**: 1

Pattern compliance:
- RPC functions used: ✅
- Error handling: ✅
- Type assertions: ✅
- Parameter naming: ✅

---

## Import/Export Structure ✅

- Barrel exports: ✅
- Clean imports: ✅
- No circular deps: ✅

---

## Test Structure ✅

- Repository tests: ✅
- Hook tests: ✅
- Component tests: ✅

---

## Summary

**Overall Status**: ⚠️ PASS WITH WARNINGS

**Violations**: 0 critical, 1 warning
**Constitution Compliance**:
- Principle I (DDD Architecture): ✅
- Principle II (SSR-First): ⚠️ (1 issue)

**Next Steps**:
1. Remove unnecessary 'use client' from PostsHeader.tsx
2. Re-run validation after fix
```

## Violation Severity

### 🔴 CRITICAL (Blocks PR)

- Missing required layers
- Repository with 'use client'
- Direct Supabase access in components/hooks
- No Factory Pattern in API clients
- Missing error handling in Repository

### 🟡 WARNING (Should fix)

- Unnecessary 'use client'
- Missing test files
- Suboptimal import patterns
- Missing index.ts exports

### 🟢 INFO (Nice to have)

- Naming convention improvements
- Code organization suggestions

## Reference Implementations

Points to gold standard implementations:

- **posts domain**: Complete DDD (all patterns correct)
- **dashboard domain**: Activity features example
- **profile domain**: CRUD operations example

## Dependencies

- File system access
- Pattern matching (grep, AST parsing)
- Test file discovery

## Related Skills

- `verify` - Uses this skill for architecture validation
- `scaffold-domain` - Creates validated structure
- `implement` - Ensures compliance during implementation

## Constitution Compliance

- **Principle I**: DDD Architecture (NON-NEGOTIABLE)
- **Principle II**: SSR-First Development
- Enforces 4-layer separation
- Validates pattern adherence

## Critical Rules

1. **All 4 Layers Required**: Never allow partial structure
2. **No SSR Violations**: Repository MUST be server-side
3. **Factory Pattern**: API clients MUST export singletons
4. **Supabase Patterns**: MUST use RPC functions with error handling
5. **Layer Boundaries**: MUST respect separation of concerns

## Error Handling

If validation fails:

1. Generate detailed report
2. Categorize by severity
3. Provide specific file/line references
4. Suggest fixes with examples
5. Return FAILED status
6. Agent decides fix strategy

## Return Values

```javascript
{
  status: "PASSED" | "PASSED_WITH_WARNINGS" | "FAILED",
  domain: "posts",
  layersPresent: 4,
  violations: {
    critical: 0,
    warnings: 1,
    info: 0
  },
  checks: {
    structure: { passed: true },
    patterns: { passed: true },
    ssr: { passed: false, issues: 1 },
    supabase: { passed: true },
    imports: { passed: true },
    tests: { passed: true }
  },
  report: "markdown string",
  nextSteps: ["action 1", "action 2"]
}
```

## Quick Fix Examples

### Remove Unnecessary 'use client'

```typescript
// Before
'use client';
export function PostsHeader() {
  return <h1>Posts</h1>;
}

// After
export function PostsHeader() {
  return <h1>Posts</h1>;
}
```

### Add Factory Pattern

```typescript
// Before
export class PostsApiClient {}

// After
export class PostsApiClient {}
export const postsClient = new PostsApiClient();
```

### Fix Supabase Pattern

```typescript
// Before
const { data } = await supabase.rpc("posts_read", {});
return data;

// After
const { data, error } = await supabase.rpc("posts_read", {});
if (error) throw new Error(`Failed: ${error.message}`);
return data as unknown as Post[];
```
