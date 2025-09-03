---
layout: page
title: API 문서
---

# API 문서

## 개요

Semicolon Command Center API는 RESTful 원칙을 따르며, JSON 형식의 요청과 응답을 사용합니다.

## 기본 정보

### Base URL
```
Production: https://api.semicolon.team/v1
Development: http://localhost:3000/api/v1
```

### 인증

모든 API 요청에는 인증 토큰이 필요합니다:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### 요청 헤더

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer YOUR_API_TOKEN
```

## 엔드포인트

### 명령어 실행

#### POST /commands/execute

명령어를 실행합니다.

**요청:**
```json
{
  "command": "deploy",
  "args": {
    "service": "api-server",
    "environment": "production"
  },
  "options": {
    "force": false,
    "dryRun": true
  }
}
```

**응답:**
```json
{
  "id": "cmd_1234567890",
  "status": "success",
  "result": {
    "message": "Deployment initiated",
    "deploymentId": "dep_987654321"
  },
  "executionTime": 1234,
  "timestamp": "2024-09-04T10:00:00Z"
}
```

#### GET /commands/status/:id

명령어 실행 상태를 조회합니다.

**응답:**
```json
{
  "id": "cmd_1234567890",
  "status": "running",
  "progress": 65,
  "logs": [
    {
      "timestamp": "2024-09-04T10:00:01Z",
      "level": "info",
      "message": "Starting deployment"
    }
  ]
}
```

### 플러그인 관리

#### GET /plugins

설치된 플러그인 목록을 조회합니다.

**응답:**
```json
{
  "plugins": [
    {
      "name": "deploy-plugin",
      "version": "2.1.0",
      "enabled": true,
      "description": "Deployment automation plugin"
    },
    {
      "name": "monitoring-plugin",
      "version": "1.5.3",
      "enabled": true,
      "description": "System monitoring plugin"
    }
  ],
  "total": 2
}
```

#### POST /plugins/install

새 플러그인을 설치합니다.

**요청:**
```json
{
  "name": "new-plugin",
  "version": "1.0.0",
  "source": "npm"
}
```

#### PUT /plugins/:name/config

플러그인 설정을 업데이트합니다.

**요청:**
```json
{
  "config": {
    "apiUrl": "https://external-api.com",
    "timeout": 5000,
    "retries": 3
  }
}
```

### 사용자 관리

#### GET /users/profile

현재 사용자 프로필을 조회합니다.

**응답:**
```json
{
  "id": "user_123",
  "username": "john.doe",
  "email": "john@semicolon.team",
  "role": "developer",
  "permissions": [
    "commands.execute",
    "plugins.manage",
    "config.read"
  ]
}
```

#### POST /users/api-keys

새 API 키를 생성합니다.

**요청:**
```json
{
  "name": "CI/CD Pipeline",
  "permissions": ["commands.execute"],
  "expiresIn": "30d"
}
```

**응답:**
```json
{
  "id": "key_abc123",
  "key": "sk_live_xxxxxxxxxxxxx",
  "name": "CI/CD Pipeline",
  "createdAt": "2024-09-04T10:00:00Z",
  "expiresAt": "2024-10-04T10:00:00Z"
}
```

### 시스템 정보

#### GET /system/health

시스템 상태를 확인합니다.

**응답:**
```json
{
  "status": "healthy",
  "version": "3.2.1",
  "uptime": 864000,
  "checks": {
    "database": "ok",
    "redis": "ok",
    "disk": "ok",
    "memory": "ok"
  }
}
```

#### GET /system/metrics

시스템 메트릭을 조회합니다.

**응답:**
```json
{
  "commands": {
    "total": 15234,
    "successful": 14890,
    "failed": 344,
    "averageExecutionTime": 234
  },
  "resources": {
    "cpuUsage": 23.5,
    "memoryUsage": 45.2,
    "diskUsage": 67.8
  },
  "timestamp": "2024-09-04T10:00:00Z"
}
```

## 에러 처리

### 에러 응답 형식

```json
{
  "error": {
    "code": "COMMAND_NOT_FOUND",
    "message": "The specified command does not exist",
    "details": {
      "command": "unknown-command",
      "availableCommands": ["deploy", "build", "test"]
    }
  }
}
```

### 에러 코드

| 코드 | HTTP 상태 | 설명 |
|-----|-----------|------|
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `FORBIDDEN` | 403 | 권한 부족 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 입력 검증 실패 |
| `COMMAND_NOT_FOUND` | 404 | 명령어가 존재하지 않음 |
| `PLUGIN_ERROR` | 500 | 플러그인 실행 오류 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 제한 초과 |
| `INTERNAL_ERROR` | 500 | 내부 서버 오류 |

## Rate Limiting

API는 다음과 같은 요청 제한이 있습니다:

- **인증된 요청**: 시간당 1000개 요청
- **인증되지 않은 요청**: 시간당 60개 요청

Rate limit 정보는 응답 헤더에 포함됩니다:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1693825200
```

## 페이지네이션

목록 API는 페이지네이션을 지원합니다:

```http
GET /api/v1/commands/history?page=2&limit=20
```

**응답:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Webhooks

### Webhook 등록

```json
POST /webhooks
{
  "url": "https://your-server.com/webhook",
  "events": ["command.completed", "plugin.installed"],
  "secret": "your-webhook-secret"
}
```

### Webhook 페이로드

```json
{
  "event": "command.completed",
  "timestamp": "2024-09-04T10:00:00Z",
  "data": {
    "commandId": "cmd_123",
    "command": "deploy",
    "status": "success"
  },
  "signature": "sha256=xxxxx"
}
```

## SDK 및 클라이언트

### JavaScript/TypeScript

```javascript
const { CommandCenter } = require('@semicolon/command-center-sdk');

const client = new CommandCenter({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.semicolon.team/v1'
});

// 명령어 실행
const result = await client.commands.execute('deploy', {
  service: 'api-server',
  environment: 'production'
});

// 플러그인 설치
await client.plugins.install('monitoring-plugin', '1.5.3');
```

### Python

```python
from semicolon_sdk import CommandCenter

client = CommandCenter(
    api_key='YOUR_API_KEY',
    base_url='https://api.semicolon.team/v1'
)

# 명령어 실행
result = client.commands.execute('deploy', {
    'service': 'api-server',
    'environment': 'production'
})

# 상태 확인
status = client.commands.get_status(result['id'])
```

### CLI

```bash
# 설치
npm install -g @semicolon/command-center-cli

# 설정
semicolon config set apiKey YOUR_API_KEY

# 명령어 실행
semicolon execute deploy --service api-server --environment production

# 플러그인 관리
semicolon plugin list
semicolon plugin install monitoring-plugin@1.5.3
```

## 변경 로그

### v1.2.0 (2024-09-01)
- Webhook 지원 추가
- Rate limiting 개선
- 새로운 메트릭 엔드포인트

### v1.1.0 (2024-08-01)
- 플러그인 시스템 도입
- 배치 명령어 실행 지원
- 성능 개선

### v1.0.0 (2024-07-01)
- 초기 릴리스

---

다음 단계: [배포 가이드](../deployment/README.md) →