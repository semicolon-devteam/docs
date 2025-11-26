# assign-project-label Skill

> Epic에 프로젝트 라벨 부여 및 GitHub Projects 연결

## Purpose

Epic 생성/이식 시 프로젝트 라벨을 자동 할당하고 GitHub Projects 보드에 연결합니다.

## Process

### 1. 프로젝트 확인

**대화형 질문**:
```markdown
이 Epic은 어느 프로젝트에 속하나요?

1. 오피스 (cm-office)
2. 랜드 (cm-land)
3. 정치판 (cm-politics)
4. 코인톡 (cm-cointalk)
5. 기타 (직접 입력)
```

### 2. 프로젝트 라벨 부여

```bash
# Epic Issue에 프로젝트 라벨 추가
gh api repos/semicolon-devteam/docs/issues/{epic_number}/labels \
  -f labels[]="epic" \
  -f labels[]="{project_label}"
```

**프로젝트 라벨 매핑**:
- 오피스 → `오피스`
- 랜드 → `랜드`
- 정치판 → `정치판`
- 코인톡 → `코인톡`

### 3. GitHub Projects 연결

```bash
# Semicolon 팀 Project #1 ('이슈관리')에 Epic 추가
# Step 1: Project ID 조회
PROJECT_ID=$(gh api graphql -f query='
  query {
    organization(login: "semicolon-devteam") {
      projectV2(number: 1) {
        id
      }
    }
  }
' --jq '.data.organization.projectV2.id')

# Step 2: Epic Issue의 Node ID 조회
ISSUE_NODE_ID=$(gh api repos/semicolon-devteam/docs/issues/{epic_number} \
  --jq '.node_id')

# Step 3: Project에 Epic 추가
gh api graphql -f query='
  mutation {
    addProjectV2ItemById(input: {
      projectId: "'$PROJECT_ID'"
      contentId: "'$ISSUE_NODE_ID'"
    }) {
      item {
        id
      }
    }
  }
'
```

## Output Format

```markdown
✅ **프로젝트 라벨 및 Projects 연결 완료**

**Epic**: #{epic_number}
**프로젝트**: {project_name}
**라벨**: `{project_label}`
**GitHub Projects**: #1 이슈관리 보드에 추가됨
```

## SAX Message

```markdown
[SAX] Skill: assign-project-label 사용

[SAX] Reference: GitHub Projects API 참조
```

## Error Handling

### 프로젝트 미선택

```markdown
⚠️ **프로젝트 선택 필요**

Epic에 프로젝트 라벨을 부여하려면 프로젝트를 선택해주세요.
```

### GitHub Projects API 오류

```markdown
⚠️ **Projects 연결 실패**

{error_message}

**수동 연결 방법**:
1. https://github.com/orgs/semicolon-devteam/projects/1 접속
2. Epic #{epic_number} 수동 추가
```

## Related

- [epic-master Agent](../../agents/epic-master.md)
- [detect-project-from-epic Skill](../detect-project-from-epic/SKILL.md)
- [create-epic Skill](../create-epic/skill.md)
