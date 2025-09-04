---
layout: page
title: 스프린트 운영
permalink: /collaboration/sprint/
---

# 스프린트 운영 가이드

## 개요
2주 단위 스프린트를 통한 애자일 개발 프로세스를 운영합니다.

## 스프린트 구조

### 스프린트 일정 (2주)
```
주차 1:
월: 스프린트 플래닝
화-금: 개발 진행
  
주차 2:
월-목: 개발 완료 및 테스트
금: 스프린트 리뷰 & 회고
```

## 스프린트 플래닝

### 준비사항
- Product Backlog 정리
- 우선순위 결정
- Story Point 추정

### 진행 방식
1. **목표 설정** (30분)
   - 스프린트 목표 정의
   - 주요 deliverable 확정

2. **백로그 선정** (1시간)
   - 우선순위별 스토리 선택
   - 팀 capacity 고려
   - Dependencies 확인

3. **작업 분해** (1시간)
   - User Story → Task 분해
   - 담당자 배정
   - 예상 시간 산정

### Story Point 추정
- 피보나치 수열: 1, 2, 3, 5, 8, 13
- Planning Poker 활용
- 기준: 1 point = 반나절 작업

## 데일리 스크럼

### 시간 및 형식
- 매일 오전 10시
- 최대 15분
- 스탠드업 미팅

### 공유 내용
1. 어제 완료한 작업
2. 오늘 진행할 작업
3. 블로커 및 이슈

### 템플릿
```markdown
**@이름**
✅ 어제: [완료 작업]
📋 오늘: [예정 작업]
🚨 블로커: [있다면 공유]
```

## 스프린트 리뷰

### 목적
- 완성된 기능 시연
- 이해관계자 피드백
- 다음 스프린트 방향 논의

### 진행 방식
1. **스프린트 성과 요약** (10분)
2. **기능 데모** (30분)
3. **피드백 수집** (20분)
4. **다음 스프린트 preview** (10분)

## 스프린트 회고

### KPT 방식
- **Keep**: 잘한 점, 유지할 점
- **Problem**: 문제점, 개선 필요
- **Try**: 다음에 시도할 것

### 회고 템플릿
```markdown
## 스프린트 N 회고

### 📊 정량 지표
- 계획: X points
- 완료: Y points
- 완료율: Z%

### Keep
- 잘 진행된 사항

### Problem
- 개선이 필요한 사항

### Try
- 다음 스프린트에 시도할 action items

### Action Items
- [ ] 담당자: 구체적 액션
```

## GitHub Projects 연동

### 보드 구성
```
📋 Backlog → 🎯 Sprint Backlog → 🚀 In Progress → 👀 Review → ✅ Done
```

### 이슈 라벨
- `sprint-N`: 스프린트 번호
- `story`: User Story
- `task`: 작업
- `bug`: 버그
- `blocked`: 블로커

### 자동화
```yaml
# .github/workflows/sprint.yml
name: Sprint Automation

on:
  issues:
    types: [opened, closed]
  pull_request:
    types: [opened, closed]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/semicolon-devteam/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 메트릭 추적

### Velocity Chart
- 최근 5개 스프린트 평균
- 완료 Story Point 추세
- 팀 capacity 예측

### Burndown Chart
- 일별 남은 작업량
- 이상적 진행선 대비
- 리스크 조기 감지

### 주요 지표
- **완료율**: 완료 points / 계획 points
- **사이클 타임**: 작업 시작 → 완료 평균 시간
- **블로커 발생률**: 블로커 수 / 전체 작업
- **재작업률**: 재오픈된 이슈 / 전체 이슈

## 스프린트 문서

### 스프린트 계획서
```markdown
# 스프린트 N (YYYY.MM.DD - YYYY.MM.DD)

## 🎯 스프린트 목표
- 주요 목표 1
- 주요 목표 2

## 📋 백로그
| ID | Story | Points | 담당자 |
|----|-------|--------|--------|
| #1 | 로그인 기능 | 5 | @name |

## 📊 Capacity
- 총 가용 시간: X hours
- 계획 points: Y
- 버퍼: 20%

## 🚨 리스크
- 리스크 1 및 대응 방안
```

### 스프린트 보고서
```markdown
# 스프린트 N 결과 보고

## 📈 성과
- 계획: X points
- 완료: Y points
- 완료율: Z%

## ✅ 완료 항목
- Feature 1 (#123)
- Bug Fix 2 (#456)

## ❌ 미완료 항목
- Story 3 (#789) - 다음 스프린트 이월

## 💡 주요 성과
- 성과 1
- 성과 2

## 📝 Lessons Learned
- 배운점 1
- 개선사항 2
```

## 역할과 책임

### Product Owner
- 백로그 관리
- 우선순위 결정
- 요구사항 명확화
- 스프린트 리뷰 주관

### Scrum Master
- 스크럼 프로세스 가이드
- 장애물 제거
- 팀 지원
- 회고 진행

### 개발팀
- 작업 수행
- 일일 진행상황 공유
- 품질 책임
- 지속적 개선

## 도구

### 필수 도구
- GitHub Projects: 백로그 관리
- Slack: 일일 커뮤니케이션
- Notion/Wiki: 문서화

### 선택 도구
- Miro: 온라인 회고
- Planning Poker: 추정
- Burndown for GitHub: 차트

## 체크리스트

### 스프린트 시작 전
- [ ] 백로그 정리 완료
- [ ] 우선순위 확정
- [ ] 팀 capacity 확인
- [ ] 스프린트 목표 수립

### 스프린트 진행 중
- [ ] 일일 스크럼 진행
- [ ] 블로커 즉시 해결
- [ ] 진행 상황 업데이트
- [ ] 번다운 차트 확인

### 스프린트 종료
- [ ] 스프린트 리뷰 완료
- [ ] 회고 진행
- [ ] 메트릭 정리
- [ ] 다음 스프린트 준비

## 참고 자료
- [Scrum Guide](https://scrumguides.org/)
- [Agile Manifesto](https://agilemanifesto.org/)
- [GitHub Projects 문서](https://docs.github.com/en/issues/planning-and-tracking-with-projects)