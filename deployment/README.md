---
layout: page
title: 배포 가이드
---

# 배포 가이드

## 환경 구성

### 프로덕션 환경 요구사항

- **서버**: Ubuntu 20.04 LTS 이상
- **Node.js**: 18.x LTS
- **데이터베이스**: PostgreSQL 14+
- **캐시**: Redis 6+
- **리버스 프록시**: Nginx 1.18+

### 인프라 구조

```
┌─────────────────────────────────────┐
│         Load Balancer (AWS ALB)      │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐        ┌─────────┐
│ Node.js │        │ Node.js │
│ Server 1│        │ Server 2│
└────┬────┘        └────┬────┘
     │                  │
     └────────┬─────────┘
              ▼
       ┌──────────┐
       │PostgreSQL│
       │  Primary │
       └────┬─────┘
            │
       ┌────▼─────┐
       │PostgreSQL│
       │  Replica │
       └──────────┘
```

## Docker 배포

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
```

### Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@postgres:5432/db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: commandcenter
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 배포 실행

```bash
# 이미지 빌드
docker-compose build

# 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f app

# 서비스 중지
docker-compose down
```

## Kubernetes 배포

### Deployment 설정

`k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: command-center
  labels:
    app: command-center
spec:
  replicas: 3
  selector:
    matchLabels:
      app: command-center
  template:
    metadata:
      labels:
        app: command-center
    spec:
      containers:
      - name: command-center
        image: semicolon/command-center:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service 설정

`k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: command-center-service
spec:
  selector:
    app: command-center
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### 배포 명령어

```bash
# 네임스페이스 생성
kubectl create namespace production

# Secret 생성
kubectl create secret generic db-secret \
  --from-literal=url='postgresql://user:pass@host:5432/db' \
  -n production

# 배포 적용
kubectl apply -f k8s/ -n production

# 상태 확인
kubectl get pods -n production
kubectl get services -n production

# 로그 확인
kubectl logs -f deployment/command-center -n production

# 스케일링
kubectl scale deployment command-center --replicas=5 -n production
```

## CI/CD with GitHub Actions

### 자동 배포 워크플로우

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/command-center:$IMAGE_TAG .
          docker push $ECR_REGISTRY/command-center:$IMAGE_TAG
          docker tag $ECR_REGISTRY/command-center:$IMAGE_TAG $ECR_REGISTRY/command-center:latest
          docker push $ECR_REGISTRY/command-center:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production-cluster \
            --service command-center-service \
            --force-new-deployment
```

## 모니터링

### Prometheus 설정

`prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'command-center'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

### Grafana 대시보드

주요 모니터링 메트릭:
- 요청 처리율 (RPS)
- 응답 시간 (p50, p95, p99)
- 에러율
- CPU/메모리 사용률
- 데이터베이스 연결 풀 상태

### 로그 수집 (ELK Stack)

`filebeat.yml`:

```yaml
filebeat.inputs:
- type: container
  paths:
    - '/var/lib/docker/containers/*/*.log'

output.elasticsearch:
  hosts: ["elasticsearch:9200"]

processors:
  - add_docker_metadata: ~
  - decode_json_fields:
      fields: ["message"]
      target: "json"
```

## 백업 및 복구

### 데이터베이스 백업

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# PostgreSQL 백업
pg_dump -h localhost -U admin -d commandcenter | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# S3 업로드
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://backup-bucket/postgres/

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 복구 절차

```bash
# 백업 다운로드
aws s3 cp s3://backup-bucket/postgres/db_20240904.sql.gz ./

# 압축 해제
gunzip db_20240904.sql.gz

# 데이터베이스 복구
psql -h localhost -U admin -d commandcenter < db_20240904.sql
```

## 무중단 배포

### Blue-Green 배포

```bash
# 새 버전 배포 (Green)
kubectl apply -f k8s/deployment-green.yaml

# 헬스체크 대기
kubectl wait --for=condition=ready pod -l version=green

# 트래픽 전환
kubectl patch service command-center-service -p '{"spec":{"selector":{"version":"green"}}}'

# 이전 버전 제거 (Blue)
kubectl delete deployment command-center-blue
```

### Rolling Update

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

## 트러블슈팅

### 일반적인 문제 해결

#### 1. 메모리 부족
```bash
# 메모리 사용량 확인
docker stats

# Node.js 힙 크기 증가
NODE_OPTIONS="--max-old-space-size=4096" node src/index.js
```

#### 2. 데이터베이스 연결 오류
```bash
# 연결 테스트
psql -h localhost -U admin -d commandcenter -c "SELECT 1"

# 연결 풀 설정 확인
DATABASE_URL="postgresql://user:pass@localhost:5432/db?pool_max=20"
```

#### 3. 포트 충돌
```bash
# 포트 사용 확인
lsof -i :3000

# 프로세스 종료
kill -9 $(lsof -t -i:3000)
```

### 성능 튜닝

#### Nginx 설정
```nginx
upstream backend {
    least_conn;
    server app1:3000 weight=3;
    server app2:3000 weight=2;
    server app3:3000 weight=1;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### PM2 클러스터 모드
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'command-center',
    script: './src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

## 보안 설정

### SSL/TLS 설정

```bash
# Let's Encrypt 인증서 발급
certbot certonly --webroot -w /var/www/html -d api.semicolon.team

# Nginx SSL 설정
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/api.semicolon.team/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.semicolon.team/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### 방화벽 설정

```bash
# UFW 설정
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

다음 단계: [팀 리소스](/docs/resources/) →