---
name: create-command
description: Create SAX slash commands following Claude Code conventions. Use when (1) need to add new /SAX:command, (2) creating interactive workflows triggered by slash commands, (3) packaging command-based operations.
tools: [Bash, Write]
---

# Create Command Skill

> SAX 슬래시 커맨드 생성 (Claude Code 규칙 준수)

## 역할

Claude Code의 slash command 규칙에 따라 SAX 커맨드를 생성합니다.

## Quick Start

```bash
# 1. SAX 디렉토리에 파일 생성 (: 프리픽스 없이)
touch sax/packages/sax-po/commands/SAX/new-command.md

# 2. 커맨드 내용 작성 (Markdown 형식)
# 3. CLAUDE.md Commands 섹션에 추가
# 4. .claude/ 동기화

# 호출 형식 (자동)
/SAX:new-command  # ✅ SAX: 프리픽스 자동 적용
```

## 네이밍 규칙

- ✅ 파일명: `commands/SAX/onboarding.md` → 호출: `/SAX:onboarding`
- ❌ 파일명: `commands/SAX/:onboarding.md` → 이중 콜론 발생

## SAX Message

```markdown
[SAX] Skill: create-command 사용
[SAX] Reference: Claude Code slash command 규칙 준수
```

## Related

- [Commands 섹션](../../CLAUDE.md#commands)
- [기존 SAX Commands](../../commands/SAX/)

## References

For detailed documentation, see:

- [Naming Rules](references/naming-rules.md) - 네이밍 규칙, 커맨드 파일 구조, CLAUDE.md 업데이트
- [Sync Commands](references/sync-commands.md) - .claude/ 동기화 명령어
