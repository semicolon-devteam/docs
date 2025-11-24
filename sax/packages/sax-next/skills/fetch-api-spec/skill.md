---
name: fetch-api-spec
description: Fetch API specification from core-interface repository. Retrieves OpenAPI 3.1 schemas, endpoint definitions, and DTO patterns for Next.js API Route implementation. Used by agents during API development.
---

# Fetch API Spec Skill

**Purpose**: Retrieve official API specification from core-interface repository for consistent API implementation

## Background

### Semicolon API Architecture

```
core-interface (OpenAPI 3.1 Spec)
        ↓ (Single Source of Truth)
   ┌────┴────┐
   ↓         ↓
core-backend   Next.js API Routes
(Spring Boot)  (cm-template)
```

- **core-interface**: Kotlin-based OpenAPI 3.1 spec repository
- **Swagger UI**: https://core-interface-ashen.vercel.app/
- **Role**: API 계약의 Single Source of Truth
- 모든 API 개발은 이 스펙을 준수해야 함

## When to Use

Agents should invoke this skill when:

- Implementing `/api/v1/*` routes in Next.js
- Need endpoint request/response schema
- Require DTO naming conventions
- Looking for API error response patterns
- During v0.4.x CODE phase of implementation
- User asks `API 스펙 확인해줘`, `{도메인} API 스펙 보여줘`

## What It Does

1. **Identify Target Endpoint**
   - Extract domain from context (e.g., "posts", "comments", "users", "me")
   - Determine HTTP method (GET, POST, PUT, DELETE)
   - Identify path parameters if any

2. **Fetch from core-interface**

   ```bash
   # Fetch complete OpenAPI spec
   gh api repos/semicolon-devteam/core-interface/contents/openapi-spec.json \
     --jq '.content' | base64 -d

   # Quick reference: Swagger UI
   # https://core-interface-ashen.vercel.app/
   ```

3. **Extract Relevant Schema**
   - Path definition (parameters, request body)
   - Response schemas (success, error)
   - Referenced component schemas
   - DTO type definitions

4. **Return Formatted Output**
   - Endpoint specification
   - TypeScript interface definitions
   - Usage examples
   - Error handling patterns

## DTO Naming Convention (CRITICAL)

**Operation ID Prefix Rule**:

모든 Request/Response DTO는 Operation ID를 prefix로 사용합니다.

```typescript
// Operation ID: getMe
// Response DTO: GetMeResponse
export interface GetMeResponse {
  id: string;
  email: string;
  nickname: string;
  // ...
}

// Operation ID: createPost
// Request DTO: CreatePostRequest
// Response DTO: CreatePostResponse
export interface CreatePostRequest {
  title: string;
  content: string;
  boardId: string;
}

export interface CreatePostResponse {
  id: string;
  title: string;
  // ...
}
```

**Polymorphic Types Pattern**:

sealed interface + discriminator 패턴 사용:

```typescript
// Base type with discriminator
export type ContentBlock = TextBlock | ImageBlock | CodeBlock;

export interface TextBlock {
  type: "text"; // discriminator
  content: string;
}

export interface ImageBlock {
  type: "image"; // discriminator
  url: string;
  alt?: string;
}

export interface CodeBlock {
  type: "code"; // discriminator
  language: string;
  content: string;
}
```

## Output Format

```typescript
// Endpoint: GET /api/v1/me
// Operation ID: getMe

// 1. Response Schema
export interface GetMeResponse {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
}

// 2. Error Response (Standard)
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// 3. Implementation Pattern
export async function GET(request: NextRequest) {
  try {
    // ... implementation
    return NextResponse.json<GetMeResponse>(data);
  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      { error: { code: "INTERNAL_ERROR", message: error.message } },
      { status: 500 },
    );
  }
}
```

## Common Endpoints Reference

| Domain   | Endpoints                             | Operation IDs                                            |
| -------- | ------------------------------------- | -------------------------------------------------------- |
| Auth     | `/api/v1/me`                          | getMe                                                    |
| Posts    | `/api/v1/posts`, `/api/v1/posts/{id}` | getPosts, getPost, createPost, updatePost, deletePost    |
| Comments | `/api/v1/posts/{postId}/comments`     | getComments, createComment, updateComment, deleteComment |
| Users    | `/api/v1/users/{id}`                  | getUser, updateUser                                      |
| Boards   | `/api/v1/boards`                      | getBoards, getBoard                                      |

## Usage Examples

### Example 1: Fetch Posts API Spec

```javascript
// Agent invokes this skill
skill: fetchApiSpec("posts", "GET /api/v1/posts");

// Returns:
// - Path: /api/v1/posts
// - Method: GET
// - Query Parameters: limit, offset, boardId
// - Response: GetPostsResponse (Post[])
// - TypeScript interfaces
```

### Example 2: Create Comment API Spec

```javascript
// Agent invokes this skill
skill: fetchApiSpec("comments", "POST /api/v1/posts/{postId}/comments");

// Returns:
// - Path: /api/v1/posts/{postId}/comments
// - Method: POST
// - Path Parameters: postId
// - Request Body: CreateCommentRequest
// - Response: CreateCommentResponse
// - Error codes and handling
```

## Integration with Other Skills

| Skill                    | Integration                     |
| ------------------------ | ------------------------------- |
| `fetch-supabase-example` | API 스펙 → Supabase RPC 매핑    |
| `implement`              | v0.4.x CODE phase에서 자동 호출 |
| `validate-architecture`  | API 응답 타입 검증              |

## GitHub CLI Commands

```bash
# Fetch OpenAPI spec
gh api repos/semicolon-devteam/core-interface/contents/openapi-spec.json \
  --jq '.content' | base64 -d

# Fetch README for contribution guidelines
gh api repos/semicolon-devteam/core-interface/contents/README.md \
  --jq '.content' | base64 -d

# Fetch CONTRIBUTING.md for DTO rules
gh api repos/semicolon-devteam/core-interface/contents/CONTRIBUTING.md \
  --jq '.content' | base64 -d
```

## Error Handling

If fetch fails:

1. Report which endpoint/schema failed
2. Suggest checking Swagger UI directly: https://core-interface-ashen.vercel.app/
3. Provide fallback generic pattern
4. Agent decides next action

## Constitution Compliance

- Ensures API contract consistency across projects
- Follows team-established DTO naming conventions
- Maintains type safety with TypeScript
- Supports 1-Hop Rule (Browser → Backend directly)

## Critical Rules

1. **Always check spec first**: Never implement API without checking core-interface
2. **Follow DTO naming**: Operation ID prefix (e.g., GetMeResponse)
3. **Polymorphic patterns**: Use discriminator field for union types
4. **Error responses**: Follow standard ErrorResponse format
5. **Type safety**: Generate TypeScript interfaces from spec

## Dependencies

- GitHub CLI (`gh`) with authentication
- Access to `semicolon-devteam/core-interface` repository
- Internet connection

## Related Resources

- **Swagger UI**: https://core-interface-ashen.vercel.app/
- **core-interface repo**: https://github.com/semicolon-devteam/core-interface
- **core-backend repo**: https://github.com/semicolon-devteam/core-backend

## Return Values

```javascript
{
  endpoint: "/api/v1/posts",
  method: "GET",
  operationId: "getPosts",
  parameters: [
    { name: "limit", in: "query", type: "number", required: false },
    { name: "offset", in: "query", type: "number", required: false }
  ],
  requestBody: null,
  responseSchema: "GetPostsResponse",
  typeDefinitions: "// TypeScript interface code",
  errorCodes: ["NOT_FOUND", "UNAUTHORIZED", "INTERNAL_ERROR"],
  swaggerUrl: "https://core-interface-ashen.vercel.app/#/Posts/getPosts"
}
```
