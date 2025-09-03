---
layout: page
title: Command Center
---

# Command Center 문서

Command Center는 팀의 핵심 명령 처리 시스템입니다.

## 개요

Command Center는 다양한 명령어를 처리하고 플러그인 시스템을 통해 확장 가능한 아키텍처를 제공합니다.

## 아키텍처

### 핵심 구성요소

```
┌──────────────────────────────────────┐
│          Command Center              │
├──────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐ │
│  │ Parser   │→ │ Command Handler   │ │
│  └──────────┘  └──────────────────┘ │
│       ↓               ↓              │
│  ┌──────────┐  ┌──────────────────┐ │
│  │Validator │  │ Plugin System     │ │
│  └──────────┘  └──────────────────┘ │
│       ↓               ↓              │
│  ┌────────────────────────────────┐ │
│  │        Execution Engine         │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 주요 모듈

#### 1. Parser
명령어를 파싱하고 구조화된 형태로 변환합니다.

#### 2. Command Handler
파싱된 명령어를 적절한 핸들러로 라우팅합니다.

#### 3. Plugin System
확장 가능한 플러그인 아키텍처를 제공합니다.

#### 4. Execution Engine
명령어를 실행하고 결과를 반환합니다.

## 명령어 사용법

### 기본 명령어

```bash
# 도움말
command-center help

# 버전 확인
command-center version

# 상태 확인
command-center status
```

### 고급 명령어

```bash
# 플러그인 설치
command-center plugin install [plugin-name]

# 플러그인 목록
command-center plugin list

# 설정 변경
command-center config set [key] [value]

# 로그 확인
command-center logs --tail 100
```

## 플러그인 개발

### 플러그인 구조

```javascript
// plugins/my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  description: '플러그인 설명',
  
  commands: {
    'my-command': {
      description: '명령어 설명',
      handler: async (args, options) => {
        // 명령어 로직
        return { success: true, result: 'Result' };
      }
    }
  },
  
  hooks: {
    beforeExecute: async (command, args) => {
      // 실행 전 훅
    },
    afterExecute: async (result) => {
      // 실행 후 훅
    }
  }
};
```

### 플러그인 등록

```javascript
// config/plugins.js
module.exports = {
  plugins: [
    'my-plugin',
    '@team/shared-plugin',
    {
      name: 'custom-plugin',
      options: {
        // 플러그인 옵션
      }
    }
  ]
};
```

## API 레퍼런스

### CommandCenter 클래스

```javascript
class CommandCenter {
  // 명령어 실행
  async execute(command, args, options) {}
  
  // 플러그인 등록
  registerPlugin(plugin) {}
  
  // 훅 등록
  registerHook(hookName, handler) {}
  
  // 설정 가져오기
  getConfig(key) {}
  
  // 설정 변경
  setConfig(key, value) {}
}
```

### 이벤트

Command Center는 다음 이벤트를 발생시킵니다:

- `command:start` - 명령어 실행 시작
- `command:complete` - 명령어 실행 완료
- `command:error` - 명령어 실행 오류
- `plugin:loaded` - 플러그인 로드 완료
- `plugin:error` - 플러그인 오류

### 에러 처리

```javascript
try {
  const result = await commandCenter.execute('my-command', args);
} catch (error) {
  if (error.code === 'COMMAND_NOT_FOUND') {
    console.error('명령어를 찾을 수 없습니다');
  } else if (error.code === 'INVALID_ARGS') {
    console.error('잘못된 인자입니다');
  }
}
```

## 설정

### 설정 파일

`config/command-center.json`:

```json
{
  "port": 3000,
  "timeout": 30000,
  "maxRetries": 3,
  "plugins": {
    "autoLoad": true,
    "directory": "./plugins"
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}
```

### 환경별 설정

- `config/development.json` - 개발 환경
- `config/production.json` - 프로덕션 환경
- `config/test.json` - 테스트 환경

## 모니터링

### 메트릭

- 명령어 실행 횟수
- 평균 응답 시간
- 에러 발생률
- 플러그인 사용 통계

### 로깅

로그 레벨:
- `error` - 오류 메시지
- `warn` - 경고 메시지
- `info` - 정보 메시지
- `debug` - 디버그 메시지

## 관련 문서

- [플러그인 개발 가이드](#플러그인-개발)
- [API 상세 문서](../api/)
- [설정 가이드](#설정)
- [트러블슈팅](#모니터링)

---

다음 단계: [개발 가이드](../development/) →