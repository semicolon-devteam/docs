---
layout: page
title: 시작하기
---

# 시작하기

## 환경 설정

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Git

### 프로젝트 클론

```bash
# Command Center 클론
git clone https://github.com/semicolon-devteam/command-center.git
cd command-center

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

필요한 환경 변수 설정:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your-api-key
```

## 로컬 개발 환경

### 개발 서버 실행

```bash
# 개발 모드로 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

### 테스트 실행

```bash
# 유닛 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 프로젝트 구조

```
command-center/
├── src/
│   ├── commands/     # 명령어 핸들러
│   ├── core/         # 핵심 기능
│   ├── plugins/      # 플러그인 시스템
│   ├── utils/        # 유틸리티 함수
│   └── index.js      # 진입점
├── tests/            # 테스트 파일
├── docs/             # 문서
├── scripts/          # 빌드 및 배포 스크립트
└── package.json
```

## 첫 번째 기여하기

1. **이슈 확인**: [GitHub Issues](https://github.com/semicolon-devteam/command-center/issues)에서 작업할 이슈를 선택
2. **브랜치 생성**: `feature/issue-번호-설명` 형식으로 브랜치 생성
3. **코드 작성**: 코딩 표준을 준수하며 개발
4. **테스트 작성**: 새로운 기능에 대한 테스트 추가
5. **PR 생성**: main 브랜치로 Pull Request 생성

## 유용한 명령어

```bash
# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 타입 체크 (TypeScript 프로젝트의 경우)
npm run type-check

# 의존성 업데이트 확인
npm outdated
```

## 도움말 및 지원

- [FAQ](/docs/resources/)
- [트러블슈팅 가이드](/docs/resources/)
- [Slack 채널](https://semicolon-team.slack.com)

---

다음 단계: [Command Center 문서](/docs/command-center/) →