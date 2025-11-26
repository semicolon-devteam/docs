# SAX Package Selector (docs 레포 전용)

> docs 레포지토리에서 SAX 패키지를 자동 선택하는 진입점

## 패키지 선택 규칙

### SAX-Meta 활성화

**트리거**: 메시지 첫 줄이 `Semicolon AX` 또는 `SAX` 단독으로 시작하고, 두 줄 띄운 경우

**예시**:
```
Semicolon AX

Agent 추가해줘
```

```
SAX

새 버전 릴리스해줘
```

**동작**:
```markdown
[SAX] System: SAX-Meta 패키지 활성화

[이후 SAX-Meta CLAUDE.md 컨텍스트로 동작]
```

### SAX-PO 활성화 (기본값)

**트리거**: 위 조건이 아닌 모든 경우 (기존 동작 방식)

**예시**:
```
Epic 생성해줘
```

```
Draft Task 만들어줘
```

**동작**:
```markdown
[SAX] System: SAX-PO 패키지 활성화

[이후 SAX-PO CLAUDE.md 컨텍스트로 동작]
```

## 패키지 구조

```
.claude/
├── CLAUDE.md          # 이 파일 (패키지 선택 로직)
├── sax-po/            # PO/기획자용 SAX 패키지
│   ├── CLAUDE.md
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   └── templates/
└── sax-meta/          # SAX 개발자용 SAX 패키지
    ├── CLAUDE.md
    ├── agents/
    └── skills/
```

## 구현 로직

**Claude Code는 다음과 같이 동작합니다**:

1. **메시지 파싱**:
   - 첫 줄 확인: `^(Semicolon AX|SAX)$`
   - 두 줄 띄우기 확인: 첫 줄 이후 빈 줄 2개

2. **패키지 선택**:
   - 조건 충족 → `.claude/sax-meta/CLAUDE.md` 로드
   - 조건 불충족 → `.claude/sax-po/CLAUDE.md` 로드 (기본값)

3. **시스템 메시지 출력**:
   ```markdown
   [SAX] System: {선택된 패키지} 패키지 활성화
   ```

4. **컨텍스트 전환**:
   - 선택된 패키지의 CLAUDE.md를 프로젝트 컨텍스트로 적용
   - 해당 패키지의 agents/, skills/ 등 활성화

## 동기화 규칙

docs 레포지토리에서 SAX 패키지 작업 시:

### SAX-PO 변경 시

```bash
# SAX-PO 소스 → .claude/sax-po/ 동기화
rsync -av --delete --exclude='.git' \
  sax/packages/sax-po/ \
  .claude/sax-po/
```

### SAX-Meta 변경 시

```bash
# SAX-Meta 소스 → .claude/sax-meta/ 동기화
rsync -av --delete --exclude='.git' \
  sax/packages/sax-meta/ \
  .claude/sax-meta/
```

### 동기화 트리거

- SAX-PO 또는 SAX-Meta의 CLAUDE.md, agents/, skills/, commands/, templates/ 변경 시
- 버저닝 작업 후 (VERSION, CHANGELOG 업데이트 후)
- 커밋 직전

## References

- [SAX-PO Package](.claude/sax-po/CLAUDE.md)
- [SAX-Meta Package](.claude/sax-meta/CLAUDE.md)
- [SAX Core - Principles](https://github.com/semicolon-devteam/docs/blob/main/sax/core/PRINCIPLES.md)
- [SAX Changelog Index](https://github.com/semicolon-devteam/docs/blob/main/sax/CHANGELOG/INDEX.md)
