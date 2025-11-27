---
name: package-validator
description: SAX 패키지 구조 및 규칙 준수 검증. Use when (1) Agent/Skill 추가/수정/삭제 후 검증, (2) CLAUDE.md 업데이트 후 일관성 확인, (3) 버저닝 전 품질 게이트.
tools: [Bash, Read, Grep]
---

# package-validator Skill

> SAX 패키지 구조 및 규칙 준수 자동 검증

## Purpose

SAX 패키지의 구조적 완전성과 규칙 준수를 자동으로 검증합니다.

## Quick Start

```bash
# 패키지 전체 검증
ls -la sax/packages/{package}/agents/
ls -la sax/packages/{package}/skills/

# Frontmatter 검증
head -n 10 sax/packages/{package}/agents/*.md | grep -E "^(name|description|tools):"

# CLAUDE.md 일관성 검증
grep -E "^\| .+ \|" sax/packages/{package}/CLAUDE.md
```

## Validation Checklist

| 검증 항목 | 명령어 | 기대 결과 |
|----------|--------|----------|
| Frontmatter | `head -n 10 {file}` | name, description, tools 존재 |
| 네이밍 | `ls {dir}` | kebab-case 준수 |
| CLAUDE.md | `grep {agent}` | 테이블에 모든 Agent 나열 |
| Progressive Disclosure | `ls skills/*/` | SKILL.md + references/ |

## SAX Message

```markdown
[SAX] Skill: package-validator 사용

[SAX] Validation: {package} 패키지 검증 완료
```

## Related

- [sax-architect Agent](../../agents/sax-architect.md)
- [SAX Core - Packaging](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PACKAGING.md)

## References

For detailed documentation, see:

- [Validation Rules](references/validation-rules.md) - Frontmatter, 네이밍, CLAUDE.md, Orchestrator 검증 규칙
- [Validation Process](references/validation-process.md) - 5단계 검증 프로세스 상세
- [Output Format](references/output-format.md) - 성공/실패 출력 형식, 에러 핸들링
