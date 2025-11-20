---
name: fetch-supabase-example
description: Fetches reference implementation examples from semicolon-devteam/core-supabase repository for Supabase RPC patterns. Use this skill whenever implementing Supabase data access to ensure correct patterns.
---

# Fetch Supabase Example Skill

## Purpose

This skill retrieves reference implementation code from the `semicolon-devteam/core-supabase` repository to ensure consistent Supabase RPC patterns across all Semicolon projects.

## When to Use

- Implementing new Repository methods
- Need to verify RPC function names and parameters
- Want to see example error handling patterns
- Checking type assertion patterns for Supabase JSONB returns
- Understanding core-supabase parameter conventions

## Core Rules (EMBEDDED)

1. **Always Check core-supabase First**: Before creating custom RPC functions
2. **Use Exact Patterns**: Follow the example code exactly, especially:
   - RPC function names
   - Parameter names and structure
   - Type assertions (`as unknown as Type`)
   - Error handling
3. **Private Repository Access**: Use `gh cli` for private repo access

## Available Examples

### Posts Domain
| Operation | File | RPC Function |
|-----------|------|--------------|
| Get Posts | `getPosts.ts` | `posts_read` |
| Create Post | `createPost.ts` | `posts_create` |
| Update Post | `updatePost.ts` | `posts_update` |
| Delete Post | `deletePost.ts` | `posts_delete` |

### Comments Domain
| Operation | File | RPC Function |
|-----------|------|--------------|
| Get Comments | `getComments.ts` | `comments_read` |
| Create Comment | `createComment.ts` | `comments_create` |
| Update Comment | `updateComment.ts` | `comments_update` |
| Delete Comment | `deleteComment.ts` | `comments_delete` |

### Reactions Domain
| Operation | File | RPC Function |
|-----------|------|--------------|
| Toggle Reaction | `toggleReaction.ts` | `reactions_toggle` |
| Get Reactions | `getReactions.ts` | `reactions_get` |

### Activities Domain
| Operation | File | RPC Function |
|-----------|------|--------------|
| Get Activities | `getActivities.ts` | `activities_read` |
| Create Activity | `createActivity.ts` | `activities_create` |

## Usage Pattern

### 1. Determine Domain and Operation

Ask yourself:
- What domain? (posts, comments, reactions, etc.)
- What operation? (read, create, update, delete)
- Does an example exist in core-supabase?

### 2. Fetch Example

```bash
# Pattern:
gh api repos/semicolon-devteam/core-supabase/contents/document/test/{domain}/{operation}.ts \
  --jq '.content' | base64 -d

# Example: Get posts read example
gh api repos/semicolon-devteam/core-supabase/contents/document/test/posts/getPosts.ts \
  --jq '.content' | base64 -d
```

### 3. Extract Key Patterns

From the fetched example, identify:

#### A. RPC Function Name
```typescript
// Example from getPosts.ts
const { data, error } = await supabase.rpc('posts_read', {
  //                                       ^^^^^^^^^^^
  // This is the exact RPC function name to use
```

#### B. Parameter Structure
```typescript
// Example parameter naming convention
await supabase.rpc('posts_read', {
  p_limit: limit ?? 20,              // p_ prefix convention
  p_offset: offset ?? 0,
  p_user_id: userId ?? null as unknown as undefined,  // null handling
});
```

#### C. Type Assertion Pattern
```typescript
// Example type assertion for JSONB returns
const posts = data as unknown as Post[];
//                ^^^^^^^^^ Two-step assertion for safety
```

#### D. Error Handling
```typescript
// Example error handling pattern
if (error) {
  console.error('Supabase error in getPosts:', error);
  throw new Error(`Failed to fetch posts: ${error.message}`);
}

if (!data) {
  return { posts: [], total: 0 };  // Safe default
}
```

### 4. Apply to Current Project

Use the exact patterns in your Repository implementation:

```typescript
// app/{domain}/_repositories/{Domain}Repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { GetItemsParams, GetItemsResponse } from '@/models/{domain}';

export class {Domain}Repository {
  async getItems(params: GetItemsParams): Promise<GetItemsResponse> {
    const supabase = await createServerSupabaseClient();

    // Use exact RPC pattern from example
    const { data, error } = await supabase.rpc('{exact_rpc_name}', {
      p_limit: params.limit ?? 20,
      p_offset: params.offset ?? 0,
      // ... other parameters following example
    });

    // Use exact error handling from example
    if (error) {
      console.error(`Supabase error in getItems:`, error);
      throw new Error(`Failed to fetch items: ${error.message}`);
    }

    if (!data) {
      return { items: [], total: 0 };
    }

    // Use exact type assertion from example
    return {
      items: data as unknown as ItemType[],
      total: data.length,
    };
  }
}
```

## Common Patterns

### Parameter Naming Convention

core-supabase uses `p_` prefix for RPC parameters:

```typescript
// ✅ Correct (from core-supabase)
{
  p_limit: 20,
  p_offset: 0,
  p_user_id: userId,
}

// ❌ Wrong
{
  limit: 20,        // Missing p_ prefix
  offset: 0,
  userId: userId,   // Inconsistent naming
}
```

### Null Handling for Optional Parameters

```typescript
// ✅ Correct (from core-supabase)
p_user_id: userId ?? null as unknown as undefined

// ❌ Wrong
p_user_id: userId ?? undefined  // Type mismatch
p_user_id: userId || null       // Logic error
```

### Return Type Patterns

```typescript
// ✅ List Response (from core-supabase)
return {
  items: data as unknown as ItemType[],
  total: data?.length ?? 0,
};

// ✅ Single Item Response (from core-supabase)
return data?.[0] as unknown as ItemType | null;

// ✅ Boolean Response (toggle/delete operations)
return { success: true };
```

## Example Execution Flow

### Scenario: Implement "Get Posts" functionality

**Step 1**: Fetch example
```bash
gh api repos/semicolon-devteam/core-supabase/contents/document/test/posts/getPosts.ts \
  --jq '.content' | base64 -d
```

**Step 2**: Read and analyze example
```typescript
// Example shows:
// - RPC: posts_read
// - Parameters: p_limit, p_offset, p_user_id
// - Return: Post[] as unknown
// - Error handling pattern
```

**Step 3**: Apply to current project
```typescript
// app/posts/_repositories/PostsRepository.ts
export class PostsRepository {
  async getPosts(params: GetPostsParams): Promise<GetPostsResponse> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.rpc('posts_read', {
      p_limit: params.limit ?? 20,
      p_offset: params.offset ?? 0,
      p_user_id: params.userId ?? null as unknown as undefined,
    });

    if (error) {
      console.error('Supabase error in getPosts:', error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    if (!data) {
      return { posts: [], total: 0 };
    }

    return {
      posts: data as unknown as Post[],
      total: data.length,
    };
  }
}
```

## Troubleshooting

### Example Not Found

```bash
# List available examples
gh api repos/semicolon-devteam/core-supabase/contents/document/test/{domain}

# If domain doesn't exist, check available domains
gh api repos/semicolon-devteam/core-supabase/contents/document/test
```

### RPC Function Unclear

```bash
# Check RPC function definitions
gh api repos/semicolon-devteam/core-supabase/contents/docker/volumes/db/init/functions/{domain}

# Example: Check posts functions
gh api repos/semicolon-devteam/core-supabase/contents/docker/volumes/db/init/functions/05-posts
```

### Type Mismatch

If type assertion fails, verify:
1. Database types generated: `database.types.ts`
2. Model types defined: `models/{domain}/`
3. Two-step assertion used: `as unknown as Type`

## Output Format

After fetching and analyzing, provide:

```markdown
## 📥 Supabase Example Retrieved

**Domain**: {domain}
**Operation**: {operation}
**File**: `core-supabase/document/test/{domain}/{file}.ts`

### Key Patterns Identified:

**RPC Function**: `{rpc_function_name}`

**Parameters**:
```typescript
{
  p_param1: value1,
  p_param2: value2,
}
```

**Type Assertion**:
```typescript
data as unknown as {Type}[]
```

**Error Handling**:
```typescript
if (error) {
  console.error('Supabase error:', error);
  throw new Error(`Failed: ${error.message}`);
}
```

### Implementation Template:
[Provide ready-to-use code template]
```

## Remember

- **Never guess** RPC function names or parameters
- **Always fetch** the example first
- **Follow exactly** the patterns from core-supabase
- **Use gh cli** for private repository access
- **Document** which example you referenced

This ensures consistency across all Semicolon projects and reduces Supabase integration bugs.
