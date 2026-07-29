# Chapter 06: Custom Slash Commands

**Part 2: Advanced Patterns**
**When to read:** After understanding orchestration partner basics (Day 2)

---

## Overview

How to create reusable workflow automation through custom slash commands.

---

## 1. Theory: What Are Slash Commands?

### The Concept

**Slash commands are reusable prompts stored as files.**

When you type `/command-name` in Claude Code:

1. Claude reads `.claude/commands/command-name.md`
2. Executes the prompt content in that file
3. Returns the result

**That's it.** No magic, just file-based prompt automation.

### Why They're Valuable

**Without slash commands:**

```
Every session you need X workflow:
- Re-type the same complex prompt
- Or copy-paste from notes
- Easy to forget details
- Inconsistent execution
```

**With slash commands:**

```
Type: /workflow-name
Claude executes the full prompt automatically
Consistent every time
```

**Real examples from this course:**

`/orchestration` - Loads orchestration methodology, reads retrospectives, recovers project context

`/validate {feature-id}` - Comprehensive validation: gates + code review + integration testing + retrospective

`/handoff` - Creates continuity document for next session

---

## 2. Evidence: Slash Commands in Action

### Example 1: Orchestration Partner Initialization

**File:** `.claude/commands/orchestration.md`

**What it does:**

- Loads playbook files (coordination patterns, validation gates)
- Reads methodology documentation (testing strategies, success criteria)
- Recovers project context (retrospectives, conventions, infrastructure)
- Sets up orchestration partner role

**Without slash command:**
You'd have to manually:

1. Tell Claude to read 10+ documentation files
2. Explain orchestration partner role
3. Specify which patterns to apply
4. Hope you remembered everything

**With slash command:**

```bash
/orchestration
```

Done. All context loaded automatically.

### Example 2: Feature Validation

**File:** `.claude/commands/validate.md`

**What it does:**

- Runs all 5 validation gates
- Reads execution plan and agent logs
- Compares plan vs reality
- Performs code review for common gotchas
- Creates bug fix prompts if issues found
- Updates retrospective with findings

**Without slash command:**
You'd manually guide Claude through 6 validation phases, easy to skip steps.

**With slash command:**

```bash
/validate ai-lead-summaries
```

Comprehensive validation happens systematically.

---

## 3. Protocol: Creating Your Own Slash Commands

### Basic Structure

**Minimum viable slash command:**

```markdown
This is the prompt that executes when you type /my-command.

Claude will read this entire file and execute it.
```

**File location:** `.claude/commands/my-command.md`

**Usage:** `/my-command`

### Adding Metadata (Optional but Recommended)

**Front matter provides description and arguments:**

```markdown
---
description: Brief description shown in command list
argument-hint: '[optional-arg] (required-arg)'
---

Your prompt content here.

You can reference the argument in your prompt using {arg-name}.
```

**Benefits:**

- Description shows in `/help` command list
- Argument hints guide usage
- Self-documenting commands

### Command Examples

**Example 1: Simple workflow automation**

**File:** `.claude/commands/quick-review.md`

```markdown
---
description: Quick code review of recent changes
---

Perform a quick code review of recent changes:

1. Run `git diff main` to see changes
2. Check for common issues:
    - Console.log statements
    - TODO comments
    - Obvious bugs
    - Missing error handling
3. Report findings briefly
```

**Usage:** `/quick-review`

**Example 2: Command with arguments**

**File:** `.claude/commands/analyze-feature.md`

```markdown
---
description: Analyze codebase for patterns related to a feature
argument-hint: '[feature-name]'
---

Use Serena MCP to analyze patterns for: {feature-name}

Find:

- Existing implementations of similar features
- Common patterns used
- Integration points
- Testing approaches

Return a summary of discovered patterns.
```

**Usage:** `/analyze-feature authentication`

**Example 3: Multi-step workflow**

**File:** `.claude/commands/pre-pr.md`

```markdown
---
description: Pre-PR validation checklist
---

Before creating PR, validate:

1. Run all 5 validation gates:
    - TypeScript check
    - ESLint
    - Tests
    - Process cleanup
    - Manual testing verification

2. Check git status:
    - All changes committed
    - No untracked files (except .env)
    - On correct branch

3. Verify documentation:
    - README updated if needed
    - Code comments added
    - Breaking changes documented

Report: Ready for PR? Or issues to fix?
```

**Usage:** `/pre-pr`

---

## 4. Practice: Brownfield-Specific Commands

### Creating Repo-Specific Commands (Day 5 Application)

**Use case:** You work in `payment-service` repo regularly. Create command that loads repo context.

**File:** `.claude/commands/init-payment-service.md`

```markdown
---
description: Initialize orchestration partner for payment-service repo
---

You are the orchestration partner for the payment-service repository.

Load repository context:

**Repo identity:**

- Tech stack: NestJS, Stripe API, PostgreSQL
- Architecture: Microservice, event-driven
- Critical: PCI compliance, multi-tenant data isolation

**Common patterns (read from `.claude/meta/common-patterns.md`):**

- Repository pattern for database access
- Event emitters for async operations
- DTOs for all API inputs/outputs
- Guards for authentication/authorization

**Critical gotchas (read from `.claude/meta/critical-gotchas.md`):**

- MUST filter by tenantId (data isolation)
- Stripe webhooks require idempotency keys
- Never log payment details (PCI compliance)
- All currency as integers (cents, not dollars)

**Ready to create agent prompts following payment-service conventions.**
```

**Usage in payment-service repo:**

```bash
cd ~/company-code/payment-service
claude # Start Claude Code
/init-payment-service
```

Partner loads with repo-specific context immediately.

### Benefits of Repo-Specific Commands

**One-time setup, ongoing value:**

- Create command once
- Every session: instant context loading
- No rediscovering patterns
- Consistent across team

**Team collaboration:**

- Check in `.claude/commands/init-{repo}.md`
- Entire team uses same command
- New engineers onboard faster
- Knowledge compounds

---

## 5. Examples: Real-World Slash Commands

### Example 1: Feature Template Generator

**File:** `.claude/commands/new-api-endpoint.md`

```markdown
---
description: Generate prompt for new API endpoint following repo patterns
argument-hint: '[endpoint-name]'
---

Create an agent prompt for new API endpoint: {endpoint-name}

Follow established patterns:

- NestJS controller pattern
- DTO validation
- Service layer logic
- Repository for database
- Unit tests WITH mocks
- Integration tests WITHOUT mocks
- Swagger documentation

Include all validation gates and session logging.

Save prompt to: `.claude/workspace/{endpoint-name}/agent-prompts/api-endpoint.md`
```

**Usage:** `/new-api-endpoint user-preferences`

### Example 2: Debugging Workflow

**File:** `.claude/commands/debug-integration.md`

```markdown
---
description: Systematic debugging of integration issues
argument-hint: '[integration-name]'
---

Debug integration issue: {integration-name}

Use Sequential Thinking MCP to trace through:

1. Check configuration (env vars, API keys)
2. Verify network connectivity
3. Test authentication/authorization
4. Examine request/response payloads
5. Check error logs
6. Identify root cause
7. Suggest fix

Document findings systematically.
```

**Usage:** `/debug-integration stripe-webhook`

### Example 3: Code Quality Audit

**File:** `.claude/commands/audit-code-quality.md`

```markdown
---
description: Comprehensive code quality audit of recent changes
---

Audit code quality of recent work:

**Run checks:**

1. TypeScript errors
2. ESLint warnings
3. Test coverage gaps
4. Common anti-patterns (console.logs, TODOs, hard-coded values)
5. Missing error handling
6. Performance issues (N+1 queries, large bundle sizes)

**Review patterns:**

- DRY violations (code duplication)
- SOLID principle violations
- Inconsistent conventions
- Missing documentation

**Grade:** A/B/C/D with specific improvements needed
```

**Usage:** `/audit-code-quality`

---

## 6. Gotchas and Best Practices

### Gotchas

**Command naming:**

- Use kebab-case: `/my-command` ✅
- Not camelCase: `/myCommand` ❌
- Not spaces: `/my command` ❌

**File location:**

- Must be in `.claude/commands/` directory
- File name = command name (without /)
- Extension must be `.md`

**Arguments:**

- Simple arguments work: `{arg-name}`
- Complex parsing may not work as expected
- Test your commands with arguments

**Scope:**

- Commands are project-specific (`.claude/` in that repo)
- Not global across all projects
- Create per-repo as needed

### Best Practices

**Keep commands focused:**

- One clear purpose per command
- Not "do everything" mega-commands
- Composable (commands can trigger other commands)

**Document well:**

- Clear description in front matter
- Argument hints show expected usage
- Comment complex logic in prompt

**Version control:**

- Check in `.claude/commands/` directory
- Team collaborates on commands
- Commands evolve with project

**Name meaningfully:**

- `/init-{repo-name}` - Initialize orchestration for specific repo
- `/validate-{aspect}` - Validate specific aspect
- `/analyze-{target}` - Analyze specific target
- `/debug-{system}` - Debug specific system

**Test before sharing:**

- Run command multiple times
- Try with different arguments
- Verify consistent behavior
- Update based on team feedback

---

## Key Takeaways

- [ ] Slash commands = reusable prompts in `.claude/commands/` directory
- [ ] Simple structure: markdown file with prompt content
- [ ] Optional front matter: description and argument hints
- [ ] Usage: `/command-name [args]`
- [ ] Valuable for: Repetitive workflows, repo initialization, validation processes
- [ ] Team benefit: Share commands, compound knowledge, consistent practices
- [ ] Day 5 application: Create brownfield repo-specific commands

---

**Next Chapter:** Chapter 07 - Context Management Through Prompt Design

**Related:**

- Day 2: Introduction to slash commands (orchestration partner)
- Day 5: Creating brownfield slash commands for company repos
