---
layout: page
title: API 설계 가이드
permalink: /development/api-design/
---

# API 설계 가이드

## 개요
세미콜론 개발팀의 RESTful API 설계 원칙과 베스트 프랙티스를 정의합니다.

## RESTful API 설계 원칙

### 1. URL 규칙
- 명사를 사용하여 리소스를 표현
- 복수형 사용 (예: `/users`, `/posts`)
- 계층 구조 표현 (예: `/users/{id}/posts`)
- 소문자와 하이픈 사용 (예: `/user-profiles`)

### 2. HTTP 메서드 사용
```
GET    /users       # 사용자 목록 조회
GET    /users/{id}  # 특정 사용자 조회
POST   /users       # 새 사용자 생성
PUT    /users/{id}  # 사용자 정보 전체 수정
PATCH  /users/{id}  # 사용자 정보 부분 수정
DELETE /users/{id}  # 사용자 삭제
```

### 3. 상태 코드
- **2xx 성공**
  - `200 OK`: 요청 성공
  - `201 Created`: 리소스 생성 성공
  - `204 No Content`: 성공했으나 응답 본문 없음

- **4xx 클라이언트 오류**
  - `400 Bad Request`: 잘못된 요청
  - `401 Unauthorized`: 인증 필요
  - `403 Forbidden`: 권한 없음
  - `404 Not Found`: 리소스 없음

- **5xx 서버 오류**
  - `500 Internal Server Error`: 서버 오류
  - `503 Service Unavailable`: 서비스 일시 중단

## 요청/응답 형식

### 요청 헤더
```http
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {unique-id}
```

### 응답 형식
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  },
  "meta": {
    "timestamp": "2025-09-04T10:00:00Z",
    "version": "1.0"
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "사용자를 찾을 수 없습니다",
    "details": {
      "userId": 123
    }
  }
}
```

## 페이지네이션

### 쿼리 파라미터
```
GET /users?page=1&limit=20&sort=created_at:desc
```

### 응답 메타데이터
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 필터링 및 검색

### 필터링
```
GET /users?status=active&role=admin
GET /posts?created_after=2025-01-01&category=tech
```

### 검색
```
GET /users/search?q=홍길동
GET /posts?search=javascript&fields=title,content
```

## 버전 관리

### URL 버전 관리
```
https://api.semicolon.team/v1/users
https://api.semicolon.team/v2/users
```

### 헤더 버전 관리
```http
Accept: application/vnd.semicolon.v1+json
```

## 보안 고려사항

### 인증 및 권한
- JWT 토큰 사용
- OAuth 2.0 지원
- API 키 관리

### 요청 제한
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

### CORS 설정
```javascript
// Express 예시
app.use(cors({
  origin: ['https://semicolon.team'],
  credentials: true
}));
```

## API 문서화

### OpenAPI (Swagger) 사용
```yaml
openapi: 3.0.0
info:
  title: Semicolon API
  version: 1.0.0
paths:
  /users:
    get:
      summary: 사용자 목록 조회
      responses:
        200:
          description: 성공
```

### 문서 포함 사항
- 엔드포인트 설명
- 요청/응답 예시
- 에러 코드 목록
- 인증 방법

## 테스트

### 단위 테스트
```javascript
describe('GET /users', () => {
  it('should return users list', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### 통합 테스트
- Postman 컬렉션 사용
- CI/CD 파이프라인 통합
- 자동화된 API 테스트

## 모니터링

### 로깅
```javascript
logger.info({
  method: req.method,
  url: req.url,
  statusCode: res.statusCode,
  responseTime: Date.now() - startTime
});
```

### 메트릭 수집
- 응답 시간
- 에러율
- 처리량
- 가용성

## 체크리스트

- [ ] RESTful 원칙 준수
- [ ] 적절한 HTTP 메서드 사용
- [ ] 명확한 URL 구조
- [ ] 일관된 응답 형식
- [ ] 에러 처리 구현
- [ ] 페이지네이션 지원
- [ ] 인증/권한 구현
- [ ] API 문서 작성
- [ ] 테스트 작성
- [ ] 모니터링 설정

## 참고 자료
- [REST API 설계 모범 사례](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)