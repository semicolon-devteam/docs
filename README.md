# 📚 Semicolon 팀 문서 (Team Documentation)

> **모든 팀 문서는 [📖 Wiki](https://github.com/semicolon-devteam/docs/wiki)에서 확인하세요!**

---

## 📖 주요 문서

### ⭐ [팀 코덱스 (Team Codex)](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
**팀 운영 규칙 및 협업 원칙 - 모든 팀원 필수 숙지**

- 커뮤니케이션 규칙 (Slack 응답 시간, 멘션 규칙)
- Git & 커밋 컨벤션 (브랜치 전략, 커밋 메시지)
- 필수 코드 품질 규칙 (ESLint, 디버깅 코드 제거)
- 작업 프로세스 (이슈 관리, PR 규칙)
- 일정 & 가용성 (작업 시간, 데드라인)
- 책임과 의무 (역할별 필수 의무)
- 위반 시 처리 (경고 및 보수 관련)

### 🏗️ [개발 철학 (Development Philosophy)](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy)
**기술적 의사결정 원칙 및 설계 철학 - 엔지니어 필독**

- Semicolon 에코시스템 아키텍처 (Supabase, Spring Boot, community-core-package, Next.js)
- AI 협업 철학 (AI-cooperation, AI slut 방지)
- 코드 컨벤션 상세 (React, Java/Spring Boot)
- Next.js 애플리케이션 아키텍처 (Atomic Design, 레이어 구조)
- 테스트 전략 (Vitest 기반 레이어별 테스트)
- 설계 원칙 (SOLID, DRY, KISS, YAGNI)
- 기술 스택 선택 철학

### 🤝 [협업 프로세스 (Collaboration Process)](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process)
**Epic → Task → Dev → Staging → Production 전체 워크플로우**

- Phase별 상세 프로세스 (5단계)
- 역할별 가이드 (PO, PSM, Engineer, QA)
- 상태 전이도 및 트리거 가이드
- Mermaid 다이어그램 & 체크리스트
- FAQ 포함

### 📊 [작업량 평가 가이드 (Estimation Guide)](https://github.com/semicolon-devteam/docs/wiki/Estimation-Guide)
**Fibonacci 기반 작업량 평가 체계**

- 점수 체계 및 평가 기준 (1, 2, 3, 5, 8, 13, 21, 34)
- 11개 역할/도메인별 작업량 패턴
- Planning Poker 가이드
- 재평가 시점 및 활용 방법

### 📢 [팀 공지사항 (Team Announcement)](https://github.com/semicolon-devteam/docs/wiki/Team-Announcement)
**중요 팀 공지 및 업데이트**

---

## 🚀 빠른 시작

### 신규 팀원
1. ⭐ **[팀 코덱스](https://github.com/semicolon-devteam/docs/wiki/Team-Codex) 전체 읽기 (30분)** - 필수!
2. [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process) 전체 읽기 (30분)
3. 🏗️ **[개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) 읽기 (45분)** - 엔지니어 필독!
4. 본인 역할별 세부 가이드 확인 (10분)
5. [작업량 평가 가이드](https://github.com/semicolon-devteam/docs/wiki/Estimation-Guide) 숙지 (10분)

### 기존 팀원
- **팀 규칙 준수**: [팀 코덱스](https://github.com/semicolon-devteam/docs/wiki/Team-Codex) 수시 확인
- **기술 의사결정**: [개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) 참조
- 프로세스 변경사항: [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process) 참고
- 이터레이션 시작 전 체크리스트 확인

---

## 📂 레포지토리 구조

```
docs/
├── README.md                    # 이 파일 (Wiki 링크 제공)
├── wiki/                        # GitHub Wiki 레포지토리 (별도 Git)
│   ├── Home.md
│   ├── Team-Codex.md            # 협업 규칙 (모든 팀원)
│   ├── Development-Philosophy.md # 개발 철학 (엔지니어)
│   ├── Collaboration-Process.md
│   ├── Estimation-Guide.md
│   ├── Epic-Creation-Agent.md
│   └── Team-Announcement.md
├── .legacy-backup/              # 레거시 Jekyll 문서
└── .github/                     # Issue 템플릿 등
```

### 📝 Wiki 로컬 편집 방법

Wiki를 로컬에서 편집하려면:

```bash
# Wiki 레포지토리 클론
git clone https://github.com/semicolon-devteam/docs.wiki.git wiki

# 또는 이미 클론되어 있다면
cd wiki
git pull origin master

# 문서 편집 후
git add .
git commit -m "📝 문서 업데이트"
git push origin master
```

---

## 🤝 기여 방법

### Wiki 문서 수정
1. Wiki 레포지토리로 이동: `cd wiki`
2. 문서 편집
3. 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "📝 #{이슈번호}: 문서 내용 업데이트"
   git push origin master
   ```

### GitHub Issue 템플릿 수정
1. 새 브랜치 생성: `git checkout -b 123-update-issue-template`
2. `.github/ISSUE_TEMPLATE/` 파일 수정
3. 커밋 및 PR 생성

---

## 📞 문의 및 지원

- **PO 관련**: NO-Y-R
- **PSM 관련**: reus-jeon, garden92
- **기술 문의**: reus-jeon, garden92, kyago
- **프로세스 개선 제안**: [GitHub Discussions](https://github.com/semicolon-devteam/docs/discussions)

---

## 📂 레거시 문서

Jekyll 기반 기존 문서는 [.legacy-backup](./.legacy-backup/) 디렉토리에 보관되어 있습니다.

---

**🔗 바로가기**: [Wiki 홈](https://github.com/semicolon-devteam/docs/wiki) | [팀 코덱스](https://github.com/semicolon-devteam/docs/wiki/Team-Codex) | [개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) | [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process)

_Last Updated: 2025-10-21_
