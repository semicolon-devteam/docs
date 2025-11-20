# 📚 Semicolon 팀 문서 (Team Documentation)

> **모든 팀 문서는 [📖 Wiki](https://github.com/semicolon-devteam/docs/wiki)에서 확인하세요!**

---

## 📖 주요 문서

### 1️⃣ 팀 협업 (Team Collaboration)
- ⭐ [협업 가이드](https://github.com/semicolon-devteam/docs/wiki/guides/team/collaboration-guide) - 협업 원칙 (필수)
- [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process) - Epic → Production 워크플로우
- [역할별 가이드](https://github.com/semicolon-devteam/docs/wiki/Process-Roles-Guide) - PO/PSM/Engineer/QA

### 2️⃣ 기술 아키텍처 (Architecture)
- 🏗️ [Next.js 아키텍처](https://github.com/semicolon-devteam/docs/wiki/guides/architecture/nextjs-guide) - 4-Layer, 1-Hop Rule (엔지니어 필수)
- [Core 아키텍처](https://github.com/semicolon-devteam/docs/wiki/Core-Architecture) - Spring Boot 시스템
- [개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) - 기술 의사결정 원칙

### 3️⃣ 개발 컨벤션 (Conventions)
- [코드 컨벤션](https://github.com/semicolon-devteam/docs/wiki/Dev-Conventions-Code) - React/Java 규칙
- [테스트 컨벤션](https://github.com/semicolon-devteam/docs/wiki/Dev-Conventions-Testing) - 테스트 작성 규칙

### 4️⃣ AI 규칙 시스템 (For AI/LLM)
- 🤖 [전체 규칙 인덱스](https://github.com/semicolon-devteam/docs/wiki/rules/rules.yaml) - 346개 규칙 ID (머신러닝용)
- [커뮤니케이션 규칙](https://github.com/semicolon-devteam/docs/wiki/rules/communication)
- [Git 규칙](https://github.com/semicolon-devteam/docs/wiki/rules/git)
- [아키텍처 규칙](https://github.com/semicolon-devteam/docs/wiki/rules/architecture)

### 5️⃣ 자동화 도구 (Automation)
- [Epic Creation Agent](https://github.com/semicolon-devteam/docs/wiki/Epic-Creation-Agent) - AI 기반 Epic 생성
- [Epic to Tasks](https://github.com/semicolon-devteam/docs/wiki/Epic-To-Tasks-Automation) - Task 자동 생성

---

## 🚀 빠른 시작

### 신규 팀원
1. ⭐ **[협업 가이드](https://github.com/semicolon-devteam/docs/wiki/guides/team/collaboration-guide) (15분, 필수)**
2. 🏗️ **[개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) (10분, 엔지니어 필수)**
3. [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process) (20분, 전체 워크플로우)
4. 역할별 상세 가이드 확인 → [역할별 가이드](https://github.com/semicolon-devteam/docs/wiki/Process-Roles-Guide)

### 기존 팀원
- **팀 규칙 준수**: [협업 가이드](https://github.com/semicolon-devteam/docs/wiki/guides/team/collaboration-guide) 수시 확인
- **AI 규칙 참조**: [규칙 인덱스](https://github.com/semicolon-devteam/docs/wiki/rules/rules.yaml) (346개 규칙 ID)
- **기술 의사결정**: [개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) 참조
- **프로세스 변경사항**: [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process) 참고

---

## 📂 레포지토리 구조

```
docs/
├── README.md                    # 이 파일 (Wiki 링크 제공)
├── wiki/                        # GitHub Wiki 레포지토리 (별도 Git)
│   ├── Home.md                  # Wiki 랜딩 페이지 (5개 카테고리)
│   ├── guides/                  # 인간 친화적 가이드
│   │   ├── team/
│   │   │   └── collaboration-guide.md
│   │   └── architecture/
│   │       └── nextjs-guide.md
│   ├── rules/                   # AI/LLM 최적화 규칙
│   │   ├── rules.yaml          # 346개 규칙 ID (머신러닝용)
│   │   ├── communication.md
│   │   ├── git.md
│   │   ├── architecture.md
│   │   └── ...
│   ├── .legacy-backup/          # 아카이브된 문서
│   │   ├── Team-Codex.md        # → guides/team/collaboration-guide.md
│   │   └── Dev-Architecture-NextJS.md  # → guides/architecture/nextjs-guide.md
│   ├── Development-Philosophy.md
│   ├── Collaboration-Process.md
│   ├── Core-Architecture.md
│   └── ...
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

**🔗 바로가기**: [Wiki 홈](https://github.com/semicolon-devteam/docs/wiki) | [협업 가이드](https://github.com/semicolon-devteam/docs/wiki/guides/team/collaboration-guide) | [개발 철학](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy) | [협업 프로세스](https://github.com/semicolon-devteam/docs/wiki/Collaboration-Process)

_Last Updated: 2025-11-20_
