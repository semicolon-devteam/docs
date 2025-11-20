---
name: scaffold-domain
description: Creates a new domain following DDD architecture pattern with all 4 layers (Repository, API Client, Hooks, Components), boilerplate files, and test stubs. Use when starting a new feature domain.
---

# Scaffold Domain Skill

## Purpose

Quickly bootstrap a new domain with proper DDD architecture structure, boilerplate code, and test files, ensuring consistency with established patterns.

## When to Use

- **New Feature Domain**: Starting a completely new domain (e.g., notifications, messages, analytics)
- **Consistent Structure**: Need to ensure all layers are properly set up
- **Time Saving**: Avoid manual directory creation and boilerplate code
- **Onboarding**: Help new developers start with correct patterns

## Core Rules (EMBEDDED)

### DDD Architecture Requirements

All domains must have **4 layers**:
1. **Repository** (`_repositories/`): Server-side Supabase data access
2. **API Client** (`_api-clients/`): Browser HTTP communication
3. **Hooks** (`_hooks/`): React Query + state management
4. **Components** (`_components/`): Domain-specific UI

### Reference Implementations

Always base scaffolding on existing domains:
- **posts**: Gold standard for all patterns
- **dashboard**: Activity features example
- **profile**: CRUD operations example

## Scaffold Structure

```
app/{domain}/
├── _repositories/
│   ├── __tests__/
│   │   └── {Domain}Repository.test.ts
│   ├── {Domain}Repository.ts
│   └── index.ts
├── _api-clients/
│   ├── {domain}.client.ts
│   └── index.ts
├── _hooks/
│   ├── __tests__/
│   │   ├── use{Domain}.test.ts
│   │   └── use{Domain}Mutation.test.ts
│   ├── use{Domain}.ts
│   ├── use{Domain}Mutation.ts
│   └── index.ts
├── _components/
│   ├── __tests__/
│   │   ├── {Domain}List.test.tsx
│   │   └── {Domain}Header.test.tsx
│   ├── {Domain}Header.tsx
│   ├── {Domain}Filter.tsx
│   ├── {Domain}List.tsx
│   ├── {Domain}Card.tsx
│   ├── {Domain}EmptyState.tsx
│   ├── {Domain}LoadingState.tsx
│   ├── {Domain}ErrorState.tsx
│   └── index.ts
├── page.tsx
└── loading.tsx
```

## Input Parameters

When using this skill, provide:

```typescript
interface ScaffoldDomainParams {
  domain: string;              // Domain name (lowercase, singular)
  displayName: string;         // Display name for UI ("Posts", "Notifications")
  operations: string[];        // CRUD operations needed: ['read', 'create', 'update', 'delete']
  hasFiltering?: boolean;      // Need filter component? (default: true)
  hasPagination?: boolean;     // Need pagination? (default: true)
  icon?: string;              // Lucide icon name (default: 'Box')
}
```

**Example**:
```typescript
{
  domain: "notifications",
  displayName: "Notifications",
  operations: ["read", "create", "delete"],
  hasFiltering: true,
  hasPagination: true,
  icon: "Bell"
}
```

## Execution Flow

### Step 1: Validate Input

- [ ] Domain name is lowercase, singular
- [ ] No special characters (only alphanumeric)
- [ ] Not conflicting with existing domain
- [ ] Operations are valid (read/create/update/delete)

```bash
# Check if domain exists
if [ -d "app/$DOMAIN" ]; then
  echo "❌ Domain already exists: $DOMAIN"
  exit 1
fi
```

### Step 2: Create Directory Structure

```bash
#!/bin/bash
DOMAIN="$1"

# Create directories
mkdir -p "app/$DOMAIN/_repositories/__tests__"
mkdir -p "app/$DOMAIN/_api-clients"
mkdir -p "app/$DOMAIN/_hooks/__tests__"
mkdir -p "app/$DOMAIN/_components/__tests__"

echo "✅ Directory structure created"
```

### Step 3: Generate Repository Layer

```typescript
// app/{domain}/_repositories/{Domain}Repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type {
  Get{Domain}Params,
  Get{Domain}Response,
  Create{Domain}Params,
  Update{Domain}Params,
} from '@/models/{domain}';

export class {Domain}Repository {
  /**
   * Fetch {domain} list with filtering and pagination
   */
  async get{Domain}(params: Get{Domain}Params): Promise<Get{Domain}Response> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.rpc('{domain}_read', {
      p_limit: params.limit ?? 20,
      p_offset: params.offset ?? 0,
    });

    if (error) {
      console.error(`Supabase error in get{Domain}:`, error);
      throw new Error(`Failed to fetch {domain}: ${error.message}`);
    }

    if (!data) {
      return { items: [], total: 0 };
    }

    return {
      items: data as unknown as {Domain}Type[],
      total: data.length,
    };
  }

  /**
   * Create new {domain} item
   */
  async create{Domain}(params: Create{Domain}Params): Promise<{Domain}Type> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.rpc('{domain}_create', {
      p_data: params as unknown as undefined,
    });

    if (error) {
      console.error(`Supabase error in create{Domain}:`, error);
      throw new Error(`Failed to create {domain}: ${error.message}`);
    }

    return data as unknown as {Domain}Type;
  }

  // Add update{Domain}, delete{Domain} based on operations
}
```

```typescript
// app/{domain}/_repositories/index.ts
export { {Domain}Repository } from './{Domain}Repository';
```

### Step 4: Generate API Client Layer

```typescript
// app/{domain}/_api-clients/{domain}.client.ts
import { API_BASE } from '@/lib/api-clients/config';
import type {
  Get{Domain}Params,
  Get{Domain}Response,
  Create{Domain}Params,
  {Domain}Type,
} from '@/models/{domain}';

export class {Domain}ApiClient {
  private baseUrl = `${API_BASE}/{domain}`;

  /**
   * Fetch {domain} list
   */
  async get{Domain}(params: Get{Domain}Params): Promise<Get{Domain}Response> {
    const queryParams = new URLSearchParams({
      limit: params.limit?.toString() ?? '20',
      offset: params.offset?.toString() ?? '0',
    });

    const response = await fetch(`${this.baseUrl}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch {domain}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create new {domain} item
   */
  async create{Domain}(params: Create{Domain}Params): Promise<{Domain}Type> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to create {domain}: ${response.statusText}`);
    }

    return response.json();
  }

  // Add update, delete methods based on operations
}

// Factory Pattern: Export singleton instance
export const {domain}Client = new {Domain}ApiClient();
```

```typescript
// app/{domain}/_api-clients/index.ts
export { {domain}Client } from './{domain}.client';
export type { {Domain}ApiClient } from './{domain}.client';
```

### Step 5: Generate Hooks Layer

```typescript
// app/{domain}/_hooks/use{Domain}.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { {domain}Client } from '../_api-clients';
import type { Get{Domain}Params } from '@/models/{domain}';

export function use{Domain}(params: Get{Domain}Params = {}) {
  return useQuery({
    queryKey: ['{domain}', params],
    queryFn: () => {domain}Client.get{Domain}(params),
    staleTime: 60 * 1000, // 1 minute
  });
}
```

```typescript
// app/{domain}/_hooks/use{Domain}Mutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { {domain}Client } from '../_api-clients';
import type { Create{Domain}Params } from '@/models/{domain}';

export function useCreate{Domain}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Create{Domain}Params) => {domain}Client.create{Domain}(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{domain}'] });
    },
  });
}

// Add useUpdate{Domain}, useDelete{Domain} based on operations
```

```typescript
// app/{domain}/_hooks/index.ts
export { use{Domain} } from './use{Domain}';
export { useCreate{Domain} } from './use{Domain}Mutation';
// Export other hooks based on operations
```

### Step 6: Generate Components Layer

```typescript
// app/{domain}/_components/{Domain}Header.tsx
'use client';

import { {Icon} } from 'lucide-react';

export function {Domain}Header() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <{Icon} className="h-6 w-6" />
        <h1 className="text-2xl font-bold">{displayName}</h1>
      </div>
      {/* Add actions like Create button */}
    </div>
  );
}
```

```typescript
// app/{domain}/_components/{Domain}List.tsx
'use client';

import { use{Domain} } from '../_hooks';
import { {Domain}Card } from './{Domain}Card';
import { {Domain}EmptyState } from './{Domain}EmptyState';
import { {Domain}LoadingState } from './{Domain}LoadingState';
import { {Domain}ErrorState } from './{Domain}ErrorState';

export function {Domain}List() {
  const { data, isLoading, error } = use{Domain}();

  if (isLoading) return <{Domain}LoadingState />;
  if (error) return <{Domain}ErrorState error={error} />;
  if (!data?.items.length) return <{Domain}EmptyState />;

  return (
    <div className="grid gap-4">
      {data.items.map((item) => (
        <{Domain}Card key={item.id} item={item} />
      ))}
    </div>
  );
}
```

```typescript
// app/{domain}/_components/index.ts
export { {Domain}Header } from './{Domain}Header';
export { {Domain}Filter } from './{Domain}Filter';
export { {Domain}List } from './{Domain}List';
export { {Domain}Card } from './{Domain}Card';
export { {Domain}EmptyState } from './{Domain}EmptyState';
export { {Domain}LoadingState } from './{Domain}LoadingState';
export { {Domain}ErrorState } from './{Domain}ErrorState';
```

### Step 7: Generate Page

```typescript
// app/{domain}/page.tsx
import {
  {Domain}Header,
  {Domain}Filter,
  {Domain}List,
} from './_components';

export default function {Domain}Page() {
  return (
    <div className="container mx-auto py-6">
      <{Domain}Header />
      {hasFiltering && <{Domain}Filter />}
      <{Domain}List />
    </div>
  );
}
```

```typescript
// app/{domain}/loading.tsx
import { {Domain}LoadingState } from './_components';

export default function Loading() {
  return <{Domain}LoadingState />;
}
```

### Step 8: Generate API Route

```typescript
// app/api/{domain}/route.ts
import { NextRequest } from 'next/server';
import { {Domain}Repository } from '@/app/{domain}/_repositories';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const repository = new {Domain}Repository();
    const data = await repository.get{Domain}({ limit, offset });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repository = new {Domain}Repository();
    const data = await repository.create{Domain}(body);

    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add PUT, DELETE based on operations
```

### Step 9: Generate Type Definitions

```typescript
// models/{domain}/index.ts
export interface {Domain}Type {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Add domain-specific fields
}

export interface Get{Domain}Params {
  limit?: number;
  offset?: number;
  // Add filter parameters
}

export interface Get{Domain}Response {
  items: {Domain}Type[];
  total: number;
}

export interface Create{Domain}Params {
  title: string;
  content: string;
  // Add required fields
}

export interface Update{Domain}Params {
  id: string;
  title?: string;
  content?: string;
  // Add updatable fields
}
```

### Step 10: Generate Test Files

```typescript
// app/{domain}/_repositories/__tests__/{Domain}Repository.test.ts
import { {Domain}Repository } from '../{Domain}Repository';
import { createServerSupabaseClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('{Domain}Repository', () => {
  let repository: {Domain}Repository;

  beforeEach(() => {
    repository = new {Domain}Repository();
    jest.clearAllMocks();
  });

  describe('get{Domain}', () => {
    it('should fetch {domain} successfully', async () => {
      const mockData = [{ id: '1', title: 'Test' }];
      const mockSupabase = {
        rpc: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      };

      (createServerSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);

      const result = await repository.get{Domain}({ limit: 10 });

      expect(result.items).toHaveLength(1);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('{domain}_read', expect.any(Object));
    });

    it('should handle errors', async () => {
      const mockSupabase = {
        rpc: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      (createServerSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);

      await expect(repository.get{Domain}({})).rejects.toThrow('Failed to fetch {domain}');
    });
  });

  // Add tests for create, update, delete
});
```

## Output Report

After scaffolding, provide:

```markdown
# ✅ Domain Scaffolded: {domain}

## 📁 Directory Structure Created

```
app/{domain}/
├── _repositories/         ✅ Repository layer
│   ├── __tests__/
│   ├── {Domain}Repository.ts
│   └── index.ts
├── _api-clients/          ✅ API Client layer
│   ├── {domain}.client.ts
│   └── index.ts
├── _hooks/                ✅ Hooks layer
│   ├── __tests__/
│   ├── use{Domain}.ts
│   ├── use{Domain}Mutation.ts
│   └── index.ts
├── _components/           ✅ Components layer
│   ├── __tests__/
│   ├── {Domain}Header.tsx
│   ├── {Domain}List.tsx
│   ├── (+ 5 more components)
│   └── index.ts
├── page.tsx               ✅ Page route
└── loading.tsx            ✅ Loading state
```

## 🎯 Operations Implemented

- [x] Read (get{Domain})
- [x] Create (create{Domain})
- [ ] Update (update{Domain})  *Not requested*
- [ ] Delete (delete{Domain})  *Not requested*

## 📝 Next Steps

### 1. Update Core-Supabase

Check if RPC functions exist in core-supabase:
```bash
gh api repos/semicolon-devteam/core-supabase/contents/document/test/{domain}
```

If not, create RPC functions in core-supabase first.

### 2. Implement Business Logic

Update Repository methods with actual Supabase RPC calls:
```typescript
// app/{domain}/_repositories/{Domain}Repository.ts
// Replace placeholder RPC function names with actual ones from core-supabase
```

### 3. Customize UI Components

Update component designs in `_components/`:
- Customize {Domain}Card layout
- Add proper icons and styling
- Implement filtering logic if needed

### 4. Run Tests

```bash
npm test -- app/{domain}
```

### 5. Validate Quality

```bash
npm run lint
npx tsc --noEmit
```

## 🔗 References

- **DDD Architecture**: See CLAUDE.md
- **Reference Domain**: app/posts/
- **Team Codex**: https://github.com/semicolon-devteam/docs/wiki/Team-Codex
```

## Usage Examples

### Example 1: Notifications Domain

```bash
# Input
scaffold-domain \
  --domain notifications \
  --displayName "Notifications" \
  --operations read,delete \
  --hasFiltering true \
  --icon Bell

# Creates complete notifications domain with read and delete operations
```

### Example 2: Messages Domain

```bash
# Input
scaffold-domain \
  --domain messages \
  --displayName "Messages" \
  --operations read,create,update,delete \
  --hasPagination true \
  --icon MessageSquare

# Creates full CRUD messages domain
```

## Customization After Scaffolding

### Add Custom Operations

```typescript
// Add to Repository
async archive{Domain}(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc('{domain}_archive', { p_id: id });
  if (error) throw new Error(`Failed to archive: ${error.message}`);
}

// Add to API Client
async archive{Domain}(id: string): Promise<void> {
  await fetch(`${this.baseUrl}/${id}/archive`, { method: 'POST' });
}

// Add Hook
export function useArchive{Domain}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {domain}Client.archive{Domain}(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['{domain}'] }),
  });
}
```

## Remember

- **Follow existing patterns**: Always base on posts/dashboard/profile
- **Test immediately**: Run tests after scaffolding
- **Customize incrementally**: Don't modify everything at once
- **Update documentation**: Add to CLAUDE.md if creating new pattern
- **Commit early**: Commit scaffold before customization

This ensures rapid, consistent domain setup across all Semicolon projects.
