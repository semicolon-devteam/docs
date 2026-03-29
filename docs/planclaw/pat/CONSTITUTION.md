# PAT (Personal Auto Trader) - CONSTITUTION

> 프로젝트 헌법 (불변 원칙 & 제약사항)  
> 작성일: 2026-03-29  
> 작성자: Reus, PlanClaw

---

## 프로젝트 개요

**PAT (Personal Auto Trader)**는 개인 투자자의 투자 루틴과 전략을 그대로 구현하여 자동매매를 수행하고, 투자 피로도를 해소하는 자동매매 시스템입니다.

**첫 사용자:** 홍명희 대표  
**MVP 출시 목표:** 2026년 4월 말

---

## 기술 스택 제약

### Frontend
- **웹 대시보드**
  - 프레임워크: React 18+ (Next.js 14 App Router 권장)
  - 언어: TypeScript 5+
  - 상태 관리: Zustand 또는 Jotai (경량)
  - 차트: Recharts 또는 Lightweight Charts (TradingView)
  - UI 라이브러리: Tailwind CSS + shadcn/ui

- **모바일 앱**
  - React Native 또는 웹 PWA (초기 MVP는 PWA 권장)
  - 실시간 알림: Push Notification (Firebase Cloud Messaging)

### Backend
- **런타임/프레임워크:** Node.js 20 LTS + NestJS 10
- **언어:** TypeScript 5+
- **주요 라이브러리:**
  - `technicalindicators`: 기술적 지표 계산 (이평선, BB, RSI)
  - `ws`: WebSocket 실시간 시세
  - `axios`: HTTP 클라이언트 (증권사 API 호출)
  - `node-schedule` 또는 `bull`: 스케줄링 (장 시작/종료, 매매 시간대)

### 증권사 API
- **한국투자증권 Open API**
  - REST API: 주문, 잔고, 시세 조회
  - WebSocket: 실시간 시세 구독
  - GitHub 샘플: [koreainvestment/open-trading-api](https://github.com/koreainvestment/open-trading-api)
  - 공식 문서: [apiportal.koreainvestment.com](https://apiportal.koreainvestment.com/intro)

### Database
- **Supabase (팀 공용)**
  - PostgreSQL 15+
  - 실시간 구독 (Realtime Subscriptions)
  - Row Level Security (RLS) 적용 필수
- **스키마:**
  - `users`: 사용자 정보 (증권사 API 키 암호화 저장)
  - `trading_patterns`: 개인별 투자 루틴 설정
  - `orders`: 주문 이력 (매수/매도/취소)
  - `positions`: 보유 포지션 (실시간 평가손익)
  - `logs`: 자동매매 실행 로그

### Infrastructure
- **호스팅:** 세미콜론 OCI (Oracle Cloud Infrastructure)
  - Kubernetes 클러스터 배포
  - Namespace: `pat-prod`, `pat-dev`
- **CI/CD:** GitHub Actions → OCI Kubernetes 자동 배포
  - Push to `main` → `pat-prod` 배포
  - Push to `develop` → `pat-dev` 배포
- **API 키 관리:** Kubernetes Secrets (OCI 배포 환경)
  - 증권사 API 토큰, Supabase 연결 정보 암호화
- **모니터링:** 
  - Sentry (에러 추적)
  - 자체 대시보드 (매매 실행 로그, 수익률 모니터링)

---

## 데이터 수집 전략

### 실시간 시세
- **한국투자증권 WebSocket API** (우선)
- 대안: REST API Polling (1초 간격, rate limit 주의)

### 차트 지표 계산
- **자체 계산:** `technicalindicators` 라이브러리
  - 이평선(MA), 볼린저 밴드(BB), RSI, MACD
  - OHLCV 데이터는 한국투자 API에서 가져옴

### 야간선물
- **한국투자증권 API - 해외선물 조회** (우선)
- **크롤링 대안:** esignal.co.kr
  - Puppeteer 또는 Playwright
  - 크롤링 간격: 5분 (야간 시간대만)

### 뉴스/이슈
- **네이버 금융 크롤링**
  - URL: `https://finance.naver.com/news/`
  - 키워드: 주요 지수, 경제 이슈
- **대안:** 네이버 뉴스 API (일 25,000건 무료)

---

## 코드 품질 기준

### Linting & Formatting
- **ESLint + Prettier**
  - 설정: Airbnb Style Guide 기반 (TypeScript 확장)
- **Pre-commit hooks:** Husky + lint-staged
  - 커밋 전 자동 포맷팅 + lint 검사

### Testing
- **테스트 프레임워크:** Jest + Testing Library
- **최소 커버리지:**
  - 핵심 매매 로직: **90% 이상** (주문 실행, 손절/익절, 포지션 관리)
  - 데이터 수집/파싱: **80% 이상** (API 응답 처리, 지표 계산)
  - 대시보드/UI: **60% 이상**
  - **전체 평균: 75% 이상**
- **필수 테스트 유형:**
  - Unit Test: 매매 로직, 지표 계산
  - Integration Test: 증권사 API 호출 (Mock 서버 사용)
  - E2E Test: 주문 실행 플로우 (Sandbox 계좌 활용)

### Code Review
- **필수 리뷰어 수:** 1명 이상 (Reus 또는 WorkClaw)
- **머지 조건:**
  - CI 통과 (lint + test)
  - 리뷰 승인 1개 이상
  - 커버리지 75% 이상 유지

---

## UX 원칙

### Accessibility
- **WCAG 레벨:** AA (최소 요구사항)
- **필수 지원 스크린 리더:** iOS VoiceOver, Android TalkBack (모바일 우선)

### Responsive Design
- **지원 디바이스:**
  - 모바일: iOS 15+, Android 12+ (우선순위 1)
  - 태블릿: iPad, 안드로이드 태블릿
  - 데스크톱: 1920x1080 이상
- **Breakpoints:**
  - Mobile: 320px ~ 767px
  - Tablet: 768px ~ 1023px
  - Desktop: 1024px ~

### Performance
- **Core Web Vitals 목표:**
  - **LCP (Largest Contentful Paint):** < 2.5초
  - **FID (First Input Delay):** < 100ms
  - **CLS (Cumulative Layout Shift):** < 0.1
- **추가 목표:**
  - 실시간 시세 업데이트: < 500ms 지연
  - 주문 체결 알림: < 1초 지연

---

## 보안 원칙

### 통신
- [x] **HTTPS only** (모든 API 통신)
- [x] **CORS 정책:** 
  - 프로덕션: `https://pat.semicolon.team` 만 허용
  - 개발: `http://localhost:3000`, OCI 내부 IP

### 인증/인가
- [x] **Supabase Auth** (이메일/소셜 로그인)
  - JWT 토큰 기반 인증
  - Row Level Security (RLS)로 사용자별 데이터 격리
- [x] **비밀번호 해싱:** bcrypt (Supabase 내장)
- [x] **증권사 API 키 암호화:**
  - AES-256-GCM 암호화 후 DB 저장
  - 복호화 키는 Kubernetes Secret에만 보관

### 입력 검증
- [x] **XSS 방어:** React 내장 자동 이스케이프 + DOMPurify (필요 시)
- [x] **SQL Injection 방어:** Parameterized Queries (Supabase ORM)
- [x] **CSRF 토큰:** Supabase Auth 자동 처리

### 자동매매 특화 보안
- [x] **주문 한도 설정:** 1회 최대 주문 금액 제한 (사용자별 설정)
- [x] **이상 거래 감지:** 
  - 1분 내 10회 이상 주문 차단
  - 일일 손실 한도 초과 시 자동 정지
- [x] **2단계 인증 (2FA):** 대량 주문 또는 계좌 설정 변경 시 필수

---

## 제약사항

### 예산
- **월 인프라 비용 상한:** 제약 없음
- **외부 서비스 비용:**
  - 한국투자증권 API: 무료 (실거래 계좌 필수)
  - Supabase: 팀 공용 (무료 티어 또는 Pro)
  - Sentry: 무료 티어 (월 5,000 이벤트)

### 일정
- **MVP 출시 목표:** 2026년 4월 30일
- **Phase별 마일스톤:**
  - Phase 1 (Discovery): 2026-04-02
  - Phase 2 (PRD): 2026-04-05
  - Phase 4 (Epic): 2026-04-08
  - Phase 6 (Technical Plan): 2026-04-12
  - Phase 8 (Handoff → WorkClaw): 2026-04-15
  - MVP 개발 완료: 2026-04-28
  - 배포 & 사용자 테스트: 2026-04-29 ~ 04-30

### 법적/규제
- **준수 법령:**
  - 자본시장법 (금융위원회)
  - 개인정보 보호법 (PIPA)
  - 전자금융거래법
- **개인정보 처리:**
  - 증권사 API 키, 계좌번호: 암호화 저장 필수
  - 개인정보 처리방침 명시 (웹사이트 하단)
  - 사용자 동의 없이 제3자 제공 금지

### 자동매매 규제
- **금융감독원 가이드라인 준수:**
  - 시세 조종 금지 (High-Frequency Trading 아님)
  - 불공정거래 방지 (허위 주문 금지)
  - 사용자 책임 명시 (약관)

---

## 핵심 투자 루틴 (첫 사용자: 홍명희 대표)

> 이 섹션은 Phase 1 (Discovery)에서 상세화됩니다.

### 매매 시간대
1. **오전 8시:** 넥스트 거래 주도주 동향 확인
2. **오전 9시 ~ 10시 30분:** 주요 매매 시간 (변동성 활용)
   - 동시호가 확인 후 단타/물타기
3. **오후 2시 30분 ~ 마감:** 장 집중 모니터링

### 필수 확인 지표
- **선물 상하방 지수:** min 5300 / max 5900
- **차트 지표:** 이평선, 볼린저밴드, RSI, 매수/매도 시그널
- **야간선물:** esignal.co.kr 실시간 연동
- **경제 이슈:** 뉴스 크롤링 → 요약 제공

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2026-03-29 | 초안 작성 | PlanClaw |

---

**승인 필요:** 기술 리더 (Reus)  
**승인 여부:** [ ] 승인 / [ ] 수정 요청
