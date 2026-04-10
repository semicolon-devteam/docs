## 기술 설계 — 아키텍처

## 기술 아키텍처

### 기술 스택
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: Supabase (PostgreSQL + Realtime)
- **결제**: 카카오페이 SDK (REST API)
- **이미지 저장**: Supabase Storage
- **배포**: Vercel

### 시스템 구조
```
고객 모바일 브라우저
  └── Next.js Frontend (Vercel)
        ├── /api/menu — 메뉴 조회
        ├── /api/orders — 주문 생성/조회
        ├── /api/payments — 카카오페이 연동
        └── /api/admin/* — 관리자 API
              └── Supabase (DB + Realtime + Storage)
```

### DB 스키마 (핵심)

**categories**
- id, name, sort_order, created_at

**menus**
- id, category_id (FK), name, description, price, image_url, is_sold_out, sort_order, created_at

**menu_option_groups**
- id, menu_id (FK), name, is_required, max_select

**menu_options**
- id, group_id (FK), name, price_delta

**orders**
- id, nickname, status (pending/accepted/completed/rejected), total_amount, created_at, completed_at

**order_items**
- id, order_id (FK), menu_id (FK), quantity, unit_price, options_json

**settings**
- key, value (JSON) — 영업시간, 카페 정보 등

### API 설계 (주요)
| Method | Path | 설명 |
|--------|------|------|
| GET | /api/menu | 카테고리+메뉴 전체 조회 |
| POST | /api/orders | 주문 생성 |
| GET | /api/orders/:id | 주문 상태 조회 |
| PATCH | /api/admin/orders/:id | 주문 상태 변경 |
| GET | /api/admin/orders | 주문 목록 (관리자) |
| POST | /api/admin/menus | 메뉴 등록 |
| PATCH | /api/admin/menus/:id | 메뉴 수정 |
| GET | /api/admin/sales | 매출 요약 |
| POST | /api/payments/ready | 카카오페이 결제 준비 |
| POST | /api/payments/approve | 카카오페이 결제 승인 |