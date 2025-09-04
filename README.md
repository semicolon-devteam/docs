# Semicolon DevTeam Documentation Hub

> 팀 내부 개발 문서 및 가이드를 위한 중앙 저장소

## 📚 프로젝트 소개

이 저장소는 Semicolon DevTeam의 모든 기술 문서, 개발 가이드, API 레퍼런스를 관리하는 중앙 문서 허브입니다. GitHub Pages를 통해 팀원들이 쉽게 접근하고 기여할 수 있는 위키 형태로 구성되어 있습니다.

### 🎯 목적

- **지식 공유**: 팀 내 개발 노하우와 베스트 프랙티스 공유
- **온보딩 지원**: 신규 팀원의 빠른 적응 지원
- **표준화**: 일관된 개발 프로세스와 코딩 표준 확립
- **문서화**: 프로젝트와 시스템의 체계적인 문서화

## 🗂️ 문서 구조

### [🚀 시작하기](/docs/getting-started/)
프로젝트 환경 설정, 개발 환경 구축, 첫 기여 가이드

### [🤝 협업 가이드](/docs/collaboration/)
- GitHub Projects 활용법
- 이슈 및 PR 템플릿
- 스프린트 운영
- 코드 리뷰 프로세스


### [💻 개발 가이드](/docs/development/)
- 코딩 표준 및 스타일 가이드
- Git 워크플로우
- 테스트 전략
- CI/CD 파이프라인

### [📡 API 문서](/docs/api/)
- RESTful API 엔드포인트
- 인증 및 권한
- SDK 사용법
- Webhook 통합

### [🚢 배포 가이드](/docs/deployment/)
- Docker & Kubernetes 배포
- 환경별 설정
- 모니터링 및 로깅
- 무중단 배포 전략

### [📦 팀 리소스](/docs/resources/)
- 개발 도구 및 유틸리티
- 팀 컨벤션
- FAQ 및 트러블슈팅
- 학습 자료

## 🌐 접속 방법

### 온라인 문서
- **GitHub Pages**: https://semicolon-devteam.github.io/docs
- **커스텀 도메인**: docs.semicolon.team (설정 시)

### 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/semicolon-devteam/docs.git
cd docs

# 의존성 설치 (Ruby 필요)
bundle install

# 로컬 서버 실행
bundle exec jekyll serve

# 브라우저에서 접속
open http://localhost:4000
```

## 🤝 기여 방법

### 문서 수정/추가
1. 이 저장소를 Fork
2. 새 브랜치 생성 (`git checkout -b docs/your-topic`)
3. 문서 작성 또는 수정
4. 변경사항 커밋 (`git commit -m "docs: Add guide for X"`)
5. Pull Request 생성

### 문서 작성 가이드라인
- **마크다운 형식** 사용
- **명확하고 간결한** 설명
- **실제 코드 예시** 포함
- **한글/영문** 적절히 혼용
- **스크린샷** 필요시 추가

### 문서 템플릿
```markdown
---
layout: page
title: 문서 제목
---

# 문서 제목

## 개요
간단한 소개와 목적

## 내용
상세한 설명과 예시

## 관련 문서
- [관련 문서](./)
```

## 🛠️ 기술 스택

- **정적 사이트 생성기**: Jekyll
- **호스팅**: GitHub Pages
- **테마**: Jekyll Theme Minimal
- **마크다운 프로세서**: Kramdown
- **코드 하이라이팅**: Rouge

## 📊 문서 상태

| 섹션 | 완성도 | 마지막 업데이트 |
|-----|--------|--------------|
| 시작하기 | ✅ 100% | 2024-09-04 |
| 협업 가이드 | ✅ 100% | 2024-09-04 |
| 개발 가이드 | ✅ 100% | 2024-09-04 |
| API 문서 | ✅ 100% | 2024-09-04 |
| 배포 가이드 | ✅ 100% | 2024-09-04 |
| 팀 리소스 | ✅ 100% | 2024-09-04 |

## 💡 유용한 링크

- [Team Slack Channel](https://semicolon-team.slack.com)
- [CI/CD Dashboard](https://ci.semicolon.team)
- [Issue Tracker](https://github.com/semicolon-devteam/docs/issues)

## 📝 라이선스

이 문서는 팀 내부용으로 작성되었으며, Semicolon DevTeam의 소유입니다.

## 📞 문의

- **Slack**: #dev 채널
- **Email**: dev@semicolon.team
- **GitHub Issues**: [문서 개선 제안](https://github.com/semicolon-devteam/docs/issues)

---

<div align="center">
  <strong>Semicolon DevTeam</strong><br>
  Building Better Software Together
</div>