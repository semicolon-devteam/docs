# SAX-PO Package Configuration

> PO(Product Owner) 및 기획자를 위한 SAX 패키지

## Package Info

- **Package**: SAX-PO
- **Version**: 📌 [sax/VERSION](https://github.com/semicolon-devteam/docs/blob/main/sax/VERSION) 참조
- **Target**: docs repository
- **Audience**: PO, 기획자, 프로젝트 매니저
- **Extends**: SAX-Core

## SAX Core 상속

이 패키지는 SAX Core의 기본 원칙을 상속합니다.

@sax-core/PRINCIPLES.md
@sax-core/MESSAGE_RULES.md

> 📖 Core 문서는 `.claude/sax-core/` 서브모듈에서 로드됩니다.

## 패키지 구조

이 레포지토리는 Git Submodule 방식으로 SAX 패키지를 사용합니다:

```text
.claude/
├── CLAUDE.md           # 이 파일 (레포 전용 설정)
├── sax-core/           # Git Submodule (semicolon-devteam/sax-core)
│   ├── PRINCIPLES.md
│   ├── MESSAGE_RULES.md
│   ├── PACKAGING.md
│   └── TEAM_RULES.md
└── sax-po/             # Git Submodule (semicolon-devteam/sax-po)
    ├── CLAUDE.md       # 패키지 설정
    ├── agents/
    ├── skills/
    ├── commands/
    └── templates/
```

## 패키지 업데이트

```bash
# 모든 서브모듈 최신화
git submodule update --remote

# 변경사항 커밋
git add .claude/
git commit -m "🔧 Update SAX packages"
```

## SAX-PO 컴포넌트

### Agents

SAX-PO 패키지의 Agent 정의는 `.claude/sax-po/agents/`에서 관리됩니다.

| Agent | 역할 |
|-------|------|
| orchestrator | 요청 라우팅 |
| epic-master | Epic 생성 및 관리 |
| draft-task-creator | Draft Task 생성 |
| spec-writer | Spec 문서 작성 |
| teacher | SAX 사용법 교육 |
| onboarding-master | 신규 팀원 온보딩 |

### Skills

SAX-PO 패키지의 Skill 정의는 `.claude/sax-po/skills/`에서 관리됩니다.

| Skill | 역할 |
|-------|------|
| create-epic | Epic 이슈 생성 |
| check-team-codex | Team Codex 확인 |
| health-check | SAX 상태 점검 |
| assign-project-label | 프로젝트 라벨 할당 |
| detect-project-from-epic | Epic에서 프로젝트 감지 |

### Commands

| Command | 역할 |
|---------|------|
| /SAX:help | SAX 도움말 |
| /SAX:health-check | 상태 점검 |
| /SAX:onboarding | 온보딩 시작 |

## References

- [SAX Core](https://github.com/semicolon-devteam/sax-core)
- [SAX-PO](https://github.com/semicolon-devteam/sax-po)
- [SAX Changelog](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md)
