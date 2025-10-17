---
layout: default
title: GitHub 프로젝트 보드 가이드
parent: GitHub
grand_parent: Collaboration
nav_order: 1
---

# 📋 GitHub 프로젝트 보드 운영 가이드

세미콜론 개발팀의 GitHub Projects를 활용한 업무 관리 체계입니다.

## 🎯 보드 구조 개요

### 이슈관리 보드 (#1)
- **목적**: 개발 작업의 실행과 추적
- **범위**: 기술적 이슈, 버그, 기능 개발
- **아이템**: 300개+ (활발히 운영중)

### 사업관리 보드 (#6)  
- **목적**: 프로젝트 포트폴리오와 비즈니스 관리
- **범위**: 사업 프로젝트, 예산, 계약
- **아이템**: 10개 이하 (전략적 관리)

## 📊 이슈관리 보드 (#1) 상세

### 워크플로우
```
대기중 → 진행중 → 확인요청 → 리뷰요청 → 병합됨 → 안정됨
         ↓                      ↓
         수정요청 ←─────────────┘
         ↓
         버려짐
```

### 우선순위 체계
- **P0(긴급)** 🔴: 서비스 장애, 4시간 내 처리
- **P1(높음)** 🟠: 핵심 버그, 1-2일 내
- **P2(보통)** 🟡: 일반 개선, 1주일 내
- **P3(낮음)** 🟢: 마이너 개선, 2-4주
- **P4(매우낮음)** ⚪: 백로그, 분기별 검토

### 주요 필드
- **기술영역**: 마케팅, 기획, 디자인, 프론트, 백엔드, 인프라
- **이터레이션**: 주간 스프린트 (예: "9월 2/4")
- **작업량**: 스토리 포인트 (1, 2, 3, 5, 8, 13)
- **레포카테고리**: Core, Microservice, Community, Management, Infrastructure

### GitHub CLI 활용
```bash
# P0/P1 긴급 이슈 확인
gh project item-list 1 --owner semicolon-devteam \
  --format json | jq '.items[] | select(.priority == "P0(긴급)" or .priority == "P1(높음)")'

# 이슈 생성
gh issue create \
  --repo semicolon-devteam/[repo-name] \
  --title "[BUG] 로그인 500 에러" \
  --label "bug,P1" \
  --project 1
```

## 💼 사업관리 보드 (#6) 상세

### 프로젝트 라이프사이클
```
💡 아이디어 → 📝 사업검토 → 🚀 개발중 → 🧪 베타테스트 
→ 📊 운영중 → 💰 수익화/🔧 유지보수 → 📦 종료
```

### 카테고리 분류
- **📊 프로젝트**: 개발/기능 프로젝트
- **💰 예산**: 비용/구매 승인
- **📑 계약**: 외부 협력/계약

### 주요 상태 구분

#### 📊 운영중 (Operations)
- 안정적 서비스 제공 집중
- 개발팀 30-50% 리소스 할당
- 정기 모니터링과 개선

#### 💰 수익화 (Monetization)  
- 수익 창출과 성장 집중
- 개발+마케팅팀 협업
- 유료 기능 개발

#### 🔧 유지보수 (Maintenance)
- 최소 리소스로 서비스 유지
- 개발팀 10% 이하 할당
- 핵심 기능만 유지

### 이슈관리 보드 연동
```markdown
# 사업관리 보드
제목: [코인톡] 메신저 서비스
프로젝트 상태: 🚀 개발중
실행이슈: #123, #124, #125

# 이슈관리 보드
제목: [코인톡] 로그인 구현
Parent Issue: 사업관리#1
Status: 진행중
```

## 📈 성과 지표

### 이슈관리 KPI
- **Lead Time**: 대기중 → 안정됨 평균 시간
- **Cycle Time**: 진행중 → 병합됨 평균 시간
- **우선순위 준수율**: P0/P1 목표 시간 내 해결률

### 사업관리 KPI
- **개발 속도**: 아이디어 → 운영 평균 시간
- **성공률**: 운영 전환 프로젝트 비율
- **ROI**: 프로젝트별 투자 대비 수익

## 🛠️ 자동화 설정

### GitHub Actions 예시
```yaml
name: Project Management Automation
on:
  issues:
    types: [opened, closed]
  pull_request:
    types: [opened, merged]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Update Project Board
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # 이슈/PR 상태에 따라 자동 업데이트
          gh project item-edit ...
```

### Slack 알림
- P0 이슈 → #emergency 채널
- PR 리뷰 요청 → #code-review 채널
- 승인 대기 → #management 채널

## 💡 베스트 프랙티스

### 일일 운영
1. **09:00**: P0/P1 긴급 이슈 확인
2. **10:00**: 데일리 스탠드업
3. **종료 전**: 진행 상황 업데이트

### 주간 운영
1. **월요일**: 스프린트 계획, 이터레이션 설정
2. **수요일**: 중간 점검, 블로커 해결
3. **금요일**: 스프린트 마감, 회고

### 작업 규칙
- WIP 제한: 개인당 "진행중" 최대 2개
- 우선순위 준수: P0 > P1 > P2 순서
- 일일 업데이트: 진행중 이슈 매일 코멘트

---

> 📅 최종 업데이트: 2025-09-04
> 
> 💡 문의: DevOps 팀