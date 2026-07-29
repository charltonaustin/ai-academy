# Agent Logging Templates - Copy/Paste Ready

## Template 1: Infrastructure Agent Log

```markdown
# Infrastructure Setup Session Log

## Session Info

- **Start Time:** [timestamp]
- **Agent Role:** Infrastructure setup and environment preparation
- **Dependencies:** None (runs first)
- **Expected Outputs:** Working dev environment, database setup, scripts functional

## Decision Log

### [Timestamp] - Technology Stack Selection

**Context:** Need to choose specific versions and tools for project foundation
**Options Considered:**

- NestJS versions, database tools, etc.
  **Decision Made:**
  **Assumptions:** Future agents will use these exact versions
  **Risk Assessment:** Version mismatches could break parallel agent work

### [Timestamp] - Setup Script Design

**Context:** Need to ensure fresh clone functionality
**Options Considered:**
**Decision Made:**
**Assumptions:**
**Risk Assessment:**

## Technical Discoveries

### [Timestamp] - [Discovery Name]

**What Was Learned:**
**Impact on Other Agents:**
**Methodology Implication:**

## Final Status

- **Completion Status:**
- **Deliverables:**
- **Integration Notes:**
- **Recommendations:**
```

## Template 2: Parallel Coordination Agent Log

```markdown
# [Agent Name] Parallel Session Log

## Session Info

- **Start Time:** [timestamp]
- **Agent Role:** [specific responsibility - frontend/backend/api/etc]
- **Dependencies:** [what this agent needs from other parallel agents]
- **Expected Outputs:** [what other parallel agents expect from this agent]

## Decision Log

### [Timestamp] - [Critical Decision Point]

**Context:**
**Options Considered:**
**Decision Made:**
**Assumptions:** [CRITICAL - what does this assume about other agents' work?]
**Risk Assessment:**

## Coordination Events

### [Timestamp] - Interface Definition

**Agent Involved:** [which parallel agent this affects]
**Coordination Need:** [what interface/contract was established]
**Resolution:** [how the interface was defined]
**Success/Failure:**
**Learning:**

### [Timestamp] - Shared Resource Usage

**Agent Involved:**
**Coordination Need:**
**Resolution:**
**Success/Failure:**
**Learning:**

## Blockers & Solutions

### [Timestamp] - [Blocker Name]

**Blocker Description:**
**Root Cause:** [why this blocker occurred - coordination failure?]
**Solution Applied:**
**Prevention Strategy:**

## Final Status

- **Completion Status:**
- **Deliverables:**
- **Integration Notes:** [CRITICAL for validation and retrospective]
- **Recommendations:**
```

## Template 3: Sequential Task Agent Log

```markdown
# [Agent Name] Sequential Session Log

## Session Info

- **Start Time:** [timestamp]
- **Agent Role:** [specific responsibility]
- **Dependencies:** [previous sequential step completed]
- **Expected Outputs:** [what this enables for next step]

## Decision Log

### [Timestamp] - [Decision Point]

**Context:**
**Options Considered:**
**Decision Made:**
**Assumptions:**
**Risk Assessment:**

## Technical Discoveries

### [Timestamp] - [Discovery]

**What Was Learned:**
**Impact on Future Steps:**
**Methodology Implication:** [what this teaches about sequencing]

## Final Status

- **Completion Status:**
- **Deliverables:**
- **Integration Notes:**
- **Recommendations:**
```

## Copy-Paste Prompt Addition for Agent Instructions

Add this to ANY feature-building agent prompt:

```markdown
**LOGGING REQUIREMENT:**

You MUST maintain a session log as you work. Create a file:
`.claude/workspace/[feature]/agent-logs/[your-agent-name]-session.md`

Use the appropriate logging template from `.claude/methodology/logging-templates.md` and update it throughout your session, especially when:

- Making technology choices that affect other agents
- Discovering integration requirements
- Encountering blockers or coordination challenges
- Learning something new about parallel vs sequential execution

This log will be used by orchestration partner for validation and retrospective analysis. Be thorough - your execution insights help improve future features.
```

## Quick Implementation Guide

1. **For All Features:** Add logging requirement to all agent prompts
2. **Create Log Directory:** `.claude/workspace/[feature]/agent-logs/`
3. **Copy Template:** Agents copy appropriate template and fill in real-time
4. **Validation & Retrospective:** Orchestration partner uses logs for:
    - Systematic validation (find bugs, verify completion)
    - Retrospective analysis (what worked, what didn't)
    - Debugging support (when agents get stuck)
    - Pattern recognition (improve future prompts)

This gives orchestration partner the detailed execution data needed for quality validation and compound learning.
