# Sub-Agent Usage: Quick Operational Guide

**What:** Agent spawns focused sub-tasks using Task tool for context isolation

**When:** Agent decides autonomously, or you request explicitly

---

## Quick Decision Framework

**Agent uses sub-agents when:**

- Large codebase exploration (>10 files to understand)
- Research synthesis (needs to study docs/approaches)
- Context getting heavy (>50K tokens accumulated)

**Agent avoids sub-agents when:**

- Simple tasks (1-2 files, straightforward logic)
- Small codebases (<10K lines)
- Tight integration needed (debugging, iterative work)

---

## How to Use

### Explicit Request

```
"Use a sub-agent to explore the authentication code
and return a summary of existing patterns"
```

### Let Claude Decide

```
"Implement authentication"
(Claude decides if sub-agent helpful)
```

### Monitor Sub-Agents

```bash
/agents  # See running sub-agents
```

---

## Trade-Off

**Slower:** ~30% execution overhead (1-3 min per sub-agent launch)

**Higher quality:** Better pattern discovery, focused context

**Worth it when:** Quality > speed (large codebases, complex features)

---

**Complete guide:** guidebook/chapters/15-sub-agents.md

**Context strategies:** guidebook/chapters/16-context-management.md
