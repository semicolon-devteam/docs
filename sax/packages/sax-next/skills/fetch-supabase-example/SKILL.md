---
name: fetch-supabase-example
description: Fetch reference implementations from core-supabase repository. Use when (1) implementing Repository layer with Supabase, (2) need RPC function usage patterns, (3) checking correct parameter structures and type assertions, (4) verifying Supabase integration patterns.
tools: [Bash, Read, GitHub CLI]
---

# Fetch Supabase Example Skill

**Purpose**: Retrieve official Supabase integration patterns from core-supabase repository

## When to Use

Agents should invoke this skill when:

- Implementing Repository layer with Supabase
- Need RPC function usage patterns
- Require parameter structure examples
- Looking for type assertion patterns
- Implementing error handling for Supabase calls
- During v0.4.x CODE phase of implementation

## What It Does

1. **Identify Domain**
   - Extract domain from context (e.g., "posts", "comments", "users")
   - Determine RPC operation type (read, create, update, delete)

2. **Schema Verification (Supabase MCP 우선)**

   **CRITICAL**: 스키마 확인이 필요한 경우 **Supabase MCP를 먼저 사용**합니다.

   ```bash
   # 우선순위 1: Supabase MCP (실시간 스키마)
   mcp__supabase__list_tables()      # 테이블 목록 확인
   mcp__supabase__get_table_schema() # 테이블 스키마 상세 조회

   # 우선순위 2: database.types.ts (로컬 타입)
   @src/lib/supabase/database.types.ts

   # 우선순위 3: core-supabase (참조 구현)
   gh api repos/semicolon-devteam/core-supabase/...
   ```

   **Supabase MCP 사용 이유**:
   - `database.types.ts`는 마지막 타입 생성 시점 기준 (outdated 가능)
   - MCP는 **실시간 클라우드 DB 스키마** 직접 조회
   - 테이블 존재 여부, 컬럼 구조, FK 관계 등 정확한 정보 제공

3. **Fetch from core-supabase (참조 구현)**

   ```bash
   # List available test examples
   gh api repos/semicolon-devteam/core-supabase/contents/document/test

   # Fetch specific domain example
   gh api repos/semicolon-devteam/core-supabase/contents/document/test/posts/createPost.ts \
     --jq '.content' | base64 -d

   # Fetch RPC function definition
   gh api repos/semicolon-devteam/core-supabase/contents/docker/volumes/db/init/functions/05-posts
   ```

4. **Extract Patterns**
   - RPC function name and signature
   - Parameter naming conventions
   - Type assertion patterns (`as unknown as Type`)
   - Error handling approach
   - Response structure

5. **Return Example**
   - Formatted code example
   - Usage notes
   - Parameter descriptions
   - Type definitions needed

## Usage

```javascript
// Agent invokes this skill
skill: fetchSupabaseExample("posts", "read");

// Returns:
// - RPC function: posts_read
// - Parameters: p_limit, p_offset, p_user_id (nullable)
// - Response type: Post[]
// - Type assertion pattern
// - Error handling example
```

## Output Format

```typescript
// Example for posts_read RPC function

// 1. RPC Function Call
const { data, error } = await supabase.rpc("posts_read", {
  p_limit: params.limit ?? 20,
  p_offset: params.offset ?? 0,
  p_user_id: params.userId ?? (null as unknown as undefined),
});

// 2. Error Handling
if (error) {
  throw new Error(`Failed to fetch posts: ${error.message}`);
}

// 3. Type Assertion
return {
  posts: data as unknown as Post[],
  total: data.length,
};

// 4. Parameter Notes
// - p_limit: number (default: 20)
// - p_offset: number (default: 0)
// - p_user_id: string | undefined (use null as unknown as undefined for optional)

// 5. Type Definitions Needed
import type { Post } from "@/models/post.model";
```

## Common Patterns

### Parameter Handling

```typescript
// Optional parameters require special handling
p_optional_param: value ?? (null as unknown as undefined);

// Required parameters
p_required_param: value;
```

### Type Assertions

```typescript
// Always use "as unknown as" for type casting
data as unknown as Type[];

// For single items
data[0] as unknown as Type;
```

### Error Handling

```typescript
// Standard error handling pattern
if (error) {
  throw new Error(`Operation failed: ${error.message}`);
}
```

## Available Domains

Core-supabase provides examples for:

- `posts` - Post CRUD operations
- `comments` - Comment operations
- `users` - User profile operations
- `activities` - User activity tracking
- (Check `document/test/` for full list)

## Dependencies

- GitHub CLI (`gh`) with authentication
- Access to `semicolon-devteam/core-supabase` repository
- Internet connection

## Related Skills

- `implement` - Uses this skill during v0.4.x CODE phase
- `validate-architecture` - Verifies Supabase pattern compliance

## Constitution Compliance

- Ensures Supabase Best Practices
- Follows team-established patterns
- Maintains consistency across projects

## Critical Rules

1. **Always use RPC functions**: Never write raw SQL in Repository
2. **Follow parameter naming**: Use `p_` prefix for all RPC parameters
3. **Type assertion pattern**: Always `as unknown as Type`
4. **Error handling**: Always check error before using data
5. **Optional parameters**: Use `null as unknown as undefined`

## Storage Patterns

세미콜론 커뮤니티 솔루션은 두 개의 Storage 버킷을 운용합니다.

### Bucket Configuration

| 버킷             | 용도                        | 기본값    |
| ---------------- | --------------------------- | --------- |
| `public-bucket`  | 공개 파일 (사용자 업로드)   | ✅ 기본값 |
| `private-bucket` | 비공개 파일 (민감/관리자용) | -         |

### Upload Patterns

```typescript
// ✅ 프로필 이미지 업로드 (공개)
async uploadAvatar(userId: string, file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  const path = `avatars/${userId}/${filename}`;

  const { data, error } = await supabase.storage
    .from('public-bucket')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);
  return data.path;
}

// ✅ 게시물 첨부파일 업로드 (공개)
async uploadPostAttachment(postId: string, file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  const path = `posts/${postId}/${filename}`;

  const { data, error } = await supabase.storage
    .from('public-bucket')
    .upload(path, file);

  if (error) throw new Error(`Attachment upload failed: ${error.message}`);
  return data.path;
}

// ✅ 비공개 문서 업로드 (관리자용)
async uploadPrivateDocument(userId: string, file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  const path = `documents/${userId}/${filename}`;

  const { data, error } = await supabase.storage
    .from('private-bucket')
    .upload(path, file);

  if (error) throw new Error(`Document upload failed: ${error.message}`);
  return data.path;
}
```

### Download/URL Patterns

```typescript
// ✅ 공개 파일 URL 가져오기
function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from("public-bucket").getPublicUrl(path);
  return data.publicUrl;
}

// ✅ 비공개 파일 서명된 URL 가져오기 (만료 시간 설정)
async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from("private-bucket")
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Signed URL creation failed: ${error.message}`);
  return data.signedUrl;
}
```

### Path Convention

| 파일 유형     | 버킷             | 경로 패턴                            |
| ------------- | ---------------- | ------------------------------------ |
| 프로필 이미지 | `public-bucket`  | `avatars/{userId}/{filename}`        |
| 게시물 첨부   | `public-bucket`  | `posts/{postId}/{filename}`          |
| 썸네일        | `public-bucket`  | `thumbnails/{resourceId}/{filename}` |
| 민감한 문서   | `private-bucket` | `documents/{userId}/{filename}`      |
| 관리자 자료   | `private-bucket` | `admin/{category}/{filename}`        |

### Storage Rules

1. **버킷 명시 필수**: 모든 업로드에 버킷 이름 명시
2. **기본값 public-bucket**: 특별한 이유 없으면 `public-bucket` 사용
3. **경로 규칙 준수**: `{type}/{ownerId}/{filename}` 패턴
4. **파일명 유니크**: timestamp 또는 UUID 포함 권장

## Error Handling

If fetch fails:

1. Report which domain/operation failed
2. Check if domain exists in core-supabase
3. Suggest manual reference to core-supabase docs
4. Provide fallback generic pattern
5. Agent decides next action

## Return Values

```javascript
{
  rpcFunction: "posts_read",
  parameters: [
    { name: "p_limit", type: "number", optional: true, default: 20 },
    { name: "p_offset", type: "number", optional: true, default: 0 }
  ],
  codeExample: "// TypeScript code example",
  typeDefinitions: ["Post", "GetPostsResponse"],
  errorHandling: "// Error handling pattern",
  notes: ["Usage notes", "Important considerations"]
}
```
