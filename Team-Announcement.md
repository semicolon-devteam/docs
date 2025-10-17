# 📢 협업 프로세스 문서화 완료 공지

**발신**: Product Scrum Master
**수신**: Semicolon 전체 팀원
**날짜**: 2025-10-16

---

## 🎉 협업 프로세스 문서가 새롭게 정비되었습니다!

안녕하세요, 팀 여러분!

그동안 여러분께서 궁금해하셨던 **전체 개발 프로세스**와 **작업량 평가 기준**을 명확하게 문서화하여 공유합니다.

---

## 📚 새로운 문서

### 1️⃣ [협업 프로세스 가이드](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md)

**Epic 작성부터 프로덕션 배포까지 전체 16단계 워크플로우**

#### 🌟 주요 내용
- ✅ **전체 플로우차트**: 16단계 프로세스 한눈에 보기
- ✅ **Phase별 상세 가이드**:
  - Phase 1: Epic 작성 및 검수
  - Phase 2: Task 생성 및 검수
  - Phase 3: 개발 및 리뷰
  - Phase 4: Dev 검증 및 Staging 리뷰
  - Phase 5: QA 및 프로덕션 배포
- ✅ **역할별 가이드**: PO, PSM, Engineer, QA
- ✅ **상태 전이도**: Status 흐름 이해
- ✅ **체크리스트**: 역할별 필수 확인 사항
- ✅ **FAQ**: 자주 묻는 질문과 답변

#### 📊 시각화
- Mermaid 플로우차트
- Gantt 차트 (이터레이션 타임라인)
- 상태 전이 다이어그램
- 역할별 워크플로우

---

### 2️⃣ [작업량 평가 가이드](https://github.com/semicolon-devteam/docs/blob/main/Estimation-Guide.md)

**Fibonacci 기반 점수 체계 및 평가 기준**

#### 🌟 주요 내용
- ✅ **점수 체계**: 1, 2, 3, 5, 8, 13, 21, 34
- ✅ **복잡도 기반 평가**: 시간이 아닌 복잡도 측정
- ✅ **11개 역할/도메인별 패턴**:
  - Frontend, Backend, Bug Fix, DevOps
  - 기획, 디자인, 운영, 문서화
  - 데이터 분석, 협업/커뮤니케이션
- ✅ **DO/DON'T 가이드**: 평가 시 주의사항
- ✅ **재평가 시점**: 언제 다시 평가해야 하는지

---

## 🎯 역할별 필수 확인 사항

### 📋 PO (Product Owner)
**확인할 문서**: [협업 프로세스 - PO 가이드](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md#-po-product-owner)

**주요 업무**:
1. Epic 이슈 템플릿 작성
2. LLM 검수로 Epic 품질 개선
3. PSM과 협업하여 Epic 완성도 높이기

**체크리스트**:
- [ ] Epic 템플릿 모든 섹션 작성
- [ ] 사용자 스토리 3개 이상
- [ ] 완료 조건 명확히 정의
- [ ] LLM 검수 완료

---

### 👥 PSM (Product Scrum Master)
**확인할 문서**: [협업 프로세스 - PSM 가이드](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md#-psm-product-scrum-master)

**주요 업무**:
1. Epic 검토 및 피드백
2. Epic to Tasks 실행 및 Task 검수
3. Task 할당
4. 토요일 병합 리뷰 진행

**체크리스트**:
- [ ] Epic 사용자 스토리 검증
- [ ] Epic to Tasks dry_run 테스트
- [ ] Task 작업량 검증
- [ ] 토요일 리뷰 일정 공지

---

### 💻 Engineer (개발자)
**확인할 문서**: [협업 프로세스 - Engineer 가이드](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md#-engineer-developer)

**주요 업무**:
1. 할당된 Task 구현
2. Draft PR → Ready for Review
3. AI 리뷰 통과
4. dev 서버 검증

**체크리스트**:
- [ ] Feature Branch 생성
- [ ] Draft PR 생성
- [ ] 로컬 lint & test 통과
- [ ] Ready for Review 전환
- [ ] AI 리뷰 통과
- [ ] dev 검증 완료

**🔥 중요**: Draft PR을 사용하세요!
- Draft 상태에서는 AI 리뷰가 실행되지 않습니다
- 준비 완료 후 "Ready for review" 버튼 클릭
- 또는 `ready-for-review` 라벨 추가

---

### 🧪 QA (Quality Assurance)
**확인할 문서**: [협업 프로세스 - QA 가이드](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md#-qa-quality-assurance)

**주요 업무**:
1. 스테이지 서버 테스트 (1 이터레이션)
2. 회귀 테스트
3. 최종 배포 승인/거절

**체크리스트**:
- [ ] 테스트 계획 수립
- [ ] 기능 동작 확인
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 테스트
- [ ] 최종 승인/거절 결정

---

## 📅 이터레이션 일정 (매주 반복)

| 요일 | 주요 일정 |
|-----|---------|
| **월-금** | 개발 진행 (Draft PR → AI 리뷰 → dev 머지 → dev 검증) |
| **토요일** | 🔥 **stg 병합 리뷰** (온콜 라이브 리뷰) |
| **다음 주 월-금** | QA 테스트 (스테이지 서버) |
| **다음 토요일** | 🔥 **프로덕션 배포** 💰 (보수 지급) |

---

## 🚀 빠른 시작 가이드

### 신규 팀원
1. [협업 프로세스](https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md) 처음부터 끝까지 읽기 (30분)
2. 본인 역할별 가이드 세부 확인 (10분)
3. [작업량 평가 가이드](https://github.com/semicolon-devteam/docs/blob/main/Estimation-Guide.md) 숙지 (10분)
4. 체크리스트 북마크하기

### 기존 팀원
1. 변경사항 확인 (상태 전이도, 체크리스트)
2. 역할별 가이드 재확인
3. FAQ 확인

---

## 💡 자주 묻는 질문 (FAQ)

### Q1. Draft PR을 Ready로 전환했는데 AI 리뷰가 안 돼요
**A**: `ready-for-review` 라벨을 추가하거나, GitHub Actions에서 워크플로우 실행 로그를 확인해보세요.

### Q2. AI 리뷰에서 거절당했어요
**A**:
1. 지적사항 확인
2. 수정 후 커밋 & 푸시
3. `re-review` 라벨 추가
4. AI 재리뷰 자동 실행

### Q3. 토요일 리뷰에 참석하지 못하면?
**A**: 참석하지 않아도 리뷰는 진행되지만, 병합 거절 시 해명 기회가 없습니다. 가능한 한 참석 권장합니다.

### Q4. Epic to Tasks로 생성된 Task가 너무 많아요
**A**: PSM이 검토 단계에서 불필요한 Task를 삭제하거나 병합할 수 있습니다.

---

## 📞 문의 및 지원

- **PO 관련**: NO-Y-R
- **PSM 관련**: ladley, garden92
- **기술 문의**: Tech Lead
- **프로세스 개선 제안**: [GitHub Issues](https://github.com/semicolon-devteam/docs/issues)

---

## 🔗 관련 링크

- **협업 프로세스**: https://github.com/semicolon-devteam/docs/blob/main/Collaboration-Process.md
- **작업량 평가 가이드**: https://github.com/semicolon-devteam/docs/blob/main/Estimation-Guide.md
- **docs 레포지토리**: https://github.com/semicolon-devteam/docs

---

## ✅ 액션 아이템

모든 팀원께서는 **이번 주 내**에 다음을 완료해주세요:

- [ ] 협업 프로세스 문서 읽기
- [ ] 본인 역할별 가이드 확인
- [ ] 작업량 평가 가이드 숙지
- [ ] 체크리스트 북마크
- [ ] 궁금한 점 PSM에게 문의

---

**함께 만들어가는 효율적인 협업 문화!**
문서화를 통해 더 나은 팀워크를 만들어갑시다. 💪

감사합니다! 🙏

---

_이 공지는 Slack, 이메일, 팀 미팅 등을 통해 공유해주세요._
