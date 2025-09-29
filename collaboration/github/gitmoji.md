---
layout: page
title: Gitmoji 커밋 컨벤션
parent: GitHub
grand_parent: Collaboration
---

# 🎯 Gitmoji 커밋 컨벤션

> 심플하고 명확한 팀 협업을 위한 Gitmoji 규칙

## 📝 커밋 메시지 형식

```
<emoji> [#issue-number]: <description> 

<body>
```

### 예시
```
✨ #123 사용자 로그인 기능 추가 #123

- 구글, 카카오 소셜 로그인 기능 연동
- UI 개선
```

## 🎨 핵심 Gitmoji (필수 11개)

| 이모지 | 코드 | 사용 시점 | 예시 |
|--------|------|-----------|------|
| ✨ | `:sparkles:` | 새 기능 추가 | ✨ 소셜 로그인 추가 |
| 🔨 | `:hammer:` | 기능 개선/수정 | 🔨 검색 성능 최적화 |
| 🐛 | `:bug:` | 버그 수정 | 🐛 무한 로딩 문제 해결 |
| 💄 | `:lipstick:` | UI/스타일 변경 | 💄 버튼 디자인 개선 |
| ♻️ | `:recycle:` | 코드 리팩토링 | ♻️ 인증 로직 개선 |
| 📝 | `:memo:` | 문서 수정/추가 | 📝 API 문서 업데이트 |
| ✅ | `:white_check_mark:` | 테스트 추가/수정 | ✅ 로그인 유닛 테스트 추가 |
| 🔧 | `:wrench:` | 설정/빌드 변경 | 🔧 ESLint 규칙 추가 |
| 🚀 | `:rocket:` | 배포 관련 | 🚀 프로덕션 v1.2.0 배포 |
| 🔥 | `:fire:` | 코드/파일 삭제 | 🔥 사용하지 않는 컴포넌트 삭제 |
| 🚨 | `:rotating_light:` | 긴급 수정 | 🚨 결제 오류 긴급 수정 |

## 📋 추가 Gitmoji (선택)

| 이모지 | 코드 | 사용 시점 |
|--------|------|-----------|
| 🎉 | `:tada:` | 프로젝트 시작 |
| 🔀 | `:twisted_rightwards_arrows:` | 브랜치 머지 |
| ⏪ | `:rewind:` | 되돌리기 (revert) |
| 🏷️ | `:label:` | 타입 정의 추가/수정 |
| 🔐 | `:lock:` | 보안 이슈 수정 |
| 💚 | `:green_heart:` | CI 빌드 수정 |
| ⬆️ | `:arrow_up:` | 의존성 업그레이드 |
| ⬇️ | `:arrow_down:` | 의존성 다운그레이드 |
| 📱 | `:iphone:` | 반응형 디자인 작업 |
| ♿ | `:wheelchair:` | 접근성 개선 |

## ✅ 커밋 규칙

### 필수 규칙
1. **한글 사용**: 커밋 메시지는 한글로 작성
2. **현재 시제**: "추가한다" 대신 "추가"
3. **간결함**: 50자 이내로 작성
4. **이슈 번호**: 관련 이슈가 있으면 반드시 연결

### 금지 사항
- ❌ 여러 이모지 동시 사용 금지
- ❌ 관련 없는 변경사항 한 커밋에 포함 금지
- ❌ WIP, TODO 같은 불완전한 커밋 금지

## 🔄 Git Flow

```
main
  └── dev
       └── 123-login
       └── 124-button-error
       └── 125-payment
```

### 브랜치 네이밍
- `이슈번호-설명`
## 💡 팀 협업 팁

### 좋은 예시 ✅
```
✨ #123 카카오 로그인 연동 기능 추가

- 카카오 OAuth 2.0 API 연동
- 사용자 프로필 정보 자동 입력
- 기존 회원 연동 처리

🐛 #124 iOS Safari에서 버튼 클릭 안되는 문제 수정

- touch 이벤트 핸들러 추가
- webkit appearance 스타일 수정

🔨 #125 검색 성능 최적화

- 디바운스 적용으로 API 호출 최소화
- 검색 결과 캐싱 구현
- 무한 스크롤 페이지네이션 개선
```

### 나쁜 예시 ❌
```
update files          // 이모지 없음, 불명확
✨🐛 수정             // 여러 이모지, 설명 부족
✨ 여러 기능 추가 및 버그 수정  // 한 커밋에 여러 작업
```

## 🛠️ 설정 방법

### 1. Git 별칭 설정 (선택사항)
```bash
git config --global alias.cf "commit -m '✨ feat:'"
git config --global alias.cx "commit -m '🐛 fix:'"
git config --global alias.cr "commit -m '♻️ refactor:'"
```

### 2. 커밋 템플릿 설정
```bash
git config --local commit.template .gitmessage
```

### 3. VS Code/Cursor 확장 설치
- **Gitmoji** 확장 프로그램 설치
- 커밋 메시지 작성 시 이모지 자동 완성 지원

## 📊 통계 활용

월별 커밋 타입 분석:
```bash
git log --oneline --since="1 month ago" | grep -E "^[a-f0-9]+ (✨|🐛|💄|♻️|📝|✅|🔧|🚀|🔥|🚨)" | cut -d' ' -f2 | sort | uniq -c
```

---

**마지막 업데이트**: 2025-09-27
**버전**: v1.0.0