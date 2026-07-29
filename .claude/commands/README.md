# Claude Code Slash Commands

Custom slash commands for AI Orchestration Mastery course workflow.

---

## Available Commands

### 1. `/orchestration [handoff-file-path]`

**Purpose:** Initialize orchestration partner for feature delivery and strategic planning

**Usage:**

```bash
# Start any session
/orchestration

# With handoff file for session continuation
/orchestration .claude/orchestration/meta/session-handoffs/2025-10-01-feature-handoff.md
```

**What It Does:**

- Loads complete proven pattern library
- Creates organized workspace structure (execution plans, agent prompts, retrospectives)
- Compound learning (reads previous feature retrospectives)
- Creates complete agent prompts with all protocols
- Analyzes coordination requirements
- Applies strategic orchestration
- Guides pre-execution validation

**Use When:**

- Starting any feature work (course or production)
- Creating agent prompts
- Analyzing coordination requirements
- Continuing features across sessions
- Applying methodology to any codebase

---

### 2. `/handoff [feature-id]`

**Purpose:** Create a comprehensive handoff file for seamless session continuation

**Usage:**

```bash
# When closing current session
/handoff f04

# Creates: .claude/orchestration/meta/session-handoffs/2025-10-01-f04-handoff.md
```

**What It Does:**

- Documents all work completed this session
- Captures bugs/issues discovered
- Lists all files modified
- Prioritizes next steps
- Preserves critical context for continuation

**Use When:**

- Session getting long (>50 messages)
- Approaching token limits
- Natural break point (validation complete, etc.)
- Need to context-switch to different work

**Created File Contains:**

- Current state summary
- Bugs/issues with file:line references
- Key decisions made
- Next steps prioritized
- Agent execution status
- Instructions for new session continuation

---

### 3. `/validate [feature-id]`

**Purpose:** Comprehensive validation of completed agent work with learning capture

**Usage:**

```bash
# After agents report work complete
/validate f04
```

**What It Does:**

- Runs systematic validation (6 phases)
- Verifies compilation, linting, tests
- Performs code review for bug patterns
- Tests real integration (no mocks)
- Identifies bugs with root cause analysis
- Creates bug fix prompt if needed
- Updates methodology learnings
- Updates curriculum discoveries
- Creates comprehensive validation report

**Use When:**

- Agents report all tasks complete
- Ready to validate feature before next steps
- Need to capture learnings for future features

**Creates Documentation:**

1. `{FEATURE-ID}-VALIDATION-REPORT.md` - Comprehensive findings
2. `BUG-FIX-PROMPT.md` - Step-by-step fix instructions (if bugs)
3. `methodology-learnings.md` - Feature-specific insights
4. `DELIVERABLES-SUMMARY.md` - Quick reference guide
5. Updates to `.claude/curriculum/methodology-discoveries.md`

---

## Workflow Integration

### Standard Feature Development Workflow

```bash
# 1. Start session
/orchestration

# 2. Describe feature need
# Partner creates workspace structure + execution plan + agent prompts

# 3. Launch agents (copy prompts from .claude/workspace/{feature}/agent-prompts/)
# ... agents execute, log to agent-logs/, run validation gates ...

# 4. Agents complete - validate their work
/validate {feature-id}

# 5. After validation - optionally create retrospective
# Partner creates .claude/workspace/{feature}/retrospective.md

# 6. Need to close session - create handoff
/handoff {feature-id}

# 7. New session - resume with handoff
/orchestration .claude/orchestration/meta/session-handoffs/{date}-{feature}-handoff.md
```

---

## Command Design Philosophy

### Self-Documenting

Each command includes comprehensive instructions in its expansion. Claude Code knows exactly what to do.

### Context Preservation

Commands ensure no context loss between sessions through structured handoff files.

### Learning Capture

Validation command systematically captures methodology insights to improve future features.

### Efficiency

Commands automate repetitive validation and documentation tasks that would otherwise be manual.

---

## File Locations

### Commands

```
.claude/commands/
├── README.md (this file)
├── orchestration.md
├── handoff.md
└── validate.md
```

### Generated Files

**Session Handoffs:**

```
.claude/orchestration/meta/session-handoffs/
├── 2025-10-01-f04-validation-complete.md
├── 2025-10-02-f05-auth-planning.md
└── ...
```

**Feature Workspace Structure:**

```
.claude/workspace/{feature-id}/
├── execution-plan.md           # Coordination analysis, timeline, task breakdown
├── agent-prompts/              # Agent prompt files for each task
│   ├── task-0-infrastructure.md
│   ├── task-a-backend.md
│   ├── task-b-frontend.md
│   └── task-c-integration.md
├── agent-logs/                 # Session logs from agent execution
│   ├── task-0-session.md
│   ├── task-a-session.md
│   ├── task-b-session.md
│   └── task-c-session.md
├── retrospective.md            # Feature learnings, patterns, insights
├── {FEATURE-ID}-VALIDATION-REPORT.md  # From /validate
├── BUG-FIX-PROMPT.md          # From /validate (if bugs found)
├── methodology-learnings.md    # From /validate
└── DELIVERABLES-SUMMARY.md    # From /validate
```

---

## Benefits

### For Engineers

- **Organized Workspace:** Feature directories with execution plans and retrospectives
- **Compound Learning:** Read previous feature retrospectives for insights
- **No Context Loss:** Seamless session continuation with handoffs
- **Efficient Orchestration:** Strategic partner guides feature delivery
- **Pattern Application:** Apply proven methodology to any codebase
- **Quality Enforcement:** Systematic validation before claiming complete
- **Debugging Capability:** Agent logs provide execution trail

---

## Command Maintenance

### Adding New Commands

1. Create `{command-name}.md` in `.claude/commands/`
2. Follow existing command structure:
    - Front matter with description and argument hints
    - Command expansion section
    - Clear instructions
    - Usage examples
3. Update this README with new command

### Command Format

```markdown
---
description: Brief description of what command does
argument-hint: "[required-arg] [optional-arg]"
---

# /{command-name} - Full Command Name

## Command Expansion

When executed, this slash command expands to:

\`\`\`text
{Full instructions for Claude Code}
\`\`\`

## Arguments

...

## Expected Output

...

## Example Usage

...
```
