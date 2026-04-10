## 디자인 시스템 — 색상 팔레트

## 색상 팔레트

### Primary
- **Espresso Brown** `#4A2C2A` — 주요 CTA, 헤더
- **Cream White** `#FFF8F0` — 배경
- **Latte Beige** `#D4A574` — 보조 강조, 아이콘

### Secondary
- **Mint Green** `#A8D8B9` — 성공 상태, 주문 완료
- **Warm Gray** `#8C8279` — 비활성, 보조 텍스트
- **Alert Red** `#E74C3C` — 에러, 품절 표시

### Semantic
- `--color-bg`: #FFF8F0
- `--color-text-primary`: #2C1810
- `--color-text-secondary`: #8C8279
- `--color-accent`: #4A2C2A
- `--color-success`: #A8D8B9
- `--color-error`: #E74C3C

### 적용 원칙
- 카페의 따뜻한 분위기를 반영한 브라운 계열 기본
- 배경은 크림 화이트로 메뉴 사진이 돋보이도록
- CTA 버튼은 Espresso Brown + White 텍스트

---

## 디자인 시스템 — 타이포그래피

## 타이포그래피

### 폰트 패밀리
- **본문**: Pretendard (400, 500, 600)
- **강조/가격**: Pretendard SemiBold (600)
- **숫자/금액**: Pretendard (tabular-nums)

### 스케일
| 토큰 | 사이즈 | 용도 |
|------|--------|------|
| `text-xs` | 12px | 보조 텍스트, 품절 뱃지 |
| `text-sm` | 14px | 옵션 설명, 카테고리 |
| `text-base` | 16px | 메뉴 이름, 본문 |
| `text-lg` | 18px | 섹션 제목 |
| `text-xl` | 20px | 페이지 제목 |
| `text-2xl` | 24px | 가격 강조 |

### 행간
- 본문: 1.6
- 제목: 1.3
- 가격: 1.0

---

## 디자인 시스템 — 컴포넌트 정의

## 컴포넌트 정의

### MenuCard
- 썸네일(1:1 비율, 80px) + 메뉴명 + 가격 + 옵션 요약
- 품절 시 오버레이 + "품절" 뱃지
- 탭 시 상세 바텀시트 오픈

### CartItem
- 메뉴명 + 옵션 태그 + 수량 스테퍼(-, +) + 소계
- 스와이프 삭제 지원

### OrderStatusBadge
- `접수대기` (Yellow) → `준비중` (Blue) → `완료` (Green)
- 실시간 업데이트 (SSE/polling)

### BottomCTA
- 화면 하단 고정, Safe area 대응
- 장바구니: "N개 담김 · 합계 ₩12,500 → 주문하기"
- 결제: "카카오페이로 ₩12,500 결제"

### AdminOrderCard
- 주문번호 + 닉네임 + 메뉴 목록 + 접수시간
- "접수" / "완료" / "거절" 버튼 그룹
- 3분 경과 시 카드 테두리 경고색

### CategoryTab
- 수평 스크롤 탭, 선택 시 Espresso Brown 언더라인
- "전체" 탭 기본 선택