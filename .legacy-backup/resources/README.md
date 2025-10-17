---
layout: page
title: 팀 리소스
---

# 팀 리소스

## 유용한 링크

### 내부 도구
- [Command Center](https://command.semicolon.team) - 팀 리더를 위한 지휘통제실 (경영진 이슈 공유용)
- [팀 Wiki](https://wiki.semicolon.team)
- [CI/CD 대시보드](https://ci.semicolon.team)
- [모니터링 대시보드](https://grafana.semicolon.team)
- [로그 뷰어](https://logs.semicolon.team)

### 외부 문서
- [Node.js 공식 문서](https://nodejs.org/docs)
- [Docker 문서](https://docs.docker.com)
- [Kubernetes 문서](https://kubernetes.io/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs)
- [Redis 문서](https://redis.io/documentation)

### 개발 도구
- [Visual Studio Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com)
- [DBeaver](https://dbeaver.io)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Lens (Kubernetes IDE)](https://k8slens.dev)

## 팀 컨벤션

### 브랜치 명명
```
feature/issue-{번호}-{간단한-설명}
bugfix/issue-{번호}-{간단한-설명}
hotfix/issue-{번호}-{간단한-설명}
release/v{버전}
```

### 커밋 메시지 템플릿
```
<type>(<scope>): <subject>

<body>

<footer>
```

### PR 템플릿
```markdown
## 개요
이 PR이 해결하는 문제나 추가하는 기능을 간단히 설명

## 변경사항
- 변경사항 1
- 변경사항 2
- 변경사항 3

## 테스트
- [ ] 유닛 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 로컬 환경 테스트 완료

## 체크리스트
- [ ] 코드 리뷰 요청
- [ ] 문서 업데이트
- [ ] 변경 로그 작성

Closes #이슈번호
```

### 코드 리뷰 가이드라인

#### 리뷰어 체크리스트
- [ ] 기능 요구사항 충족
- [ ] 코딩 표준 준수
- [ ] 테스트 커버리지 확인
- [ ] 성능 영향 검토
- [ ] 보안 취약점 확인
- [ ] 문서화 적절성

#### 리뷰 코멘트 규칙
- **[필수]**: 반드시 수정해야 함
- **[제안]**: 개선하면 좋음
- **[질문]**: 설명이 필요함
- **[참고]**: 정보 공유

## 개발 환경 설정

### VS Code 추천 확장

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vscode.vscode-typescript-tslint-plugin",
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker",
    "wayou.vscode-todo-highlight",
    "gruntfuggly.todo-tree",
    "mikestead.dotenv",
    "redhat.vscode-yaml"
  ]
}
```

### Git 설정

```bash
# 사용자 정보
git config --global user.name "Your Name"
git config --global user.email "you@semicolon.team"

# 유용한 알리아스
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 자동 CRLF 변환 (Windows)
git config --global core.autocrlf true

# 자동 CRLF 변환 (Mac/Linux)
git config --global core.autocrlf input
```

### Node.js 버전 관리 (nvm)

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 18 설치
nvm install 18
nvm use 18
nvm alias default 18

# .nvmrc 파일 사용
echo "18" > .nvmrc
nvm use
```

## FAQ

### Q: 로컬 환경에서 데이터베이스 연결이 안 됩니다.
A: 다음 사항을 확인하세요:
1. PostgreSQL 서비스가 실행 중인지 확인
2. `.env` 파일의 `DATABASE_URL` 설정 확인
3. 데이터베이스 사용자 권한 확인
4. 방화벽 설정 확인

### Q: Docker 컨테이너가 시작되지 않습니다.
A: 다음 명령어로 문제를 진단하세요:
```bash
docker logs <container-name>
docker inspect <container-name>
docker-compose logs
```

### Q: 테스트가 CI에서만 실패합니다.
A: 환경 차이를 확인하세요:
1. Node.js 버전 일치 확인
2. 환경 변수 설정 확인
3. 타임존 설정 확인
4. 의존성 버전 lock 파일 확인

### Q: PR이 머지되지 않습니다.
A: 다음 사항을 확인하세요:
1. 모든 체크가 통과했는지 확인
2. 리뷰 승인을 받았는지 확인
3. 브랜치 보호 규칙 확인
4. 충돌 해결 여부 확인

### Q: 프로덕션 배포 후 롤백이 필요합니다.
A: 롤백 절차:
```bash
# Kubernetes 롤백
kubectl rollout undo deployment/[deployment-name]

# Docker 롤백
docker-compose down
docker-compose up -d --scale app=0
docker-compose up -d
```

## 팀 커뮤니케이션

### Slack 채널
- `#general` - 일반 공지 및 토론
- `#dev` - 개발 관련 논의
- `#alerts` - 시스템 알림
- `#random` - 자유로운 대화
- `#help` - 도움 요청

### 회의
- **일일 스탠드업**: 매일 오전 10시
- **스프린트 계획**: 격주 월요일 오후 2시
- **회고**: 격주 금요일 오후 4시
- **기술 세미나**: 매월 마지막 금요일 오후 3시

### 온콜 일정
- 주간 로테이션
- 온콜 엔지니어는 Slack 프로필에 표시
- 긴급 연락처는 팀 Wiki 참조

## 학습 자료

### 추천 도서
- Clean Code - Robert C. Martin
- The Pragmatic Programmer - David Thomas, Andrew Hunt
- Design Patterns - Gang of Four
- Refactoring - Martin Fowler
- Site Reliability Engineering - Google

### 온라인 코스
- [Node.js 심화 과정](https://www.udemy.com/course/nodejs-advanced)
- [Docker & Kubernetes](https://www.coursera.org/learn/docker-kubernetes)
- [시스템 디자인](https://www.educative.io/courses/system-design)
- [PostgreSQL 성능 튜닝](https://www.pluralsight.com/courses/postgresql-performance-tuning)

### 기술 블로그
- [Engineering Blog](https://blog.semicolon.team)
- [Node.js Blog](https://nodejs.org/en/blog)
- [Docker Blog](https://www.docker.com/blog)
- [CNCF Blog](https://www.cncf.io/blog)

## 보안 가이드라인

### 비밀 정보 관리
- 절대 코드에 하드코딩하지 않기
- 환경 변수 또는 시크릿 매니저 사용
- `.env` 파일은 `.gitignore`에 추가
- 정기적으로 키 로테이션

### 의존성 관리
```bash
# 보안 취약점 검사
npm audit
npm audit fix

# 의존성 업데이트
npm outdated
npm update
```

### 코드 보안
- 입력 검증 필수
- SQL 인젝션 방지
- XSS 방지
- CSRF 토큰 사용

## 성능 최적화 팁

### Node.js
- 클러스터 모드 활용
- 캐싱 전략 구현
- 비동기 처리 최적화
- 메모리 누수 모니터링

### 데이터베이스
- 인덱스 최적화
- 쿼리 실행 계획 분석
- 커넥션 풀 관리
- 정기적인 VACUUM

### Docker
- 멀티 스테이지 빌드
- 레이어 캐싱 활용
- 이미지 크기 최소화
- 헬스체크 구현

## 트러블슈팅 체크리스트

### 서비스 장애 대응
1. **영향 범위 파악**
   - 영향받는 서비스 확인
   - 사용자 영향도 평가

2. **즉시 조치**
   - 롤백 가능 여부 확인
   - 임시 조치 적용

3. **근본 원인 분석**
   - 로그 분석
   - 메트릭 확인
   - 최근 변경사항 검토

4. **복구 및 개선**
   - 서비스 복구
   - 포스트모텀 작성
   - 재발 방지 대책 수립

---

<div align="center">
  <strong>도움이 필요하신가요?</strong><br>
  <a href="https://slack.semicolon.team">#help 채널</a>에서 문의하세요!
</div>