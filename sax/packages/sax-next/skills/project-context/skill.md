---
name: project-context
description: cm-template 프로젝트의 아키텍처, 개발 패턴, 워크플로우 컨텍스트를 제공합니다. 구현 작업 시 자동 참조됩니다.
---

# Project Context Skill

**Purpose**: cm-template 프로젝트의 핵심 컨텍스트 제공

## When to Use

Agents should reference this skill when:

- 새 도메인/기능 구현 시
- 아키텍처 결정이 필요할 때
- 코드 패턴 확인이 필요할 때
- DDD 구조 이해가 필요할 때

## Project Overview

**Semicolon Community Template** - 세미콜론 커뮤니티 에코시스템을 위한 솔루션 기반 커뮤니티 서비스 템플릿

**Core Stack**: Next.js 14 + TypeScript + Supabase + Shadcn/ui

**Development Methodology**: SDD (Spec-Driven Development) + ADD (Agent-Driven Development)

## DDD 기반 도메인 중심 아키텍처

> **✅ ARCHITECTURE STATUS**: DDD 기반 도메인 중심 아키텍처로 전환 완료
>
> - [DDD Architecture Guide](https://github.com/semicolon-devteam/docs/blob/main/guides-architecture-template-ddd.md)
> - [Domain Structure Guide](https://github.com/semicolon-devteam/docs/blob/main/guides-architecture-template-domain-structure.md)

### 디렉토리 구조

```
src/
├── app/
│   ├── {domain}/                 # 도메인별 디렉토리
│   │   ├── _repositories/        # 서버사이드 데이터 접근 ⭐
│   │   ├── _api-clients/         # 브라우저 HTTP 통신 ⭐
│   │   ├── _hooks/               # React 상태 관리 ⭐
│   │   ├── _components/          # 도메인 전용 UI ⭐
│   │   └── page.tsx              # 페이지 라우트
│   └── ...
├── repositories/                  # 공통 인프라
├── lib/api-clients/               # 공통 인프라
├── hooks/                         # 전역 Hooks
├── components/                    # Atomic Design (도메인 독립적)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── models/                        # 전역 타입
└── lib/
    ├── supabase/
    └── utils/
```

### 핵심 원칙

1. **도메인 응집도**: 관련 코드가 `/app/{domain}/` 하위에 모임
2. **명확한 경계**: 각 도메인의 책임과 범위가 명확히 구분
3. **core-backend 정렬**: Spring Boot core-backend 구조와 동일한 패턴
4. **공통 인프라 분리**: 여러 도메인에서 공유하는 요소는 외부 계층에 위치

### Layer Responsibilities

| Layer          | 역할                   | 위치             | 핵심 규칙                                              |
| -------------- | ---------------------- | ---------------- | ------------------------------------------------------ |
| **Repository** | 서버사이드 데이터 접근 | `_repositories/` | `createServerSupabaseClient` 필수, `'use client'` 금지 |
| **API Client** | 브라우저 HTTP 통신     | `_api-clients/`  | Factory Pattern + Singleton 필수                       |
| **Hooks**      | React 상태 관리        | `_hooks/`        | React Query 사용, API Client 호출                      |
| **Components** | 도메인 전용 UI         | `_components/`   | Hooks 사용, 비즈니스 로직 금지                         |

### Data Flow (1-Hop Rule)

```
Browser → API Client → [Spring Boot | Next.js API] → Repository → Supabase
                       ↓
                     Hooks → Components
```

**❌ 금지**: `Browser → Next.js → Spring Boot` (2-hop)
**✅ 권장**: `Browser → Spring Boot` (1-hop, 프로덕션)

## Development Workflow (SDD + ADD)

### SDD Phases (1-3)

1. **Specify** (`/speckit.specify`): `specs/{domain}/spec.md` 생성
2. **Plan** (`/speckit.plan`): `specs/{domain}/plan.md` 생성
3. **Tasks** (`/speckit.tasks`): `specs/{domain}/tasks.md` 생성

### ADD Phases (4)

- **v0.0.x**: CONFIG (dependencies, spikes)
- **v0.1.x**: PROJECT (DDD scaffolding)
- **v0.2.x**: TESTS (Repository, Hooks, Components tests)
- **v0.3.x**: DATA (Models, Supabase schemas)
- **v0.4.x**: CODE (Repository → API Client → Hooks → Components)

### Key Commands

```bash
# Development
npm run dev          # localhost:3000
npm run build        # Production build
npm run lint         # ESLint

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage

# Shadcn/ui
npx shadcn-ui@latest add [component]

# Supabase Types
npx supabase gen types typescript --project-id [id] > lib/supabase/database.types.ts
```

## Component Development

### Atomic Design

| 레벨          | 설명             | 비즈니스 로직  | 예시                  |
| ------------- | ---------------- | -------------- | --------------------- |
| **Atoms**     | Shadcn/ui 기본   | ❌ 금지        | Button, Input, Card   |
| **Molecules** | 2-3개 Atoms 조합 | ❌ 금지        | FormField, UserAvatar |
| **Organisms** | 복잡한 기능      | Container 패턴 | LoginForm, Navigation |
| **Templates** | 페이지 레이아웃  | ❌ 금지        | CommunityLayout       |

### 핵심 규칙

- **Container Pattern**: `SidebarContainer` (로직) → `Sidebar` (UI)
- **Props over imports**: 데이터/콜백은 props로 전달
- **Never mix**: UI 컴포넌트에서 auth/API 직접 import 금지

## SSR-First Guidelines

1. **Server Components 기본** - `'use client'` 최소화
2. **Client는 interactive만** - 이벤트 핸들러, useState 필요 시만
3. **Server Actions 우선** - forms/mutations에 사용

### `'use client'` 추가 전 체크리스트

| 질문                     | 답변   | 결론               |
| ------------------------ | ------ | ------------------ |
| 이벤트 핸들러 필요?      | 아니오 | Server Action 고려 |
| useState/useEffect 사용? | 예     | Client 필요        |
| 브라우저 API 접근?       | 예     | Client 필수        |
| 순수 프레젠테이션?       | 예     | Server 유지        |

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# API Mode
NEXT_PUBLIC_API_MODE=next-api    # "next-api" | "spring"
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080
```

## Supabase Patterns

### Schema Verification Priority

1. **Supabase MCP** (실시간 클라우드 스키마) - 우선
2. **database.types.ts** (outdated 가능)
3. **core-supabase** (참조 구현)

### Storage Buckets

| 버킷             | 용도        | 예시                       |
| ---------------- | ----------- | -------------------------- |
| `public-bucket`  | 공개 파일   | 프로필 이미지, 게시물 첨부 |
| `private-bucket` | 비공개 파일 | 민감 문서, 관리자 자료     |

### Best Practices

- All tables: RLS enabled
- User identification: `auth.uid()`
- Naming: snake_case columns, plural tables
- Always generate types after schema changes

## Performance Targets

| 지표           | 목표    | 현재     |
| -------------- | ------- | -------- |
| LCP            | < 2.5s  | ✅       |
| FID            | < 100ms | ✅       |
| CLS            | < 0.1   | ✅       |
| Initial Bundle | < 500KB | 129KB ✅ |

## Common Patterns

### Domain Component Pattern

```typescript
// app/{domain}/_components/index.ts
export { PostsHeader } from "./PostsHeader";
export { PostsList } from "./PostsList";
export { PostsEmptyState } from "./PostsEmptyState";

// app/{domain}/page.tsx
import { PostsHeader, PostsList } from "./_components";
```

### Domain Hooks Pattern

```typescript
// app/{domain}/_hooks/index.ts
export { usePosts } from "./usePosts";

// app/{domain}/page.tsx
import { usePosts } from "./_hooks";
```

## Violations to Avoid

| ❌ 금지                              | ✅ 올바른 방법          |
| ------------------------------------ | ----------------------- |
| `client/`, `server/` 디렉토리 생성   | Atomic Design 계층 사용 |
| UI 컴포넌트에서 auth/API 직접 import | Container Pattern 사용  |
| Molecules에 복잡한 컴포넌트          | Organisms에 배치        |
| Atoms에 비즈니스 로직                | 순수 프레젠테이션만     |

## Related Skills

- `skill:validate-architecture` - DDD 4-layer 준수 검사
- `skill:scaffold-domain` - 도메인 구조 스캐폴딩
- `skill:fetch-supabase-example` - core-supabase 참조 조회
- `skill:fetch-api-spec` - core-interface 스펙 조회

## References

- **DDD Architecture**: [guides-architecture-template-ddd.md](https://github.com/semicolon-devteam/docs/blob/main/guides-architecture-template-ddd.md)
- **Domain Structure**: [guides-architecture-template-domain-structure.md](https://github.com/semicolon-devteam/docs/blob/main/guides-architecture-template-domain-structure.md)
- **Shadcn/ui**: https://ui.shadcn.com/
- **Supabase**: https://supabase.com/docs
