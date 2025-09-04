---
layout: default
title: 코딩 표준
parent: Development
nav_order: 2
---

# 📝 세미콜론 개발팀 코딩 표준

일관된 코드 품질을 위한 팀 표준 가이드입니다.

## 🏷️ 명명 규칙

### 일반 원칙
- **명확성**: 의미가 명확한 이름 사용
- **일관성**: 프로젝트 전체에서 동일한 패턴 유지
- **검색성**: 쉽게 검색 가능한 이름 사용

### JavaScript/TypeScript
```typescript
// 변수: camelCase
const userName = 'John';
let isActive = true;

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 함수: camelCase (동사로 시작)
function getUserById(id: string) { }
const calculateTotal = (items: Item[]) => { };

// 클래스: PascalCase (명사)
class UserService { }
interface PaymentGateway { }

// 타입: PascalCase
type UserRole = 'admin' | 'user';
interface UserProfile { }

// Enum: PascalCase (값은 UPPER_SNAKE_CASE)
enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}
```

### React 컴포넌트
```typescript
// 컴포넌트: PascalCase
function UserProfile() { }
const NavigationBar: React.FC = () => { };

// Props 타입: ComponentNameProps
interface UserProfileProps { }

// 이벤트 핸들러: handleEventName
const handleClick = () => { };
const handleUserUpdate = () => { };

// 커스텀 훅: use로 시작
function useAuth() { }
const useWindowSize = () => { };
```

### 파일/폴더 명명
```
// React 컴포넌트: PascalCase
UserProfile.tsx
NavigationBar.tsx

// 일반 파일: kebab-case
user-service.ts
api-config.ts
auth-utils.ts

// 테스트 파일
user-service.test.ts
UserProfile.test.tsx

// 폴더: kebab-case
/components
/hooks
/utils
/services
```

## 🎨 코드 포맷팅

### Prettier 설정
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### ESLint 주요 규칙
```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🗂️ 프로젝트 구조

### 표준 폴더 구조
```
src/
├── components/       # 재사용 가능한 컴포넌트
│   ├── common/      # 공통 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트
│   └── features/    # 기능별 컴포넌트
├── pages/           # 페이지 컴포넌트
├── hooks/           # 커스텀 훅
├── services/        # API 및 비즈니스 로직
├── utils/           # 유틸리티 함수
├── types/           # TypeScript 타입 정의
├── constants/       # 상수 정의
├── styles/          # 글로벌 스타일
└── tests/           # 테스트 파일
```

### 컴포넌트 파일 구조
```
UserProfile/
├── index.tsx        # 메인 컴포넌트
├── UserProfile.tsx  # 컴포넌트 구현
├── UserProfile.styles.ts  # 스타일
├── UserProfile.types.ts   # 타입 정의
├── UserProfile.test.tsx   # 테스트
└── components/      # 서브 컴포넌트
```

## 🔌 API 설계 표준

### RESTful API 규칙
```
# 리소스는 복수형 명사 사용
GET    /users         # 사용자 목록
GET    /users/:id     # 특정 사용자
POST   /users         # 사용자 생성
PUT    /users/:id     # 사용자 전체 수정
PATCH  /users/:id     # 사용자 부분 수정
DELETE /users/:id     # 사용자 삭제

# 중첩 리소스
GET    /users/:id/posts       # 사용자의 게시물
POST   /users/:id/posts       # 사용자의 게시물 생성

# 필터링, 정렬, 페이지네이션
GET    /users?status=active&sort=name&page=2&limit=20
```

### 응답 형식
```json
// 성공 응답
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "timestamp": "2025-09-04T10:00:00Z"
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다",
    "details": {}
  }
}

// 페이지네이션 응답
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### HTTP 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `204 No Content`: 성공 (응답 본문 없음)
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 충돌
- `422 Unprocessable Entity`: 유효성 검사 실패
- `500 Internal Server Error`: 서버 오류

## 🌍 환경 변수

### 명명 규칙
```bash
# 앱 설정
APP_ENV=production
APP_PORT=3000
APP_VERSION=1.0.0

# 데이터베이스
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD=secret

# 외부 서비스
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
SLACK_WEBHOOK_URL=xxx

# 기능 플래그
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
```

### 환경별 구성
```
.env                # 기본값
.env.local          # 로컬 개발 (Git 제외)
.env.development    # 개발 환경
.env.staging        # 스테이징 환경
.env.production     # 프로덕션 환경
```

## 📝 주석 작성

### 주석 원칙
```typescript
// ❌ 나쁜 예: 코드가 하는 일을 반복
// 사용자 ID를 가져온다
const userId = getUserId();

// ✅ 좋은 예: 왜 그렇게 하는지 설명
// 레거시 시스템과의 호환성을 위해 문자열로 변환
const userId = String(getUserId());

// ✅ 좋은 예: 복잡한 비즈니스 로직 설명
// 할인율 계산: 기본 10% + VIP 추가 5% + 시즌 할인 10%
// 최대 할인율은 30%로 제한
const discount = Math.min(0.3, baseDiscount + vipBonus + seasonalDiscount);
```

### JSDoc 사용
```typescript
/**
 * 사용자 정보를 조회합니다.
 * @param {string} userId - 사용자 ID
 * @returns {Promise<User>} 사용자 정보
 * @throws {NotFoundError} 사용자를 찾을 수 없는 경우
 * @example
 * const user = await getUserById('123');
 */
async function getUserById(userId: string): Promise<User> {
  // ...
}
```

## 🧪 테스트 표준

### 테스트 파일 구조
```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when valid ID is provided', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: '123', name: 'John' };
      
      // Act
      const result = await userService.getUserById(userId);
      
      // Assert
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // ...
    });
  });
});
```

### 테스트 명명
```typescript
// ✅ 좋은 예: 명확한 시나리오 설명
it('should return 401 when authentication token is missing')
it('should calculate discount correctly for VIP customers')

// ❌ 나쁜 예: 모호한 설명
it('should work')
it('test user creation')
```

## 🔒 보안 가이드

### 기본 원칙
1. **최소 권한 원칙**: 필요한 최소한의 권한만 부여
2. **입력 검증**: 모든 사용자 입력 검증
3. **암호화**: 민감한 데이터는 항상 암호화
4. **감사 로깅**: 중요한 작업은 로그 기록

### 보안 체크리스트
- [ ] SQL Injection 방지 (Prepared Statements 사용)
- [ ] XSS 방지 (입력 값 이스케이프)
- [ ] CSRF 토큰 사용
- [ ] HTTPS 사용
- [ ] 민감한 정보 로깅 금지
- [ ] 의존성 정기 업데이트

## 📚 참고 자료

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Documentation](https://react.dev)
- [OWASP Security Guidelines](https://owasp.org)

---

> 📅 최종 업데이트: 2025-09-04
> 
> 💡 문의: DevOps 팀