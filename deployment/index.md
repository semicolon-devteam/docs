# GitHub Pages 배포 가이드

## 배포 준비

### 1. 로컬 테스트 (선택사항)

Jekyll을 로컬에서 테스트하려면:

```bash
# Ruby와 Bundler 설치 확인
ruby --version
gem install bundler

# 의존성 설치
bundle install

# 로컬 서버 실행
bundle exec jekyll serve

# 브라우저에서 확인
# http://localhost:4000
```

### 2. GitHub 리포지토리 설정

현재 리포지토리가 `https://github.com/semicolon-devteam/docs`로 설정되어 있습니다.

## GitHub Pages 배포

### 방법 1: GitHub UI를 통한 배포

1. **리포지토리 Settings 접속**
   - GitHub에서 리포지토리로 이동
   - Settings 탭 클릭

2. **Pages 설정**
   - 왼쪽 사이드바에서 "Pages" 클릭
   - Source: "Deploy from a branch" 선택
   - Branch: `main` (또는 원하는 브랜치) 선택
   - Folder: `/ (root)` 선택
   - Save 클릭

3. **배포 확인**
   - 몇 분 후 `https://semicolon-devteam.github.io/docs` 에서 확인
   - 또는 커스텀 도메인 설정 가능

### 방법 2: GitHub Actions를 통한 자동 배포

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
      
      - name: Build Jekyll
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: production
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 3. 커스텀 도메인 설정 (선택사항)

1. **CNAME 파일 생성**
   ```bash
   echo "docs.semicolon.team" > CNAME
   ```

2. **DNS 설정**
   - A 레코드 추가:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - 또는 CNAME 레코드:
     ```
     semicolon-devteam.github.io
     ```

3. **GitHub Pages에서 커스텀 도메인 설정**
   - Settings → Pages → Custom domain
   - 도메인 입력 후 Save
   - HTTPS 강제 적용 체크

## 배포 후 확인사항

### 배포 상태 확인
- Repository → Actions 탭에서 배포 워크플로우 상태 확인
- Settings → Pages에서 배포 URL 확인

### 일반적인 문제 해결

#### 1. 404 에러
- `_config.yml`의 `baseurl` 설정 확인
- 파일 경로와 링크 확인
- Jekyll 빌드 로그 확인

#### 2. 스타일이 적용되지 않음
- HTTPS/HTTP 혼합 콘텐츠 문제 확인
- 상대 경로 사용 권장
- 브라우저 캐시 클리어

#### 3. 업데이트가 반영되지 않음
- GitHub Pages 캐시 (최대 10분)
- 브라우저 캐시 클리어 (Ctrl+Shift+R)
- GitHub Actions 로그 확인

## 유지보수

### 콘텐츠 업데이트
1. 마크다운 파일 수정
2. 변경사항 커밋 및 푸시
3. 자동 배포 완료 대기 (약 2-5분)

### 테마 변경
`_config.yml`에서 테마 변경:
```yaml
theme: jekyll-theme-cayman  # 다른 테마로 변경
```

지원되는 테마:
- jekyll-theme-minimal (현재)
- jekyll-theme-cayman
- jekyll-theme-architect
- jekyll-theme-slate
- jekyll-theme-midnight

### 플러그인 추가
GitHub Pages에서 지원하는 플러그인만 사용 가능:
https://pages.github.com/versions/

## 명령어 요약

```bash
# 변경사항 커밋 및 푸시 (자동 배포)
git add .
git commit -m "Update documentation"
git push origin main

# 로컬 테스트
bundle exec jekyll serve --watch

# 빌드만 실행
bundle exec jekyll build

# 캐시 클리어 후 빌드
bundle exec jekyll clean
bundle exec jekyll build
```

## 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/pages)
- [Jekyll 공식 문서](https://jekyllrb.com/docs/)
- [GitHub Pages 지원 테마](https://pages.github.com/themes/)
- [Jekyll 플러그인 목록](https://jekyllrb.com/docs/plugins/)

---

배포 완료 후 `https://semicolon-devteam.github.io/docs` 또는 설정한 커스텀 도메인에서 문서를 확인할 수 있습니다.