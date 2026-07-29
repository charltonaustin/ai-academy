# Chapters: Deep-Dive Learning Material

**What:** Educational chapters for understanding orchestration concepts deeply

**When:** Referenced from companion guides for deeper exploration

**Think:** Reference manual (read as needed, not necessarily sequential)

---

## Available Chapters

### Core Concepts

**01. Orchestration Mindset**

- Why systematic orchestration matters
- Strategic vs tactical thinking
- Discovery-first approach

**02. Two-Tier Testing**

- Unit tests WITH mocks (isolation)
- Integration tests WITHOUT mocks (cross-layer)
- Why both are critical

**03. Validation Gates**

- The 5 mandatory gates
- TypeScript, ESLint, Tests, Processes, Manual testing
- When feature is truly complete

**04. MCP Servers**

- What MCP servers are
- When to use which servers
- Installation and configuration

### Advanced Patterns

**05. Sub-Agents**

- What sub-agents are (agent-level optimization)
- When they help (large codebases, research)
- How to use them effectively
- Trade-offs (slower but higher quality)

**06. Custom Slash Commands**

- Creating reusable workflow automation
- Slash command structure
- Brownfield repo-specific commands
- Team collaboration through commands

**07. Context Management**

- Managing agent context effectively
- Preventing context bloat
- Session handoff strategies
- Prompt design for clarity

**08. Deterministic Gates — Hardening the Repository**

- Moving gates from prompt discipline to repo enforcement
- Versioned git hooks (`.githooks/` + `core.hooksPath`)
- Claude Code lifecycle hooks: blocking gate bypasses deterministically
- The assertion-count guard and escape hatches that leave a paper trail
- Custom budget gates: ratcheting debt downward, containing exceptions from LLM uniformity bias
- The Stop hook: evidence before exit
