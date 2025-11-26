---
name: create-command
description: Create SAX slash commands following Claude Code conventions. Use when (1) need to add new /SAX:command, (2) creating interactive workflows triggered by slash commands, (3) packaging command-based operations.
---

# Create Command Skill

> SAX 슬래시 커맨드 생성 (Claude Code 규칙 준수)

## 역할

Claude Code의 slash command 규칙에 따라 SAX 커맨드를 생성합니다.

## When to Use

- `/SAX:new-command` 형태의 새 커맨드 추가 필요 시
- 대화형 워크플로우를 slash command로 트리거해야 할 때
- 반복적인 작업을 커맨드로 패키징할 때

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

## 커맨드 파일 구조

```markdown
# Command Title

> 간단한 설명 (1줄)

## Purpose

커맨드의 목적과 역할

## Usage

커맨드 사용 방법 및 예시

## Workflow

1. Step 1
2. Step 2
3. Step 3

## Examples

실제 사용 예제
```

## 네이밍 규칙

**올바른 방법**:

- ✅ 파일명: `commands/SAX/onboarding.md`
- ✅ 호출: `/SAX:onboarding`
- ✅ 디렉토리명이 프리픽스 역할

**잘못된 방법**:

- ❌ 파일명: `commands/SAX/:onboarding.md` (: 프리픽스 불필요)
- ❌ 결과: `/SAX::onboarding` (이중 콜론 발생)

## CLAUDE.md 업데이트

새 커맨드 생성 후 반드시 Commands 섹션에 추가:

```markdown
### Commands

| Command           | 역할                    | 파일                      |
| ----------------- | ----------------------- | ------------------------- |
| /SAX:new-command  | 커맨드 설명             | `commands/SAX/new-command.md` |
```

## .claude/ 동기화

```bash
# SAX commands 동기화
rsync -av --delete \
  sax/packages/sax-po/commands/SAX/ \
  .claude/commands/SAX/

# CLAUDE.md 동기화
rsync -av \
  sax/packages/sax-po/CLAUDE.md \
  .claude/CLAUDE.md
```

## SAX Message

```markdown
[SAX] Skill: create-command 사용

[SAX] Reference: Claude Code slash command 규칙 준수
```

## Related

- [Commands 섹션](../../CLAUDE.md#commands)
- [기존 SAX Commands](../../commands/SAX/)
- [Claude Code Slash Commands](https://code.claude.com/docs/en/slash-commands)
