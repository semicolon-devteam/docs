---
layout: page
title: Docker 환경 구성
permalink: /infrastructure/docker/
---

# Docker 환경 구성

## 개요
세미콜론 개발팀의 Docker 기반 컨테이너 환경 구성 및 관리 가이드입니다.

## Docker 기본 설정

### Dockerfile 작성

#### Node.js 애플리케이션
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 캐시 활용
COPY package*.json ./
RUN npm ci --only=production

# 애플리케이션 복사
COPY . .
RUN npm run build

# 실행 이미지
FROM node:18-alpine

WORKDIR /app

# 보안: non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 빌드 결과물 복사
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

#### Python 애플리케이션
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 복사
COPY . .

# 보안 설정
RUN useradd -m -u 1001 python && chown -R python:python /app
USER python

EXPOSE 8000

CMD ["python", "app.py"]
```

## Docker Compose 구성

### 개발 환경
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: semicolon-app
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://user:password@postgres:5432/semicolon_dev
      REDIS_URL: redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - semicolon-network
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    container_name: semicolon-postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: semicolon_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - semicolon-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: semicolon-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - semicolon-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: semicolon-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites:/etc/nginx/sites-available
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - semicolon-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  semicolon-network:
    driver: bridge
```

### 프로덕션 환경
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: semicolon/app:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    environment:
      NODE_ENV: production
    secrets:
      - db_password
      - jwt_secret
    networks:
      - semicolon-network

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

## Docker 명령어

### 기본 명령어
```bash
# 이미지 빌드
docker build -t semicolon/app:latest .

# 컨테이너 실행
docker run -d -p 3000:3000 --name app semicolon/app:latest

# 로그 확인
docker logs -f app

# 컨테이너 접속
docker exec -it app sh

# 정리
docker system prune -a
```

### Docker Compose 명령어
```bash
# 시작
docker-compose up -d

# 재시작
docker-compose restart

# 로그
docker-compose logs -f app

# 정지 및 제거
docker-compose down

# 볼륨 포함 제거
docker-compose down -v

# 특정 서비스만 재시작
docker-compose restart app
```

## 이미지 최적화

### 크기 최소화
```dockerfile
# Alpine Linux 사용
FROM node:18-alpine

# 불필요한 파일 제거
RUN rm -rf /var/cache/apk/*

# .dockerignore 활용
node_modules
*.log
.git
.env
coverage
.nyc_output
```

### 레이어 캐싱
```dockerfile
# 의존성을 먼저 복사
COPY package*.json ./
RUN npm ci

# 그 다음 소스 코드 복사
COPY . .
```

### Multi-stage Build
```dockerfile
# 빌드 스테이지
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# 실행 스테이지
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production
```

## 보안 설정

### 보안 스캔
```bash
# Trivy 사용
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image semicolon/app:latest

# Docker Scout
docker scout cves semicolon/app:latest
```

### 보안 best practices
```dockerfile
# Non-root user 사용
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# 민감 정보는 빌드 인자로
ARG API_KEY
RUN echo "API_KEY=${API_KEY}" > .env

# 최소 권한 원칙
RUN chmod 400 /app/config/*
```

## 네트워킹

### 사용자 정의 네트워크
```bash
# 네트워크 생성
docker network create semicolon-network

# 네트워크 조회
docker network ls

# 네트워크 상세 정보
docker network inspect semicolon-network
```

### 서비스 간 통신
```yaml
services:
  app:
    networks:
      - frontend
      - backend
  
  postgres:
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 외부 접근 차단
```

## 볼륨 관리

### 볼륨 타입
```yaml
volumes:
  # Named volume
  - db_data:/var/lib/postgresql/data
  
  # Bind mount
  - ./src:/app/src
  
  # Anonymous volume
  - /app/node_modules
```

### 백업 및 복구
```bash
# 볼륨 백업
docker run --rm -v postgres_data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/postgres_backup.tar.gz /data

# 볼륨 복구
docker run --rm -v postgres_data:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/postgres_backup.tar.gz -C /
```

## 모니터링

### 리소스 모니터링
```bash
# 실시간 모니터링
docker stats

# 특정 컨테이너
docker stats app postgres redis

# JSON 형식
docker stats --format json
```

### 헬스체크
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node healthcheck.js || exit 1
```

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## CI/CD 통합

### GitHub Actions
```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: semicolon/app:latest
          cache-from: type=registry,ref=semicolon/app:buildcache
          cache-to: type=registry,ref=semicolon/app:buildcache,mode=max
```

## 트러블슈팅

### 일반적인 문제

#### 컨테이너 시작 실패
```bash
# 로그 확인
docker logs app

# 상세 정보
docker inspect app

# 이벤트 확인
docker events --since '1h'
```

#### 네트워크 문제
```bash
# 네트워크 테스트
docker run --rm --network semicolon-network alpine ping postgres

# DNS 확인
docker exec app nslookup postgres
```

#### 볼륨 권한 문제
```bash
# 권한 수정
docker exec -u root app chown -R nodejs:nodejs /app

# 볼륨 권한 확인
docker run --rm -v app_data:/data alpine ls -la /data
```

## 체크리스트

### 개발 환경
- [ ] Dockerfile 작성
- [ ] docker-compose.yml 구성
- [ ] 볼륨 마운트 설정
- [ ] 환경 변수 설정
- [ ] 네트워크 구성

### 프로덕션 준비
- [ ] 이미지 최적화
- [ ] 보안 스캔 실행
- [ ] 헬스체크 구현
- [ ] 리소스 제한 설정
- [ ] 로깅 구성

### 배포
- [ ] 이미지 레지스트리 푸시
- [ ] 환경별 설정 분리
- [ ] 시크릿 관리
- [ ] 모니터링 설정
- [ ] 백업 전략 수립

## 참고 자료
- [Docker 공식 문서](https://docs.docker.com)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)