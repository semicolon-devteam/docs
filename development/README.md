---
layout: page
title: 개발 가이드
---

# 개발 가이드

팀의 개발 표준과 베스트 프랙티스를 정의합니다.

## 코딩 표준

### JavaScript/TypeScript

#### 명명 규칙

- **변수/함수**: camelCase
- **클래스/인터페이스**: PascalCase
- **상수**: UPPER_SNAKE_CASE
- **파일명**: kebab-case

```javascript
// Good
const userCount = 10;
function getUserById(id) {}
class UserService {}
const MAX_RETRY_COUNT = 3;

// Bad
const user_count = 10;
function GetUserById(id) {}
class userService {}
```

#### 코드 스타일

```javascript
// 함수 선언
async function processData(input) {
  // 입력 검증
  if (!input) {
    throw new Error('Input is required');
  }
  
  try {
    // 비즈니스 로직
    const result = await transform(input);
    return result;
  } catch (error) {
    logger.error('Processing failed', error);
    throw error;
  }
}

// 클래스 선언
class DataProcessor {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
  }
  
  async process(data) {
    // 구현
  }
}
```

### 주석 작성

```javascript
/**
 * 사용자 정보를 조회합니다.
 * @param {string} userId - 사용자 ID
 * @param {Object} options - 조회 옵션
 * @param {boolean} options.includeProfile - 프로필 포함 여부
 * @returns {Promise<User>} 사용자 객체
 * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
 */
async function getUser(userId, options = {}) {
  // 구현
}
```

## Git 워크플로우

### 브랜치 전략

```
main
├── develop
│   ├── feature/issue-123-user-auth
│   ├── feature/issue-456-api-improvement
│   └── bugfix/issue-789-login-error
└── release/v1.2.0
```

### 브랜치 명명 규칙

- `feature/issue-번호-설명` - 새로운 기능
- `bugfix/issue-번호-설명` - 버그 수정
- `hotfix/issue-번호-설명` - 긴급 수정
- `release/v버전` - 릴리스 준비

### 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 도구 변경

**예시:**
```
feat(auth): JWT 기반 인증 구현

- JWT 토큰 생성 및 검증 로직 추가
- 리프레시 토큰 지원
- 토큰 만료 시간 설정 가능

Closes #123
```

## 테스트 전략

### 테스트 피라미드

```
        /\
       /  \  E2E Tests (10%)
      /────\
     /      \ Integration Tests (30%)
    /────────\
   /          \ Unit Tests (60%)
  /────────────\
```

### 유닛 테스트

```javascript
describe('UserService', () => {
  let userService;
  
  beforeEach(() => {
    userService = new UserService();
  });
  
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      const user = await userService.createUser(userData);
      
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
    });
    
    it('should throw error for invalid email', async () => {
      const userData = { name: 'John', email: 'invalid-email' };
      
      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email format');
    });
  });
});
```

### 통합 테스트

```javascript
describe('API Integration', () => {
  it('POST /api/users should create user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John',
        email: 'john@example.com'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

## CI/CD 파이프라인

### GitHub Actions 워크플로우

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### 배포 파이프라인

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t app:${{ github.ref_name }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push app:${{ github.ref_name }}
      
      - name: Deploy to production
        run: |
          # 배포 스크립트 실행
          ./scripts/deploy.sh production ${{ github.ref_name }}
```

## 코드 리뷰 체크리스트

### 기능적 측면
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스를 처리하는가?
- [ ] 에러 처리가 적절한가?

### 코드 품질
- [ ] 코딩 표준을 따르는가?
- [ ] 중복 코드가 없는가?
- [ ] 함수/클래스가 단일 책임을 가지는가?
- [ ] 네이밍이 명확한가?

### 테스트
- [ ] 테스트 커버리지가 충분한가?
- [ ] 테스트가 의미있는가?
- [ ] 테스트가 독립적인가?

### 성능
- [ ] 불필요한 루프나 연산이 없는가?
- [ ] 메모리 누수 가능성이 없는가?
- [ ] 데이터베이스 쿼리가 최적화되었는가?

### 보안
- [ ] 입력 검증이 적절한가?
- [ ] 민감한 정보가 노출되지 않는가?
- [ ] SQL 인젝션 등의 취약점이 없는가?

## 디버깅 가이드

### 로컬 디버깅

```javascript
// VS Code launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.js",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "*"
      }
    }
  ]
}
```

### 로깅

```javascript
// 로거 설정
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    })
  ]
});

// 사용 예시
logger.info('Application started', { port: 3000 });
logger.error('Database connection failed', { error: err });
```

## 성능 최적화

### 프로파일링

```javascript
// Node.js 프로파일링
const { performance } = require('perf_hooks');

const startTime = performance.now();
// 작업 수행
const endTime = performance.now();
console.log(`Execution time: ${endTime - startTime}ms`);
```

### 메모리 관리

```javascript
// 메모리 사용량 체크
const used = process.memoryUsage();
console.log({
  rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`
});
```

## 도구 및 설정

### ESLint 설정

`.eslintrc.json`:

```json
{
  "extends": ["eslint:recommended", "plugin:node/recommended"],
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

### Prettier 설정

`.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

다음 단계: [API 문서](/docs/api/) →