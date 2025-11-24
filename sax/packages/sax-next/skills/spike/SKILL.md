---
name: spike
description: Prototype and explore technical approaches when implementation path is unclear. Creates spike branches, implements 2-3 alternatives, measures and compares, documents findings, and recommends best approach. Used by agents when technical uncertainty exists.
---

# Spike Skill

**Purpose**: Systematic technical exploration and evidence-based recommendation

## When to Use

Agents should invoke this skill when:

- Multiple valid technical approaches exist
- Performance characteristics unknown
- Integration complexity unclear
- New technology/library evaluation needed
- Risk mitigation requires prototyping
- plan.md indicates technical uncertainty

## What It Does

Executes systematic exploration workflow:

### **1. Understand the Problem**

- Extract technical decision from topic
- Ask clarifying questions:
  - Primary Goal: Performance / DX / Maintainability / Cost?
  - Constraints: Bundle size / Browser compatibility / Budget?
  - Timeline: Quick prototype / Thorough evaluation?
  - Integration: Existing tech stack requirements?

### **2. Create Spike Branch**

```bash
git checkout -b spike/[topic-name]
```

- `spike/` prefix (NOT `feature/`)
- Descriptive topic name
- Temporary branch (deleted after)

### **3. Define Approaches**

- Identify 2-3 approaches to evaluate
- Document hypothesis for each
- Define evaluation criteria:
  - Performance (latency, throughput, resources)
  - Complexity (LOC, learning curve)
  - Maintainability (docs, community)
  - Integration (stack compatibility)
  - Cost (if applicable)

### **4. Implement Prototypes**

- Create `spike-prototypes/[approach-name]` directories
- Implement minimal viable prototypes
- Time-box each prototype (1-2 hours max)
- Measure key metrics:
  - Setup time
  - Lines of code
  - Dependencies added
  - Performance (latency, bundle size, memory)
  - Developer experience (learning curve, type safety)

### **5. Comparative Analysis**

- Create comprehensive comparison table
- Identify winners by category
- Document trade-offs

### **6. Risk Assessment**

- Technical risks for each approach
- Mitigation strategies
- Long-term concerns (vendor lock-in, scalability, breaking changes)

### **7. Document Findings**

- Create `docs/spikes/[topic-name].md`
- Permanent documentation for future reference
- Includes:
  - Problem statement
  - Approaches evaluated
  - Implementation notes
  - Comparative analysis
  - Risk assessment
  - **Recommendation with rationale**
  - Implementation guidance
  - Code samples

### **8. Present Recommendation**

- Clear summary to agent
- Primary recommendation
- Alternative recommendation (if primary blocked)
- Next steps

## Usage

```javascript
// Agent invokes this skill
skill: spike("realtime-tech-evaluation");

// With focus area
skill: spike("state-management", { focus: "performance" });

// With approach count
skill: spike("oauth-providers", { approaches: 3 });

// Quick spike (time-boxed)
skill: spike("image-optimization", { quick: true });
```

## Output Format

```markdown
# ✅ Spike Complete: Real-time Technology Evaluation

## 🏆 Recommendation: Server-Sent Events (SSE)

**Why this approach**:

1. Simpler implementation (35% less code than WebSocket)
2. Better browser compatibility
3. Lower resource usage

**Trade-offs**:

- Unidirectional only (acceptable for our use case)

**Performance**: 200ms latency, +15KB bundle
**Complexity**: Easy learning curve
**Risk**: Low - mature spec

## 📊 Comparison Summary

| Approach  | Performance | Complexity | Maintainability | Overall       |
| --------- | ----------- | ---------- | --------------- | ------------- |
| **SSE**   | Good        | Simple     | Excellent       | **WINNER** ⭐ |
| WebSocket | Excellent   | Complex    | Good            | Runner-up     |
| Polling   | Fair        | Simple     | Good            | Fallback      |

## 📝 Full Documentation

`docs/spikes/realtime-tech-evaluation.md`

## 🚀 Next Steps

Use recommendation in spec:
skill:spec("Add real-time notifications using Server-Sent Events")

## 🧹 Spike Cleanup

**Keep**: docs/spikes/realtime-tech-evaluation.md
**Delete**: spike-prototypes/, spike/realtime-tech-evaluation branch
```

## Common Spike Scenarios

### Real-time Communication

- **Approaches**: WebSocket vs SSE vs Polling
- **Metrics**: Latency, resource usage, browser compatibility
- **Duration**: 2-3 hours

### State Management

- **Approaches**: Zustand vs Jotai vs Redux Toolkit
- **Metrics**: Bundle size, boilerplate, DevX
- **Duration**: 1-2 hours

### Image Optimization

- **Approaches**: next/image vs Cloudinary vs ImageKit
- **Metrics**: Performance, cost, features
- **Duration**: 2-3 hours

### Authentication

- **Approaches**: NextAuth vs Supabase Auth vs custom
- **Metrics**: Security, features, maintenance
- **Duration**: 3-4 hours

## Spike Documentation Template

```markdown
# Spike: [Topic Name]

**Date**: [date]
**Status**: Complete
**Recommendation**: [Approach X]

## Problem Statement

[Technical decision needed]

## Approaches Evaluated

[2-3 approaches with hypotheses]

## Implementation Notes

[Metrics for each approach]

## Comparative Analysis

[Comparison table]

## Risk Assessment

[Risks and mitigations]

## Recommendation

**Primary**: [Approach X]
**Rationale**: [3 reasons with evidence]
**Trade-offs**: [Why acceptable]

## Implementation Guidance

[Dependencies, file structure, integration, testing]

## Prototype Code Samples

[Key code from recommended approach]

## References

[Documentation, discussions, benchmarks]
```

## Dependencies

- Git (branch creation/cleanup)
- File system (prototype creation)
- Benchmark tools (performance measurement)

## Related Skills

- `spec` - Use recommendation in specification
- `implement` - Implement recommended approach
- `verify` - Validate implementation

## Constitution Compliance

- Evidence-based decision making
- Documentation for future reference
- Risk assessment and mitigation

## Critical Rules

1. **Spike Branches are Temporary**: NEVER merge to main
2. **Prototype, Don't Perfect**: Minimal viable implementation
3. **Measure Everything**: Performance, bundle size, complexity metrics mandatory
4. **Evidence-Based Recommendations**: NEVER recommend without data
5. **Document for Future**: Spike docs are permanent

## Error Handling

If spike execution fails:

1. Report failure to agent
2. Provide diagnostic information
3. Suggest remediation
4. Agent decides retry or alternative approach

## Return Values

```javascript
{
  status: "complete" | "failed",
  recommendation: {
    primary: "Approach X",
    rationale: ["reason 1", "reason 2", "reason 3"],
    tradeoffs: "description",
    alternative: "Approach Y (if primary blocked)"
  },
  documentationPath: "docs/spikes/[topic].md",
  nextSteps: "Use in spec or implement"
}
```

## Cleanup Process

After spike completion:

1. **Keep**:
   - `docs/spikes/[topic].md` (permanent)

2. **Optional Delete** (after implementation):
   - `spike-prototypes/` directory
   - `spike/[topic]` branch

3. Agent confirms cleanup with user
