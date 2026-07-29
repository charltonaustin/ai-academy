# Chapter 07: Context Management Through Prompt Design

**Part 2: Advanced Patterns**
**When to read:** When working with large tasks or complex features

---

## Overview

How prompt specificity and task breakdown directly impact context usage and execution quality.

---

## 1. Theory: Context as a Limited Resource

### What Is Context?

**Context = Everything Claude needs to remember during a conversation:**

- Your messages
- Claude's responses
- Files read
- Code explored
- Research conducted
- All accumulated information

**Context limits:**

- Claude has a maximum context window (e.g., 200K tokens)
- As context fills → responses slower, less effective
- Eventually hits limit → must start new session

### Why Context Management Matters

**Poor context management:**

```
Large vague task → Claude reads 50 files → 30K tokens → slower responses
```

**Good context management:**

```
Focused specific task → Claude reads 5 files → 3K tokens → fast, effective
```

**Impact:** 10x difference in context usage from prompt design alone.

---

## 2. Evidence: Prompt Specificity Impact

### Experiment: Same Feature, Different Prompts

**Vague prompt:**

```
"Make authentication work"
```

**What Claude does:**

- Explores: What auth exists? What's the tech stack? What patterns?
- Reads: 20+ files to understand current state
- Researches: Auth libraries, best practices
- Context accumulated: 25K tokens
- Time: 45 minutes

**Specific prompt:**

```
"Add JWT login endpoint to src/auth/auth.controller.ts that:
- Accepts email/password
- Uses existing AuthService.validateUser()
- Returns JWT token using existing JwtService
- Returns 401 if credentials invalid"
```

**What Claude does:**

- Reads: auth.controller.ts, auth.service.ts, jwt.service.ts (3 files)
- Implements: Based on existing patterns
- Context accumulated: 4K tokens
- Time: 15 minutes

**Result:** Specific prompt used 84% less context, 3x faster execution.

---

## 3. Protocol: Context Management Techniques

### Technique 1: Specific Prompts (Most Important)

**Vague → Specific transformation:**

**❌ Vague:**

- "Fix the bugs"
- "Make it work"
- "Improve performance"
- "Add authentication"

**✅ Specific:**

- "Fix TypeError on line 45 of user.service.ts where firstName is undefined"
- "Add email validation to registration form (check @ symbol, reject if missing)"
- "Add database index on users.email field (currently causing slow login queries)"
- "Add POST /api/auth/login endpoint that validates credentials and returns JWT token"

**Why specificity helps:**

- Claude knows exactly what to do (no exploration needed)
- Reads only relevant files (not entire codebase)
- Less context used (focused work)
- Faster execution (no guessing)

### Technique 2: Break Large Tasks Down

**One large prompt (high context):**

```
"Build complete authentication system with login, registration,
password reset, email verification, and OAuth"
```

**Context impact:**

- Reads entire auth codebase
- Researches all auth patterns
- Implements everything at once
- 40K+ tokens context

**Multiple focused prompts (low context each):**

```
Task 1: "Add JWT login endpoint to auth.controller.ts"
Task 2: "Add registration endpoint with email/password validation"
Task 3: "Add password reset flow with email token"
Task 4: "Add email verification on registration"
Task 5: "Add Google OAuth using Passport.js"
```

**Context impact per task:**

- 3-5K tokens each
- Fresh context for each task
- Total time might be similar
- Quality higher (focused work)

### Technique 3: Point to Specific Files

**Vague:**

```
"Understand how authentication works in this codebase"
```

**Claude reads:** 30+ files searching for auth code

**Specific:**

```
"Read src/auth/auth.service.ts and src/auth/jwt.strategy.ts
to understand our JWT authentication implementation"
```

**Claude reads:** 2 files (the ones you specified)

**Context savings:** 90%

### Technique 4: Limit Scope Explicitly

**Open-ended:**

```
"Improve the dashboard"
```

**What Claude might do:**

- Redesign entire UI
- Refactor all components
- Add new features
- Unlimited scope → massive context

**Scope-limited:**

```
"Add loading spinner to dashboard while the API request runs.
Don't refactor existing components, just add loading state."
```

**What Claude does:**

- Focused change (loading spinner only)
- Doesn't explore unrelated code
- Limited context usage

### Technique 5: Session Handoffs

**Instead of one long session:**

```
Day 1: Start auth (50K tokens accumulated)
Day 2: Continue auth (another 40K) → approaching limit
Day 3: Can't continue (context full)
```

**Use session handoffs:**

```
Day 1: Implement login (create handoff)
Day 2: New session, load handoff, implement registration
Day 3: New session, load handoff, implement OAuth
```

**Each session:** Fresh context, focused work

**Covered in Day 2:** Session handoffs using `/handoff` command

### Technique 6: Sub-Agents (Agent Uses This)

**Agent decides to use sub-agents:**

```
Agent: "I need to explore 20 authentication files. I'll launch
a sub-agent to return a summary rather than loading all 20 files
into my main context."

Sub-agent: Explores → Returns summary (1K tokens)
Agent: Implements using summary (context stayed lean)
```

**When agent uses this:** Automatically when beneficial (large exploration, research synthesis)

**See:** Chapter 05 (Sub-Agents) for complete patterns

---

## 4. Practice: Analyzing Your Prompts

### Exercise: Evaluate Prompt Specificity

**For each prompt, ask:**

1. **Can Claude start immediately, or must it explore first?**
    - Start immediately → Good specificity
    - Must explore → Add more specificity

2. **How many files will Claude need to read?**
    - 1-5 files → Focused prompt
    - 10+ files → Too vague, add specificity

3. **Is the scope bounded?**
    - Clear limits → Good
    - Open-ended → Add boundaries

### Rewrite Exercise

**Transform vague → specific:**

**Vague:** "Add user management"

**Specific:** "Add GET /api/users endpoint to users.controller.ts that:

- Returns array of users from database
- Requires admin role (use existing RoleGuard)
- Returns users with: id, email, firstName, lastName (exclude password)
- Add unit test to users.controller.spec.ts"

**Analysis:**

- Before: Claude would explore entire users module (10+ files)
- After: Claude reads users.controller.ts, users.service.ts, role.guard.ts (3 files)
- Context savings: 70%

---

## 5. Examples: Context-Efficient Prompts

### Example 1: Bug Fix

**❌ High context:**

```
"The dashboard is broken, fix it"
```

Claude must:

- Explore all dashboard code
- Test in browser
- Debug issues
- 20+ files, 15K tokens

**✅ Low context:**

```
"In src/app/dashboard/dashboard.component.ts line 42, firstName is undefined
because the API response returns first_name. Update the endpoint or component
to use consistent field naming."
```

Claude:

- Reads dashboard.component.ts, sees the query
- Makes targeted fix
- 2 files, 1K tokens

**Context savings:** 93%

### Example 2: New Feature

**❌ High context:**

```
"Add analytics to the app"
```

Claude must:

- Define what "analytics" means
- Explore where to add it
- Research analytics libraries
- Massive exploration

**✅ Low context:**

```
"Add ConversionWidget component to src/app/components/widgets/ that:
- Displays conversion rate from GET /analytics
- Imports into dashboard.component.ts in main content grid
- Shows: 'Conversion Rate: X%' with percentage from backend
- Use existing widget styling pattern from engagement-widget.component.ts"
```

Claude:

- Reads engagement-widget.component.ts (pattern reference)
- Reads dashboard.component.ts (integration target)
- Implements focused component
- 5 files, 4K tokens

**Context savings:** 85%

### Example 3: Infrastructure Setup

**❌ High context:**

```
"Set up the project"
```

**✅ Low context:**

```
"Create docker-compose.yml with PostgreSQL 18 on port 5433.
Create npm run setup script that creates database and runs migrations.
Use .env.example for DATABASE_URL template."
```

**Why specific helps:**

- Exact infrastructure specified
- No research needed
- Focused implementation

---

## Context Management Strategies Summary

### You Control (Engineer-Level)

1. **Write specific prompts** (biggest impact)
    - Specify files, functions, exact behavior
    - Provide context Claude needs
    - Limit scope explicitly

2. **Break large tasks down**
    - Multiple focused prompts
    - Fresh context for each
    - Better quality per task

3. **Point to specific files**
    - Direct Claude to relevant code
    - Avoid broad exploration
    - Massive context savings

4. **Use session handoffs**
    - Fresh sessions for large features
    - Context reset between phases
    - Maintain continuity through handoffs (covered in Day 2)

### Agent Controls (Agent-Level)

5. **Sub-agents** (when warranted)
    - Agent decides to isolate exploration
    - Automatic optimization
    - You see slower execution, higher quality
    - See Chapter 05 for complete sub-agent patterns

---

## The Relationship: Context Management ⊃ Sub-Agents

**Context management** is the broader discipline of using limited context effectively.

**Sub-agents** are ONE technique (used by agents, not you).

**You manage context through:**

- Prompt specificity (biggest lever)
- Task breakdown (second biggest)
- Pointing to specific files
- Session handoffs (Day 2 orchestration partner)

**Agents manage context through:**

- Sub-agents (when exploration heavy - Chapter 05)
- Focused file reading
- Strategic research

**Both levels matter.** You set the stage with focused prompts, agents optimize execution.

---

## Key Takeaways

- [ ] Context is a limited resource (manage it strategically)
- [ ] Specific prompts use 80-90% less context than vague prompts
- [ ] Breaking tasks down enables fresh context per task
- [ ] Pointing to specific files prevents broad exploration
- [ ] Session handoffs reset context (see Day 2 orchestration partner)
- [ ] Sub-agents are what agents use (you use focused prompts - see Chapter 05)
- [ ] Context management = ALL techniques (sub-agents is just one)

---

**Related Chapters:**

- Chapter 05: Sub-Agents and the Task Tool
- Chapter 06: Custom Slash Commands
- Day 2: Session Handoffs and Orchestration Partner
