---
name: migration-analyzer
description: 레거시 프로젝트를 세미콜론 커뮤니티 규격(cm-template)으로 이식하기 위한 분석 스킬. 프로젝트 구조, 아키텍처, 문서를 분석하여 마이그레이션 계획을 생성합니다.
triggers:
  - 이 프로젝트를 세미콜론 커뮤니티 규격에 맞게 이식
  - 마이그레이션 분석해줘
  - cm-template 규격으로 변환
  - 세미콜론 표준에 맞게 리팩토링
---

# Migration Analyzer Skill

레거시 프로젝트를 세미콜론 커뮤니티 규격(cm-template)으로 이식하기 위한 분석 도구입니다.

## When to Use

이 스킬은 다음 상황에서 호출됩니다:

- 레거시 프로젝트를 세미콜론 커뮤니티 규격으로 전환하고 싶을 때
- 기존 프로젝트가 cm-template 표준과 얼마나 차이나는지 파악하고 싶을 때
- 마이그레이션 작업 범위와 우선순위를 결정해야 할 때

## Analysis Framework

### Phase 1: Project Structure Analysis (구조 분석)

```bash
# 1. 현재 프로젝트 구조 파악
tree -L 3 -I 'node_modules|.git|.next' src/

# 2. cm-template 기준 구조
src/
├── app/
│   └── {domain}/
│       ├── _repositories/    # ⭐ DDD Layer 1
│       ├── _api-clients/     # ⭐ DDD Layer 2
│       ├── _hooks/           # ⭐ DDD Layer 3
│       ├── _components/      # ⭐ DDD Layer 4
│       └── page.tsx
├── components/               # Atomic Design
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── models/                   # 타입 정의
└── lib/
    ├── supabase/
    └── utils/
```

**체크리스트**:

- [ ] DDD 4-Layer 구조 존재 여부
- [ ] Atomic Design 계층 구조 준수
- [ ] 도메인별 디렉토리 분리
- [ ] Repository/API Client 패턴 사용
- [ ] models/ 디렉토리 (vs types/)

### Phase 2: Documentation Analysis (문서 분석)

**필수 문서 체크**:

| 문서              | 경로                              | 상태                |
| ----------------- | --------------------------------- | ------------------- |
| CLAUDE.md         | `./CLAUDE.md`                     | [ ] 존재 / [ ] 누락 |
| README.md         | `./README.md`                     | [ ] 존재 / [ ] 누락 |
| Constitution      | `.specify/memory/constitution.md` | [ ] 존재 / [ ] 누락 |
| .claude/ 디렉토리 | `.claude/`                        | [ ] 존재 / [ ] 누락 |
| templates/ 폴더   | `./templates/`                    | [ ] 존재 / [ ] 누락 |

**문서 내용 검증**:

```bash
# CLAUDE.md 필수 섹션 확인
grep -l "DDD" CLAUDE.md
grep -l "Supabase" CLAUDE.md
grep -l "SSR-First" CLAUDE.md

# CLAUDE.md 불변 원칙 섹션 존재 여부
grep -l "🔴 불변 원칙" CLAUDE.md
grep -l "Team Codex" CLAUDE.md
```

**문서 융합 필요성 분석**:

```bash
# 1. 기존 CLAUDE.md 구조 파악
[ -f CLAUDE.md ] && {
  echo "=== 기존 CLAUDE.md 섹션 ==="
  grep "^## " CLAUDE.md
  grep "^### " CLAUDE.md
}

# 2. cm-template 구조와 비교
# 필수 섹션 목록:
# - 🔴 불변 원칙 (docs 위키 준수 필수)
# - 🟢 프로젝트 특화 설정
# - 📋 개발 명령어
# - 🔗 참조

# 3. README.md 구조 파악
[ -f README.md ] && {
  echo "=== 기존 README.md 섹션 ==="
  grep "^## " README.md
  grep "^### " README.md
}

# 4. cm-template 배지 존재 여부
grep -l "cm-template" README.md 2>/dev/null || echo "cm-template 배지 없음"
```

**문서 융합 전략 판단**:

| 상태                    | CLAUDE.md 전략                             | README.md 전략                               |
| ----------------------- | ------------------------------------------ | -------------------------------------------- |
| 문서 없음               | 템플릿 그대로 적용                         | 템플릿 그대로 적용                           |
| 문서 있음 (규격 미준수) | **융합 필요** - 불변 원칙 + 기존 내용 이식 | **융합 필요** - 템플릿 구조 + 기존 정보 이식 |
| 문서 있음 (규격 준수)   | 유지 (검증만)                              | 유지 (검증만)                                |

**융합 시 추출해야 할 기존 정보**:

```markdown
## CLAUDE.md에서 추출

- [ ] 서비스명/프로젝트명
- [ ] 서비스 설명
- [ ] 환경 설정 (Supabase URL, API Mode 등)
- [ ] 도메인 구조 정보
- [ ] 서비스 특화 규칙/특이사항
- [ ] 커스텀 RPC 함수 목록 (있다면)

## README.md에서 추출

- [ ] 서비스명/제목
- [ ] 서비스 설명 (개요)
- [ ] 주요 기능 목록
- [ ] 설치/실행 방법 (커스텀 부분)
- [ ] 환경 변수 설명
```

### Phase 3: Architecture Compliance (아키텍처 준수)

**DDD Architecture Check**:

```bash
# Repository 패턴 확인
find src -name "*Repository*" -o -name "*repository*"

# API Client 패턴 확인
find src -name "*Client*" -o -name "*client*" | grep -v node_modules

# 'use client' 위치 확인 (Repository에 있으면 위반)
grep -r "'use client'" src/app/*/_repositories/ 2>/dev/null

# 직접 Supabase import 확인 (components에서 직접 import는 위반)
grep -r "@supabase/supabase-js" src/components/ 2>/dev/null
```

**SSR-First Check**:

```bash
# 불필요한 'use client' 검출
grep -r "'use client'" src/app/*/page.tsx 2>/dev/null
```

### Phase 4: Supabase Integration Check

**Storage 버킷 규격**:

```bash
# Storage 사용 패턴 확인
grep -r "supabase.storage" src/

# 버킷명 확인 (public-bucket / private-bucket 규격)
grep -r "from\('" src/ | grep storage
```

**RPC 함수 패턴**:

```bash
# RPC 호출 확인
grep -r "supabase.rpc" src/

# 타입 assertion 패턴 확인
grep -r "as unknown as" src/
```

### Phase 5: Code Quality Check

```bash
# ESLint 검사
npm run lint

# TypeScript 검사
npx tsc --noEmit

# 'any' 타입 사용 검출
grep -r ": any" src/ --include="*.ts" --include="*.tsx"

# console.log 검출
grep -r "console.log" src/ --include="*.ts" --include="*.tsx"
```

### Phase 6: Team Codex Compliance

**커밋 메시지 형식**:

```bash
# 최근 커밋 메시지 패턴 확인
git log --oneline -20

# 형식: type(scope): subject
# 예: feat(posts): Add comment functionality
```

**브랜치 전략**:

```bash
# 현재 브랜치 확인
git branch -a

# feature/, fix/, spike/ 브랜치 패턴 확인
```

## Output Format

### Migration Analysis Report

```markdown
# 🔄 Migration Analysis Report

**프로젝트**: [프로젝트명]
**분석일**: [날짜]
**분석자**: migration-analyzer skill

---

## 📊 Executive Summary

**전체 준수율**: [X]%
**예상 작업량**: [Small/Medium/Large]
**권장 우선순위**: [목록]

---

## 🏗️ Structure Analysis

### DDD Architecture

| Layer      | 현재 상태   | 규격                          | Gap     |
| ---------- | ----------- | ----------------------------- | ------- |
| Repository | [경로/없음] | `app/{domain}/_repositories/` | [✅/❌] |
| API Client | [경로/없음] | `app/{domain}/_api-clients/`  | [✅/❌] |
| Hooks      | [경로/없음] | `app/{domain}/_hooks/`        | [✅/❌] |
| Components | [경로/없음] | `app/{domain}/_components/`   | [✅/❌] |

### Atomic Design

| Layer      | 현재 상태   | 규격                    | Gap     |
| ---------- | ----------- | ----------------------- | ------- |
| atoms/     | [존재/없음] | `components/atoms/`     | [✅/❌] |
| molecules/ | [존재/없음] | `components/molecules/` | [✅/❌] |
| organisms/ | [존재/없음] | `components/organisms/` | [✅/❌] |
| templates/ | [존재/없음] | `components/templates/` | [✅/❌] |

---

## 📄 Documentation Gap

| 문서         | 상태    | 필요 작업        |
| ------------ | ------- | ---------------- |
| CLAUDE.md    | [✅/❌] | [복사/융합/신규] |
| .claude/     | [✅/❌] | [복사/수정/신규] |
| Constitution | [✅/❌] | [복사/수정/신규] |
| README.md    | [✅/❌] | [복사/융합/신규] |
| templates/   | [✅/❌] | [복사 필요]      |

### 문서 융합 분석

**CLAUDE.md 융합 전략**: [템플릿 적용 / 융합 필요 / 유지]

| 추출 항목        | 기존 문서에서 발견 | 융합 필요           |
| ---------------- | ------------------ | ------------------- |
| 서비스명         | [있음/없음]        | [Y/N]               |
| 서비스 설명      | [있음/없음]        | [Y/N]               |
| 환경 설정        | [있음/없음]        | [Y/N]               |
| 도메인 구조      | [있음/없음]        | [Y/N]               |
| 서비스 특화 규칙 | [있음/없음]        | [Y/N]               |
| 불변 원칙 섹션   | [있음/없음]        | [반드시 템플릿에서] |

**README.md 융합 전략**: [템플릿 적용 / 융합 필요 / 유지]

| 추출 항목        | 기존 문서에서 발견 | 융합 필요     |
| ---------------- | ------------------ | ------------- |
| 서비스명/제목    | [있음/없음]        | [Y/N]         |
| 서비스 설명      | [있음/없음]        | [Y/N]         |
| 주요 기능        | [있음/없음]        | [Y/N]         |
| 설치/실행 방법   | [있음/없음]        | [Y/N]         |
| cm-template 배지 | [있음/없음]        | [반드시 추가] |

---

## ⚠️ Architecture Violations

### Critical (즉시 수정 필요)

1. **[위반 사항]**
   - 위치: `[파일 경로]`
   - 문제: [설명]
   - 해결: [수정 방법]

### Warning (권장 수정)

1. **[위반 사항]**
   - 위치: `[파일 경로]`
   - 문제: [설명]
   - 해결: [수정 방법]

---

## 🗂️ Supabase Integration

### Storage

| 항목         | 현재            | 규격                          | 상태    |
| ------------ | --------------- | ----------------------------- | ------- |
| Public 버킷  | [사용중인 이름] | `public-bucket`               | [✅/❌] |
| Private 버킷 | [사용중인 이름] | `private-bucket`              | [✅/❌] |
| 경로 패턴    | [현재 패턴]     | `{type}/{ownerId}/{filename}` | [✅/❌] |

### RPC Functions

| 항목            | 현재   | 규격                 | 상태    |
| --------------- | ------ | -------------------- | ------- |
| 파라미터 prefix | [현재] | `p_`                 | [✅/❌] |
| 타입 assertion  | [현재] | `as unknown as Type` | [✅/❌] |
| 에러 처리       | [현재] | 표준 패턴            | [✅/❌] |

---

## 📋 Migration Tasks

### Phase 1: Foundation (기반 작업)

- [ ] `templates/` 폴더 복사 (cm-template에서)
- [ ] 기존 문서 백업 (`.migration-backup/`)
- [ ] `CLAUDE.md` 융합:
  - [ ] 불변 원칙: 템플릿에서 적용
  - [ ] 프로젝트 정보: 기존 문서에서 추출
  - [ ] 도메인 구조: 현재 구조 반영
- [ ] `README.md` 융합:
  - [ ] 서비스 정보: 기존에서 추출
  - [ ] 템플릿 구조 적용
  - [ ] cm-template 배지 추가
- [ ] `.claude/` 디렉토리 복사 및 설정
- [ ] `.specify/memory/constitution.md` 설정
- [ ] 환경변수 정리 (`.env.example`)

### Phase 2: Structure (구조 변경)

- [ ] DDD 4-Layer 디렉토리 생성
- [ ] Repository 마이그레이션
- [ ] API Client 마이그레이션
- [ ] Hooks 도메인별 분리
- [ ] Components 도메인별 분리

### Phase 3: Atomic Design

- [ ] `components/atoms/` 구조화
- [ ] `components/molecules/` 구조화
- [ ] `components/organisms/` 구조화
- [ ] `components/templates/` 구조화

### Phase 4: Supabase Alignment

- [ ] Storage 버킷명 변경 (`public-bucket`, `private-bucket`)
- [ ] RPC 파라미터 prefix 통일 (`p_`)
- [ ] 타입 assertion 패턴 적용

### Phase 5: Quality & Cleanup

- [ ] `types/` → `models/` 마이그레이션
- [ ] ESLint 에러 수정
- [ ] TypeScript 에러 수정
- [ ] `any` 타입 제거
- [ ] console.log 제거

### Phase 6: Documentation

- [ ] README.md 업데이트
- [ ] CLAUDE.md 커스터마이징
- [ ] 도메인별 spec.md 생성 (선택)

---

## 📈 Estimated Effort

| Phase         | 예상 시간   | 복잡도            |
| ------------- | ----------- | ----------------- |
| Foundation    | [X]시간     | [Low/Medium/High] |
| Structure     | [X]시간     | [Low/Medium/High] |
| Atomic Design | [X]시간     | [Low/Medium/High] |
| Supabase      | [X]시간     | [Low/Medium/High] |
| Quality       | [X]시간     | [Low/Medium/High] |
| Documentation | [X]시간     | [Low/Medium/High] |
| **Total**     | **[X]시간** | -                 |

---

## 🎯 Recommended Priority

1. **즉시**: [가장 critical한 항목]
2. **단기**: [1주 내 완료 항목]
3. **중기**: [2-4주 내 완료 항목]
4. **장기**: [선택적 개선 항목]

---

## 🔗 References

- [cm-template](https://github.com/semicolon-devteam/cm-template)
- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [Development Philosophy](https://github.com/semicolon-devteam/docs/wiki/Development-Philosophy)
- [DDD Architecture Guide](https://github.com/semicolon-devteam/docs/blob/main/guides-architecture-template-ddd.md)
```

## Dependencies

- `cm-template` 레포지토리 접근 (규격 참조용)
- `docs` 위키 접근 (Team Codex, Development Philosophy)
- GitHub CLI (`gh`) 인증

## Related Skills

- `scaffold-domain` - DDD 도메인 구조 생성
- `validate-architecture` - 아키텍처 검증
- `check-team-codex` - 코드 품질 검증
- `fetch-team-context` - 팀 표준 참조

## Related Agents

- `migration-master` - 마이그레이션 오케스트레이션
- `quality-master` - 품질 검증

## Critical Rules

1. **분석만 수행**: 이 스킬은 분석만 수행, 자동 수정 금지
2. **cm-template 기준**: 모든 비교는 cm-template 기준
3. **docs 위키 참조**: Team Codex, Development Philosophy 참조
4. **우선순위 제시**: Critical → Warning → Suggestion 순서
5. **실행 가능한 태스크**: 구체적인 마이그레이션 태스크 제공
6. **문서 유효성 검증**: docs 레포지토리 문서 참조 시 404 응답이면 반드시 사용자에게 알림
   - `gh api repos/semicolon-devteam/docs/contents/{path}` 로 검증
   - 실패 시: "⚠️ 문서 참조 실패: {document_name} - 경로 변경 또는 삭제됨" 출력

## Return Values

```typescript
{
  projectName: string,
  analysisDate: string,
  complianceScore: number,        // 0-100%
  estimatedEffort: "Small" | "Medium" | "Large",
  gaps: {
    structure: GapItem[],
    documentation: GapItem[],
    architecture: ViolationItem[],
    supabase: GapItem[],
    quality: QualityIssue[]
  },
  tasks: MigrationTask[],
  priority: PriorityItem[],
  report: string                  // Markdown formatted
}
```
