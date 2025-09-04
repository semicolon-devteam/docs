---
layout: page
title: 개발 환경 설정
permalink: /development/setup/
---

# 개발 환경 설정

## 개요
세미콜론 개발팀의 표준 개발 환경 설정 가이드입니다.

## 필수 도구 설치

### 1. Node.js & npm
```bash
# Node.js 18.x LTS 설치 (nvm 사용 권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 버전 확인
node --version  # v18.x.x
npm --version   # 9.x.x
```

### 2. Git
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@semicolon.team"
```

### 3. Docker
```bash
# Docker Desktop 설치
# https://www.docker.com/products/docker-desktop

# 설치 확인
docker --version
docker-compose --version
```

### 4. PostgreSQL
```bash
# Docker로 실행 (권장)
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=semicolon_dev \
  -p 5432:5432 \
  postgres:14

# 또는 로컬 설치
brew install postgresql@14  # macOS
```

## IDE 설정

### Visual Studio Code

#### 필수 확장 프로그램
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vscode.vscode-typescript-tslint-plugin",
    "wayou.vscode-todo-highlight",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens",
    "humao.rest-client",
    "prisma.prisma"
  ]
}
```

#### 설정 파일 (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.rulers": [80, 120],
  "files.exclude": {
    "**/node_modules": true,
    "**/.git": true,
    "**/dist": true,
    "**/coverage": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always"
}
```

## 프로젝트 초기 설정

### 1. 저장소 클론
```bash
# 프로젝트 클론
git clone https://github.com/semicolon-devteam/[project-name].git
cd [project-name]

# 브랜치 확인
git branch -a
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 필수 환경 변수
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/semicolon_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
AWS_REGION=ap-northeast-2
```

### 3. 의존성 설치
```bash
# npm 사용
npm ci  # package-lock.json 기반 정확한 버전 설치

# 또는 yarn 사용
yarn install --frozen-lockfile
```

### 4. 데이터베이스 설정
```bash
# Prisma 마이그레이션
npx prisma migrate dev

# 시드 데이터 생성
npm run db:seed

# 또는 TypeORM
npm run migration:run
```

## 개발 서버 실행

### 기본 실행
```bash
# 개발 모드
npm run dev

# 디버그 모드
npm run dev:debug

# 와치 모드
npm run dev:watch
```

### Docker Compose 사용
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: semicolon_dev
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```bash
# 실행
docker-compose -f docker-compose.dev.yml up
```

## 린트 및 포맷팅

### ESLint 설정
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
```

### Prettier 설정
```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 실행 명령어
```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 포맷팅
npm run format
```

## 디버깅

### Node.js 디버깅 설정
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js",
      "runtimeArgs": ["--inspect"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229,
      "restart": true
    }
  ]
}
```

### Chrome DevTools 사용
```bash
# 디버그 모드로 실행
node --inspect src/index.js

# Chrome에서 접속
chrome://inspect
```

## 테스트 환경

### Jest 설정
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

### 테스트 실행
```bash
# 전체 테스트
npm test

# 와치 모드
npm run test:watch

# 커버리지
npm run test:coverage
```

## 유용한 스크립트

### package.json scripts
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.js",
    "lint:fix": "eslint . --ext .ts,.js --fix",
    "format": "prettier --write \"src/**/*.{js,ts,json}\"",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts",
    "clean": "rm -rf dist coverage node_modules"
  }
}
```

## 트러블슈팅

### 일반적인 문제 해결

#### npm 패키지 충돌
```bash
# 캐시 클리어
npm cache clean --force

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 포트 사용 중
```bash
# 사용 중인 포트 확인
lsof -i :3000

# 프로세스 종료
kill -9 [PID]
```

#### 데이터베이스 연결 실패
```bash
# PostgreSQL 상태 확인
pg_isready -h localhost -p 5432

# Docker 컨테이너 확인
docker ps
docker logs postgres
```

## 성능 최적화

### 개발 환경 최적화
```bash
# Node.js 메모리 증가
export NODE_OPTIONS="--max-old-space-size=4096"

# nodemon 설정
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["**/*.test.ts", "**/*.spec.ts"],
  "exec": "ts-node",
  "env": {
    "NODE_ENV": "development"
  }
}
```

## 체크리스트

### 초기 설정
- [ ] Node.js 18.x 설치
- [ ] Git 설정 완료
- [ ] Docker 설치 및 실행
- [ ] PostgreSQL 설정
- [ ] VS Code 확장 프로그램 설치

### 프로젝트 설정
- [ ] 저장소 클론
- [ ] 환경 변수 설정
- [ ] 의존성 설치
- [ ] 데이터베이스 마이그레이션
- [ ] 개발 서버 실행 확인

### 개발 준비
- [ ] 린트 설정 확인
- [ ] 테스트 실행 확인
- [ ] 디버깅 환경 설정
- [ ] Git hooks 설정

## 참고 자료
- [Node.js 공식 문서](https://nodejs.org/docs)
- [Docker 문서](https://docs.docker.com)
- [VS Code 문서](https://code.visualstudio.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs)