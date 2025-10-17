---
layout: default
title: 데이터베이스 운영
parent: Infrastructure
nav_order: 1
---

# 🗄️ PostgreSQL 중앙 데이터베이스 시스템

세미콜론 커뮤니티의 모든 마이크로서비스가 공유하는 중앙 데이터 저장소입니다.

## 📊 시스템 구성

### 아키텍처
- **데이터베이스**: PostgreSQL 16
- **구성**: Master-Replica 복제
- **컨테이너화**: Docker Compose
- **포트 설정**:
  - Primary: 5432
  - Replica: 5433

### 성능 사양
- **트랜잭션**: 일일 100만 건 처리
- **동시 연결**: 최대 200개
- **응답 시간**:
  - 단순 SELECT: < 5ms
  - 복잡한 JOIN: < 100ms
- **버퍼 히트율**: 95% 이상

## 🔐 보안 체계

### 3-Tier 권한 시스템

각 마이크로서비스는 3개의 데이터베이스 계정을 사용:

| 계정 타입 | 네이밍 규칙 | 권한 | 용도 |
|----------|------------|------|------|
| Owner | `{service}own` | DDL | 스키마 관리, 테이블 생성/수정 |
| App | `{service}app` | DML | 데이터 CRUD 작업 |
| User | `{service}user` | SELECT | 읽기 전용 접근 |

### 권한 예시 (Gatherer 서비스)
```sql
-- Owner 계정: gtown
CREATE TABLE gt_raw_data (...);
ALTER TABLE gt_raw_data ADD COLUMN ...;

-- App 계정: gtapp
INSERT INTO gt_raw_data VALUES (...);
UPDATE gt_raw_data SET ...;
DELETE FROM gt_raw_data WHERE ...;

-- User 계정: gtuser
SELECT * FROM gt_raw_data;
```

## 🏷️ 테이블 네이밍 규칙

각 마이크로서비스는 고유한 테이블 prefix를 사용:

| 서비스 | Prefix | 테이블 예시 |
|--------|--------|------------|
| Gatherer | gt_ | gt_raw_data, gt_sources |
| Aggregator | ag_ | ag_results, ag_metrics |
| Scheduler | sc_ | sc_jobs, sc_history |
| Ledger | lg_ | lg_transactions, lg_balances |
| Notifier | nf_ | nf_messages, nf_templates |
| Observer | ob_ | ob_metrics, ob_alerts |
| Moderator | md_ | md_contents, md_actions |
| Gamer | gm_ | gm_scores, gm_leaderboard |
| Prompter | pm_ | pm_templates, pm_history |
| Requester | rq_ | rq_requests, rq_responses |
| ITG | it_ | it_routes, it_auth |
| Allocator | al_ | al_resources, al_usage |

## 💾 백업 및 복구

### 백업 전략
- **일일 백업**: 매일 새벽 2시
- **주간 백업**: 매주 일요일
- **월간 백업**: 매월 1일
- **보관 기간**: 30일

### 백업 명령어
```bash
# 논리적 백업
docker exec pg16-primary pg_dump -U app -d appdb > backup_$(date +%Y%m%d).sql

# 물리적 백업
docker exec pg16-primary pg_basebackup -D - -Ft -z -U repl > backup_$(date +%Y%m%d).tar.gz
```

### 복구 절차
1. 백업 파일 확인
2. 새 데이터베이스 준비
3. 백업 복원
4. 데이터 검증
5. 서비스 재연결

## 📈 모니터링

### 주요 메트릭
```sql
-- 연결 수 모니터링
SELECT count(*) as total_connections,
       count(*) FILTER (WHERE state = 'active') as active,
       count(*) FILTER (WHERE state = 'idle') as idle
FROM pg_stat_activity;

-- 복제 지연 확인
SELECT application_name, client_addr,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) as lag
FROM pg_stat_replication;

-- 버퍼 히트율
SELECT round(100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2) as hit_ratio
FROM pg_stat_database;
```

### 알림 임계값
- CPU 사용률 > 80%
- 메모리 사용률 > 85%
- 디스크 사용률 > 90%
- 복제 지연 > 5초
- 연결 수 > max_connections * 0.8

## 🚨 장애 대응

### Primary 서버 장애
1. Primary 상태 확인
2. Replica를 Primary로 승격
3. 애플리케이션 연결 변경
4. 새 Replica 구성

### Replica 서버 장애
1. Replica 재시작 시도
2. 실패 시 재생성
3. 복제 재연결
4. 동기화 확인

## ⚡ 성능 최적화

### 메모리 설정 (16GB RAM 기준)
```ini
shared_buffers = 4GB          # RAM의 25%
effective_cache_size = 12GB   # RAM의 75%
work_mem = 64MB              # RAM / max_connections / 2
maintenance_work_mem = 1GB    # RAM의 5-10%
```

### 인덱스 전략
- Primary Key 자동 인덱스
- Foreign Key 인덱스 추가
- 자주 검색되는 컬럼 인덱스
- 복합 인덱스 고려

## ✅ 운영 체크리스트

### 일일 점검
- [ ] 서비스 상태 확인
- [ ] 디스크 사용량 확인
- [ ] 복제 지연 확인
- [ ] 백업 상태 확인
- [ ] 에러 로그 확인

### 주간 점검
- [ ] 성능 통계 리뷰
- [ ] 백업 복구 테스트
- [ ] 보안 패치 확인
- [ ] 디스크 정리

### 월간 점검
- [ ] 인덱스 최적화
- [ ] VACUUM ANALYZE 실행
- [ ] 용량 계획 검토
- [ ] 보안 감사

---

> 📅 최종 업데이트: 2025-09-04
> 
> 💡 문의: DevOps 팀