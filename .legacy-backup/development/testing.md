---
layout: page
title: 테스트 전략
permalink: /development/testing/
---

# 테스트 전략

## 개요
세미콜론 개발팀의 테스트 전략과 베스트 프랙티스를 정의합니다.

## 테스트 피라미드

```
       /\
      /E2E\      <- 적음 (10%)
     /______\
    /통합 테스트\   <- 보통 (30%)
   /____________\
  /  단위 테스트   \  <- 많음 (60%)
 /________________\
```

## 단위 테스트

### 원칙
- 각 함수/메서드를 독립적으로 테스트
- 빠르고 신뢰할 수 있는 테스트
- 외부 의존성 모킹

### Jest 예시
```javascript
// user.service.test.js
describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn()
    };
    userService = new UserService(mockUserRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: '홍길동' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById(1);

      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById(1))
        .rejects.toThrow('User not found');
    });
  });
});
```

### 커버리지 목표
- 전체: 80% 이상
- 핵심 비즈니스 로직: 90% 이상
- 유틸리티 함수: 100%

## 통합 테스트

### 대상
- API 엔드포인트
- 데이터베이스 연동
- 외부 서비스 통합

### Supertest 예시
```javascript
// user.controller.test.js
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  describe('GET /users/:id', () => {
    it('should return user data', async () => {
      const response = await request(app)
        .get('/users/1')
        .set('Authorization', 'Bearer test-token')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/999999')
        .set('Authorization', 'Bearer test-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('POST /users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: '김철수',
        email: 'kim@example.com',
        password: 'secure123'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(newUser.email);
    });
  });
});
```

## E2E 테스트

### Playwright 예시
```javascript
// e2e/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {
  test('successful login', async ({ page }) => {
    await page.goto('https://app.semicolon.team');
    
    // 로그인 폼 입력
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // 로그인 버튼 클릭
    await page.click('[data-testid="login-button"]');
    
    // 대시보드로 리다이렉트 확인
    await expect(page).toHaveURL('https://app.semicolon.team/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('환영합니다');
  });

  test('invalid credentials', async ({ page }) => {
    await page.goto('https://app.semicolon.team');
    
    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('[data-testid="login-button"]');
    
    // 에러 메시지 확인
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('이메일 또는 비밀번호가 올바르지 않습니다');
  });
});
```

## 테스트 데이터 관리

### Fixtures
```javascript
// fixtures/users.js
module.exports = {
  validUser: {
    id: 1,
    name: '테스트 사용자',
    email: 'test@example.com',
    role: 'user'
  },
  adminUser: {
    id: 2,
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin'
  }
};
```

### Factory 패턴
```javascript
// factories/user.factory.js
const faker = require('faker');

class UserFactory {
  static create(overrides = {}) {
    return {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      createdAt: new Date(),
      ...overrides
    };
  }

  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, () => 
      this.create(overrides)
    );
  }
}
```

## 모킹 전략

### 외부 서비스 모킹
```javascript
// mocks/email.service.mock.js
jest.mock('../services/email.service', () => ({
  sendEmail: jest.fn().mockResolvedValue({ 
    success: true, 
    messageId: 'mock-id' 
  })
}));
```

### 데이터베이스 모킹
```javascript
// 테스트 데이터베이스 사용
beforeEach(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterEach(async () => {
  await db.rollback();
});
```

## 테스트 실행

### 스크립트 설정
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.js'",
    "test:e2e": "playwright test",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### CI/CD 통합
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v2
```

## 테스트 모범 사례

### AAA 패턴
```javascript
it('should calculate total price', () => {
  // Arrange (준비)
  const items = [
    { price: 1000, quantity: 2 },
    { price: 500, quantity: 3 }
  ];

  // Act (실행)
  const total = calculateTotal(items);

  // Assert (검증)
  expect(total).toBe(3500);
});
```

### 명확한 테스트 이름
```javascript
// 좋음
it('should return 404 when user does not exist')

// 나쁨
it('test user')
```

### 독립적인 테스트
- 테스트 간 의존성 없음
- 실행 순서 무관
- 격리된 환경

## 성능 테스트

### k6 예시
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const response = http.get('https://api.semicolon.team/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## 테스트 리포트

### 커버리지 리포트
```bash
# HTML 리포트 생성
npm run test:coverage -- --coverageReporters=html

# 커버리지 임계값 설정
jest --coverage --coverageThreshold='{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}'
```

### 테스트 결과 시각화
- Jest HTML Reporter
- Allure Report
- ReportPortal

## 체크리스트

- [ ] 단위 테스트 작성 (커버리지 80% 이상)
- [ ] 통합 테스트 작성
- [ ] E2E 시나리오 테스트
- [ ] 테스트 데이터 준비
- [ ] 모킹 전략 수립
- [ ] CI/CD 파이프라인 통합
- [ ] 성능 테스트 실행
- [ ] 테스트 리포트 생성
- [ ] 테스트 문서화

## 도구 및 라이브러리

- **단위 테스트**: Jest, Mocha, Chai
- **통합 테스트**: Supertest, Nock
- **E2E 테스트**: Playwright, Cypress, Selenium
- **성능 테스트**: k6, JMeter, Artillery
- **모킹**: Sinon, MSW (Mock Service Worker)
- **커버리지**: Istanbul, nyc