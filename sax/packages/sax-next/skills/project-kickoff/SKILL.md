---
name: project-kickoff
description: Interactive project creation from cm-template. Use when (1) user requests new service creation, (2) creating new cm-* project, (3) need guided wizard for project configuration, (4) generating ready-to-copy project in implement-dist/.
tools: [Bash, Read, Write, Edit]
---

# Project Kickoff Skill

**Purpose**: Interactive wizard for creating new Semicolon community services from cm-template

## Activation Triggers

This skill is invoked when users say:

- `cm-{name} 프로젝트 만들어줘`
- `새 커뮤니티 서비스 만들어줘`
- `{name} 서비스 생성해줘`
- `프로젝트 킥오프 해줘`
- `새 프로젝트 세팅해줘`

## What It Does

### Phase 1: Gather Configuration (Interactive)

Ask questions sequentially to collect required information:

```markdown
## 🚀 프로젝트 킥오프 시작

새로운 Semicolon 커뮤니티 서비스를 생성합니다.
몇 가지 정보가 필요해요.

---

### 1️⃣ 프로젝트 기본 정보

**프로젝트 이름**을 알려주세요.

- 형식: kebab-case (예: `my-school-community`)
- 현재 감지된 이름: `{detected_name}` (맞으면 Enter)

> 입력:
```

Wait for response, then continue:

```markdown
### 2️⃣ Supabase 설정

**Supabase 프로젝트 ID**를 알려주세요.

- 위치: Supabase Dashboard > Project Settings > General
- 형식: 영문+숫자 조합 (예: `wloqfachtbxceqikzosi`)

> 입력:
```

```markdown
### 3️⃣ Supabase Keys

**ANON_KEY**를 알려주세요.

- 위치: Supabase Dashboard > Project Settings > API > anon public
- `eyJ`로 시작하는 긴 문자열

> 입력:
```

```markdown
### 4️⃣ Service Role Key (선택)

**SERVICE_ROLE_KEY**를 알려주세요. (나중에 설정하려면 `skip` 입력)

- 위치: Supabase Dashboard > Project Settings > API > service_role
- ⚠️ 이 키는 절대 공개하면 안 됩니다

> 입력:
```

```markdown
### 5️⃣ 서비스 설명 (선택)

**서비스 한 줄 설명**을 입력해주세요. (기본값 사용하려면 `skip`)

- 예: "교내 정보 공유 및 커뮤니티 플랫폼"

> 입력:
```

### Phase 2: Confirm Configuration

```markdown
## ✅ 설정 확인

다음 설정으로 프로젝트를 생성합니다:

| 항목                  | 값                    |
| --------------------- | --------------------- |
| **프로젝트 이름**     | {project_name}        |
| **서비스 제목**       | {service_title}       |
| **Supabase 프로젝트** | {supabase_project_id} |
| **ANON_KEY**          | {anon_key_masked}     |
| **SERVICE_ROLE_KEY**  | {service_role_masked} |
| **서비스 설명**       | {description}         |

**출력 위치**: `implement-dist/{project_name}/`

---

이대로 진행할까요? (Y/n)
```

### Phase 3: Execute Generation

1. **Run create-service.sh** with collected parameters:

```bash
./scripts/create-service.sh {project_name} {supabase_project_id} implement-dist/{project_name}
```

2. **Update .env.local** with actual keys:

```bash
# Replace placeholder keys with actual values
sed -i '' "s/your-anon-key-here/{anon_key}/" implement-dist/{project_name}/.env.local
sed -i '' "s/your-service-role-key-here/{service_role_key}/" implement-dist/{project_name}/.env.local
```

3. **Update .claude.json** with Supabase access token (if available)

### Phase 4: Report Success

```markdown
## 🎉 프로젝트 생성 완료!

**{service_title}** 프로젝트가 생성되었습니다.

### 📁 생성 위치
```

implement-dist/{project_name}/
├── src/ # 소스 코드
├── public/ # 정적 파일
├── .claude/ # Claude 에이전트/스킬
├── CLAUDE.md # AI 가이드 (커스터마이즈됨)
├── README.md # 프로젝트 문서 (커스터마이즈됨)
├── .env.local # 환경 변수 (키 설정됨)
├── package.json # 의존성 (이름 변경됨)
└── ...

````

### 🚀 다음 단계

1. **폴더 복사**:
   ```bash
   cp -r implement-dist/{project_name} ~/your-workspace/{project_name}
   cd ~/your-workspace/{project_name}
````

2. **의존성 설치**:

   ```bash
   npm install
   ```

3. **개발 서버 시작**:

   ```bash
   npm run dev
   ```

4. **GitHub 연결**:
   ```bash
   git remote add origin https://github.com/semicolon-devteam/{project_name}.git
   git push -u origin main
   ```

### 📚 참고 문서

- [Team Codex](https://github.com/semicolon-devteam/docs/wiki/Team-Codex)
- [CLAUDE.md](implement-dist/{project_name}/CLAUDE.md)

---

⚠️ `implement-dist/` 폴더는 임시 출력 폴더입니다.
필요한 위치로 복사 후 삭제해도 됩니다.

````

## Configuration Schema

```yaml
required:
  project_name:
    type: string
    format: kebab-case
    example: "my-school-community"

  supabase_project_id:
    type: string
    format: alphanumeric
    example: "wloqfachtbxceqikzosi"

  anon_key:
    type: string
    format: jwt
    starts_with: "eyJ"

optional:
  service_role_key:
    type: string
    format: jwt
    default: "your-service-role-key-here"

  description:
    type: string
    default: "Semicolon 커뮤니티 기반 서비스"
````

## Output Structure

```
implement-dist/
└── {project_name}/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   ├── hooks/
    │   └── models/
    ├── public/
    ├── .claude/
    │   ├── agents/
    │   └── skills/
    ├── .husky/
    ├── CLAUDE.md           # 플레이스홀더 치환됨
    ├── README.md           # 플레이스홀더 치환됨
    ├── .env.local          # 실제 키 설정됨
    ├── .claude.json        # project-ref 업데이트됨
    ├── package.json        # name 업데이트됨
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    └── ...
```

## Error Handling

### Invalid Project Name

```markdown
⚠️ 프로젝트 이름이 올바르지 않습니다.

**요구사항**:

- kebab-case 형식 (소문자, 하이픈만 사용)
- 예: `my-school-community`, `company-portal`

**입력값**: `{invalid_input}`
**문제**: {reason}

다시 입력해주세요:
```

### Invalid Supabase Project ID

```markdown
⚠️ Supabase 프로젝트 ID가 올바르지 않습니다.

**요구사항**:

- 영문 소문자 + 숫자 조합
- Supabase Dashboard에서 확인 가능

다시 입력해주세요:
```

### Invalid ANON_KEY

```markdown
⚠️ ANON_KEY 형식이 올바르지 않습니다.

**요구사항**:

- `eyJ`로 시작하는 JWT 토큰
- Supabase Dashboard > Project Settings > API에서 복사

다시 입력해주세요:
```

### Script Execution Failure

```markdown
❌ 프로젝트 생성 중 오류가 발생했습니다.

**오류 내용**:
```

{error_message}

```

**해결 방법**:
1. 입력값 확인
2. 템플릿 디렉토리 확인: `ls -la scripts/`
3. 권한 확인: `chmod +x scripts/create-service.sh`

다시 시도하시겠습니까? (Y/n)
```

## Validation Rules

### Project Name Validation

```javascript
function validateProjectName(name) {
  // kebab-case: lowercase letters, numbers, hyphens
  const pattern = /^[a-z][a-z0-9-]*[a-z0-9]$/;

  if (!pattern.test(name)) {
    return { valid: false, reason: "kebab-case 형식이 아닙니다" };
  }

  if (name.includes("--")) {
    return { valid: false, reason: "연속된 하이픈은 사용할 수 없습니다" };
  }

  if (name.length < 3) {
    return { valid: false, reason: "최소 3자 이상이어야 합니다" };
  }

  return { valid: true };
}
```

### Supabase Project ID Validation

```javascript
function validateSupabaseProjectId(id) {
  // Supabase project IDs are alphanumeric, ~20 chars
  const pattern = /^[a-z0-9]{15,25}$/;
  return pattern.test(id);
}
```

### ANON_KEY Validation

```javascript
function validateAnonKey(key) {
  // JWT format starting with eyJ
  return key.startsWith("eyJ") && key.length > 100;
}
```

## Dependencies

- `scripts/create-service.sh` - Core generation script
- `templates/CLAUDE.template.md` - CLAUDE.md template
- `templates/README.template.md` - README.md template

## Related Skills

- `scaffold-domain` - Creates domain structure within a project
- `fetch-team-context` - Provides team standards context

## Clean Up

After user copies the project:

```bash
# Optional: Clean up implement-dist
rm -rf implement-dist/{project_name}

# Or clean all
rm -rf implement-dist/*
```

## Example Interaction

```
User: cm-school-portal 프로젝트 만들어줘

Agent:
## 🚀 프로젝트 킥오프 시작

새로운 Semicolon 커뮤니티 서비스를 생성합니다.

### 1️⃣ 프로젝트 기본 정보
**프로젝트 이름**: `cm-school-portal` ✓ (감지됨)

### 2️⃣ Supabase 설정
**Supabase 프로젝트 ID**를 알려주세요.

User: abc123xyz456

Agent:
### 3️⃣ Supabase Keys
**ANON_KEY**를 알려주세요.

User: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Agent:
### 4️⃣ Service Role Key
**SERVICE_ROLE_KEY**를 알려주세요. (skip 가능)

User: skip

Agent:
## ✅ 설정 확인
| 항목 | 값 |
|------|-----|
| 프로젝트 이름 | cm-school-portal |
| Supabase 프로젝트 | abc123xyz456 |
| ANON_KEY | eyJhbG...****** |

이대로 진행할까요? (Y/n)

User: Y

Agent:
[프로젝트 생성 실행...]

## 🎉 프로젝트 생성 완료!
**Cm School Portal** 프로젝트가 생성되었습니다.

📁 생성 위치: `implement-dist/cm-school-portal/`
...
```
