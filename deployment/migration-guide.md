---
layout: default
title: 마이그레이션 가이드
parent: Deployment
nav_order: 3
---

# 📋 세미콜론 커뮤니티 마이그레이션 가이드

프로젝트 구조 전환 및 리포지토리 재구성을 위한 종합 가이드입니다.

## 🎯 마이그레이션 목표

### 현재 상황
- FE 가이드와 인프라 문서가 혼재
- 여러 리포지토리에 문서가 분산
- 일관성 없는 문서 구조

### 목표 상태
- **command-center**: 인프라 및 생태계 문서 허브
- **cm-template**: 프론트엔드 개발 가이드
- **core/docs**: 팀 문서 및 GitHub Pages

## 📁 새로운 리포지토리 구조

### command-center (인프라 허브)
```
command-center/
├── README.md                    # 생태계 전체 개요
├── infrastructure/              # 인프라 설정
│   ├── docker/
│   ├── kubernetes/
│   └── aws/
├── microservices/              # 마이크로서비스 설정
│   └── configs/
└── scripts/                    # 운영 스크립트
```

### cm-template (프론트엔드)
```
cm-template/
├── docs/
│   ├── components/             # 컴포넌트 가이드
│   ├── hooks/                  # 커스텀 훅
│   ├── libraries/              # 라이브러리 사용법
│   │   ├── react-query.md
│   │   ├── redux.md
│   │   └── mui.md
│   └── guides/                 # 개발 가이드
│       ├── server-components.md
│       ├── tailwind.md
│       └── supabase.md
```

### core/docs (GitHub Pages)
```
core/docs/
├── _config.yml                 # Jekyll 설정
├── index.md                    # 홈페이지
├── getting-started/            # 시작 가이드
├── development/                # 개발 표준
├── collaboration/              # 협업 가이드
│   └── github/                 # GitHub 프로젝트
├── infrastructure/             # 인프라 문서
└── api/                        # API 문서
```

## 🚀 마이그레이션 단계

### Phase 1: 문서 분류 및 이동

#### 프론트엔드 문서 → cm-template
```bash
# 이동 대상
- 서버/클라이언트 컴포넌트 가이드
- TailwindCSS 스타일링
- React Query 사용법
- Redux 상태관리
- Supabase 인증
- MUI 커스터마이징
- Figma 디자인 가이드
```

#### 공통 표준 → core/docs
```bash
# 이동 대상
- 폴더 구조
- 명명 규칙
- 코드 포맷팅
- API 설계
- 환경 변수 관리
```

#### 인프라 문서 → 유지
```bash
# command-center 유지
- Docker 설정
- AWS 배포
- PostgreSQL 구성
- 마이크로서비스 설정
```

### Phase 2: 중복 제거 및 통합

#### 중복 파일 처리
```yaml
삭제:
  - 07_01_모델_정의.md (중복)
  - 07_모델정의.md (중복)
  
통합:
  - 07_백엔드_데이터_모델_정의.md → data-model.md
  - 여러 환경변수 문서 → environment-variables.md
```

#### 문서 통합 원칙
1. 최신 버전 우선
2. 상세한 내용 우선
3. 실제 사용 중인 설정 우선

### Phase 3: 링크 및 참조 업데이트

#### README 업데이트
```markdown
# 각 리포지토리 README 수정
- 새 문서 위치 반영
- 상호 참조 링크 업데이트
- 목차 재구성
```

#### GitHub Pages 네비게이션
```yaml
# _config.yml 수정
navigation:
  - title: GitHub 프로젝트
    url: /collaboration/github/
  - title: 코딩 표준
    url: /development/coding-standards/
  - title: 인프라
    url: /infrastructure/
```

## 📊 영향도 분석

### 긍정적 효과
- **문서 일관성**: 체계적인 문서 구조
- **접근성 향상**: GitHub Pages를 통한 웹 접근
- **유지보수성**: 명확한 책임 분리
- **온보딩 개선**: 신규 팀원 적응 시간 단축

### 필요 작업량
| 작업 | 예상 시간 | 우선순위 |
|-----|----------|---------|
| 문서 분류 | 3시간 | 높음 |
| 파일 이동 | 5시간 | 높음 |
| 통합 작업 | 8시간 | 중간 |
| 링크 업데이트 | 3시간 | 중간 |
| 검증 테스트 | 2시간 | 낮음 |

## ✅ 마이그레이션 체크리스트

### 준비 단계
- [ ] 백업 생성
- [ ] 팀 공지
- [ ] 브랜치 생성

### 실행 단계
- [ ] 프론트엔드 문서 이동
- [ ] 공통 표준 이동
- [ ] 중복 파일 제거
- [ ] 문서 통합

### 마무리 단계
- [ ] 링크 업데이트
- [ ] README 수정
- [ ] GitHub Pages 배포
- [ ] 팀 리뷰
- [ ] 최종 병합

## 🔄 롤백 계획

### 문제 발생 시
1. 백업에서 복원
2. 이전 커밋으로 되돌리기
3. 팀에 즉시 공지

### 부분 롤백
- 특정 문서만 원복
- 링크만 이전 상태로
- 구조는 유지하되 내용만 복원

## 📝 주의사항

### 작업 중 주의
- **브랜치 작업**: main에 직접 작업 금지
- **단계별 PR**: 큰 변경은 여러 PR로 분할
- **리뷰 필수**: 모든 변경사항 팀 리뷰

### 문서 작성 규칙
- **한글 우선**: 모든 문서는 한글로 작성
- **마크다운 사용**: 일관된 마크다운 문법
- **Jekyll 호환**: GitHub Pages 렌더링 확인

## 🚦 진행 상황

### 완료된 작업
- ✅ 마이그레이션 계획 수립
- ✅ 새 폴더 구조 설계
- ✅ GitHub Pages 설정

### 진행 중
- 🔄 문서 이동 작업
- 🔄 중복 제거
- 🔄 통합 작업

### 예정 작업
- ⏳ 링크 업데이트
- ⏳ 최종 검증
- ⏳ 팀 교육

---

> 📅 최종 업데이트: 2025-09-04
> 
> 💡 문의: DevOps 팀