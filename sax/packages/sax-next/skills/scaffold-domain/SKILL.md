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
- Need to create DDD structure
- Implementing feature in new domain
- Refactoring existing code to DDD

## What It Does

Creates complete domain structure with all layers:

### **1. Create Directory Structure**

```
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

### **2. Generate Boilerplate Files**

#### Repository Layer

```typescript
// app/{domain}/_repositories/{Domain}Repository.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Get{Domain}sParams, Get{Domain}sResponse } from '@/models/{domain}.model';

export class {Domain}Repository {
  async get{Domain}s(params: Get{Domain}sParams): Promise<Get{Domain}sResponse> {
    const supabase = await createServerSupabaseClient();

    // TODO: Implement using core-supabase RPC patterns
    // skill:fetch-supabase-example("{domain}", "read")

    throw new Error('Not implemented');
  }
}

// app/{domain}/_repositories/index.ts
export { {Domain}Repository } from './{Domain}Repository';
```

#### API Client Layer

```typescript
// app/{domain}/_api-clients/{domain}.client.ts
import type { Get{Domain}sParams, Get{Domain}sResponse } from '@/models/{domain}.model';

const API_BASE = process.env.NEXT_PUBLIC_API_MODE === 'spring'
  ? process.env.NEXT_PUBLIC_SPRING_API_URL
  : '/api';

export class {Domain}ApiClient {
  async get{Domain}s(params: Get{Domain}sParams): Promise<Get{Domain}sResponse> {
    const query = new URLSearchParams(params as any);
    const response = await fetch(`${API_BASE}/{domain}?${query}`);

    if (!response.ok) {
      throw new Error('Failed to fetch {domain}');
    }

    return response.json();
  }
}

// Factory Pattern singleton
export const {domain}Client = new {Domain}ApiClient();

// app/{domain}/_api-clients/index.ts
export { {domain}Client, {Domain}ApiClient } from './{domain}.client';
```

#### Hooks Layer

```typescript
// app/{domain}/_hooks/use{Domain}s.ts
import { useQuery } from '@tanstack/react-query';
import { {domain}Client } from '../_api-clients';
import type { Get{Domain}sParams } from '@/models/{domain}.model';

export function use{Domain}s(params: Get{Domain}sParams = {}) {
  return useQuery({
    queryKey: ['{domain}', params],
    queryFn: () => {domain}Client.get{Domain}s(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

// app/{domain}/_hooks/index.ts
export { use{Domain}s } from './use{Domain}s';
```

#### Components Layer

```typescript
// app/{domain}/_components/{Domain}Header.tsx
export function {Domain}Header() {
  return (
    <div>
      <h1>{Domain} Header</h1>
      {/* TODO: Implement header UI */}
    </div>
  );
}

// app/{domain}/_components/index.ts
export { {Domain}Header } from './{Domain}Header';
export { {Domain}Filter } from './{Domain}Filter';
export { {Domain}List } from './{Domain}List';
export { {Domain}EmptyState } from './{Domain}EmptyState';
export { {Domain}LoadingState } from './{Domain}LoadingState';
export { {Domain}ErrorState } from './{Domain}ErrorState';
```

#### Page Component

```typescript
// app/{domain}/page.tsx
import {
  {Domain}Header,
  {Domain}Filter,
  {Domain}List,
  {Domain}EmptyState,
  {Domain}LoadingState,
  {Domain}ErrorState,
} from './_components';
import { use{Domain}s } from './_hooks';

export default function {Domain}Page() {
  const { data, isLoading, error } = use{Domain}s();

  if (isLoading) return <{Domain}LoadingState />;
  if (error) return <{Domain}ErrorState error={error} />;
  if (!data?.items?.length) return <{Domain}EmptyState />;

  return (
    <>
      <{Domain}Header />
      <{Domain}Filter />
      <{Domain}List items={data.items} />
    </>
  );
}
```

### **3. Create Test Boilerplates**

#### Repository Tests

```typescript
// app/{domain}/_repositories/__tests__/{Domain}Repository.test.ts
import { describe, it, expect, vi } from 'vitest';
import { {Domain}Repository } from '../{Domain}Repository';

// Mock createServerSupabaseClient
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

describe('{Domain}Repository', () => {
  it('should fetch {domain}s successfully', async () => {
    // TODO: Implement test
    expect(true).toBe(true);
  });
});
```

#### Hook Tests

```typescript
// app/{domain}/_hooks/__tests__/use{Domain}s.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { use{Domain}s } from '../use{Domain}s';
import { createWrapper } from '@/lib/test-utils';

// Mock API client
vi.mock('../../_api-clients', () => ({
  {domain}Client: {
    get{Domain}s: vi.fn(),
  },
}));

describe('use{Domain}s', () => {
  it('should fetch {domain}s successfully', async () => {
    // TODO: Implement test
    expect(true).toBe(true);
  });
});
```

#### Component Tests

```typescript
// app/{domain}/_components/__tests__/{Domain}Header.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { {Domain}Header } from '../{Domain}Header';

describe('{Domain}Header', () => {
  it('should render header', () => {
    render(<{Domain}Header />);
    expect(screen.getByText('{Domain} Header')).toBeInTheDocument();
  });
});
```

### **4. Update Global Exports**

```typescript
// lib/api-clients/index.ts
export { {domain}Client } from '@/app/{domain}/_api-clients';

// models/index.ts
export type * from './{domain}.model';
```

## Usage

```javascript
// Agent invokes this skill
skill: scaffoldDomain("posts");

// Creates complete structure:
// app/posts/_repositories/
// app/posts/_api-clients/
// app/posts/_hooks/
// app/posts/_components/
// app/posts/page.tsx
// + all test boilerplates
// + index.ts exports
```

## Output Format

```
✅ Domain Scaffolded: posts

Created Structure:
app/posts/
├── _repositories/
│   ├── __tests__/
│   │   └── PostsRepository.test.ts ✅
│   ├── PostsRepository.ts ✅
│   └── index.ts ✅
├── _api-clients/
│   ├── posts.client.ts ✅
│   └── index.ts ✅
├── _hooks/
│   ├── __tests__/
│   │   └── usePosts.test.ts ✅
│   ├── usePosts.ts ✅
│   └── index.ts ✅
├── _components/
│   ├── __tests__/
│   │   └── PostsHeader.test.tsx ✅
│   ├── PostsHeader.tsx ✅
│   ├── PostsFilter.tsx ✅
│   ├── PostsList.tsx ✅
│   ├── PostsEmptyState.tsx ✅
│   ├── PostsLoadingState.tsx ✅
│   ├── PostsErrorState.tsx ✅
│   └── index.ts ✅
└── page.tsx ✅

Global Exports Updated:
- lib/api-clients/index.ts ✅
- models/index.ts ✅

Next Steps:
1. Implement Repository using skill:fetch-supabase-example
2. Complete API Client implementation
3. Implement Hooks with React Query
4. Build UI Components
5. Write comprehensive tests
```

## Standard Components Created

Each domain gets 6 standard components:

1. **{Domain}Header** - Page header with title and actions
2. **{Domain}Filter** - Filter controls (search, sort, etc.)
3. **{Domain}List** - Main list/grid display
4. **{Domain}EmptyState** - Empty state UI
5. **{Domain}LoadingState** - Loading skeletons
6. **{Domain}ErrorState** - Error display

## Dependencies

- File system operations
- Template files (optional, can use inline templates)

## Related Skills

- `implement` - Uses this skill during v0.1.x PROJECT phase
- `fetch-supabase-example` - Used to implement Repository
- `validate-architecture` - Validates created structure

## Constitution Compliance

- **Principle I**: DDD Architecture (4-layer structure)
- Creates proper separation of concerns
- Follows established patterns

## Critical Rules

1. **All 4 Layers**: Must create repositories, api-clients, hooks, components
2. **Test Directories**: Always create `__tests__/` for testable layers
3. **Index Exports**: Always create `index.ts` for clean imports
4. **Factory Pattern**: API clients must export singleton instances
5. **Standard Components**: All 6 component types must be created

## Naming Conventions

- **PascalCase**: Class names, Component names
- **camelCase**: File names (except components), function names, variable names
- **Prefix**: Underscore for domain-private directories (`_repositories`)
- **Suffix**: `.client.ts` for API clients, `.test.ts` for tests

## Error Handling

If scaffolding fails:

1. Report which step failed
2. Rollback created files (optional)
3. Provide diagnostic information
4. Agent decides retry or manual creation

## Return Values

```javascript
{
  status: "success" | "failed",
  domain: "posts",
  filesCreated: [
    "app/posts/_repositories/PostsRepository.ts",
    "app/posts/_api-clients/posts.client.ts",
    // ... full list
  ],
  nextSteps: [
    "Implement Repository",
    "Complete API Client",
    "Implement Hooks",
    "Build Components"
  ]
}
```
