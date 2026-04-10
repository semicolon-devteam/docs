## 태스크 분해 — 스프린트 계획

## 태스크 분해

### Sprint 1 (2주) — 메뉴 + 주문

**T1.1 프로젝트 초기 설정** (0.5d)
- [ ] Next.js 15 프로젝트 생성
- [ ] Supabase 프로젝트 생성 + DB 스키마 마이그레이션
- [ ] Tailwind + 디자인 토큰 설정
- [ ] Vercel 배포 파이프라인

**T1.2 메뉴 조회 (고객)** (2d)
- [ ] categories, menus 테이블 seed 데이터
- [ ] GET /api/menu 엔드포인트
- [ ] 카테고리 탭 UI
- [ ] MenuCard 컴포넌트
- [ ] 메뉴 상세 바텀시트 (옵션 선택)

**T1.3 장바구니** (1.5d)
- [ ] 장바구니 상태 관리 (zustand)
- [ ] CartItem 컴포넌트
- [ ] 수량 변경, 삭제
- [ ] BottomCTA (합계 + 주문하기)

**T1.4 주문 + 결제** (3d)
- [ ] POST /api/orders 엔드포인트
- [ ] 닉네임 입력 UI
- [ ] 카카오페이 결제 연동 (ready → approve)
- [ ] 주문 완료 화면 + 대기번호
- [ ] 결제 실패 처리

**T1.5 주문 상태 조회** (1d)
- [ ] GET /api/orders/:id
- [ ] OrderStatusBadge 컴포넌트
- [ ] Supabase Realtime 구독

### Sprint 2 (1.5주) — 관리자

**T2.1 관리자 인증** (1d)
- [ ] 간단한 비밀번호 인증 (/admin)
- [ ] 세션 관리

**T2.2 주문 관리 대시보드** (2d)
- [ ] GET /api/admin/orders
- [ ] AdminOrderCard 컴포넌트
- [ ] 접수/완료/거절 액션
- [ ] 3분 미응답 경고 표시
- [ ] Realtime 신규 주문 알림

**T2.3 메뉴 관리** (2d)
- [ ] 메뉴 CRUD UI
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 품절 토글
- [ ] 카테고리 정렬

### Sprint 3 (1.5주) — 매출 + 재주문

**T3.1 매출 요약** (1.5d)
- [ ] GET /api/admin/sales
- [ ] 일간/주간 차트 (recharts)
- [ ] 인기 메뉴 TOP 5

**T3.2 재주문** (1d)
- [ ] 최근 주문 목록 UI
- [ ] 1탭 재주문 → 장바구니 자동 채움

**T3.3 운영 설정** (1d)
- [ ] 영업시간 설정 UI
- [ ] 영업시간 외 주문 차단 로직

### Buffer (1주)
- [ ] QA + 버그 수정
- [ ] 모바일 반응형 검수
- [ ] 성능 최적화 (이미지 lazy load)