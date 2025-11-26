---
name: health-check
description: Validate development environment and authentication status. Use when (1) new team member onboarding (triggered by /SAX:health-check), (2) orchestrator auto-runs at work start (if 30 days passed), (3) checking required tools (gh CLI, Git, Node, pnpm, Supabase), (4) verifying GitHub auth and repo access.
---

# health-check Skill

> 개발 환경 및 인증 상태 자동 검증

## 역할

신규/기존 팀원의 개발 환경을 자동으로 검증하여 SAX 사용 준비 상태를 확인합니다.

## 트리거

- `/SAX:health-check` 명령어
- "환경 확인", "도구 확인", "설치 확인" 키워드
- onboarding-master Agent에서 자동 호출
- orchestrator가 업무 시작 시 자동 실행 (30일 경과 시)

## Quick Start

```bash
# 필수 도구 설치 확인
gh --version && git --version && node --version && pnpm --version && supabase --version

# GitHub 인증 상태 확인
gh auth status

# Organization 멤버십 확인
gh api user/orgs --jq '.[].login' | grep semicolon-devteam

# SAX 메타데이터 확인
cat ~/.claude.json | jq '.SAX'
```

**기대 결과**:

- ✅ 모든 필수 도구 설치됨
- ✅ GitHub 인증 완료
- ✅ semicolon-devteam 멤버십 확인
- ✅ SAX 메타데이터 존재

## Advanced Usage

상세한 검증 항목과 워크플로우는 다음을 참조하세요:

- **[Validation Items](references/validation-items.md)** - 4가지 검증 카테고리 (도구, 인증, Slack, claude.json)
- **[Output Formats](references/output-formats.md)** - 성공/실패 시 출력 예제
- **[Workflow](references/workflow.md)** - 실행 흐름 및 재검증 정책

## SAX Message

```markdown
[SAX] Skill: health-check 사용

[SAX] Reference: 개발 환경 검증 (도구/인증/조직) 완료
```

## Related

- [SAX Core MESSAGE_RULES.md](https://github.com/semicolon-devteam/docs/blob/main/sax/core/MESSAGE_RULES.md)
- [Claude Code Settings](https://code.claude.com/docs/en/settings)
- [onboarding-master Agent](../../agents/onboarding-master.md)
