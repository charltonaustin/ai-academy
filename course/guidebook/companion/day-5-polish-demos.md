# Day 5: Brownfield Mini-Hackathon

**Session 05 of 5**

**Today's Goal:** Apply orchestration methodology to YOUR company codebase - build something real

**Hackathon format:** Investigate → Plan → Build → Showcase

---

## If You're Behind on Course Features (Catch Up First)

**Before the hackathon, ensure core features are working:**

Check what's missing from Days 1-4:

- [ ] Infrastructure + CRUD (Day 1)
- [ ] AI summaries, scoring, recommendations (Day 2)
- [ ] JWT authentication (Day 3)
- [ ] WebSocket notifications (Day 3)
- [ ] Mobile app foundation (Day 4)

**If missing critical features:**

- Spend morning completing them
- Join hackathon after core complete
- OR participate in hackathon anyway (investigation is valuable even without building)

**If all core features complete:**

- Jump straight into hackathon
- Full day to work on company code

---

## Brownfield Mini-Hackathon: Build Something You Care About

### The Challenge: Build Something Real in Your Company Codebase

**This week:** You mastered orchestration in greenfield (fresh CRM, clean slate, you made all the decisions)

**Today:** Apply what you learned to brownfield (real company code, existing patterns, other engineers' conventions)

**Your mission:** Pick a small feature you've been wanting to build in your company codebase and make real progress on
it.

---

#### Choose Your Hackathon Challenge

**Pick your target repository:**

Choose a company codebase you contribute to:

- One you work in regularly (familiar enough to navigate)
- Has some mystery (not code you wrote yesterday)
- Mid-sized preferred (not tiny, not overwhelming)

**Identify your feature:**

This is YOUR hackathon. Pick something meaningful to you:

**Keep it small** (completable in 2-3 hours):

- API endpoint you've been meaning to add
- UI component or enhancement you've wanted
- Small refactoring you've thought about
- Test coverage improvement
- Bug fix you've been putting off
- Form validation addition
- Error handling enhancement

**The only requirement:** Must integrate with existing code (this is brownfield practice, not greenfield)

**Scope matters:** Pick something completable today. Goal is to experience the full cycle (investigate → plan → build →
ship), not get stuck in complex implementation.

**Pick something you'd be excited to ship tomorrow**

---

#### Phase 1: Investigation

**Don't code yet. Discover first.**

**Use Serena MCP and code reading to understand the codebase:**

**Pattern discovery questions:**

- What patterns does this repo follow for similar features?
- How is the architecture structured? (monolith, microservices, modules)
- What testing approach is standard?
- What conventions are consistent? (naming, file organization, code style)

**Integration discovery questions:**

- Where would your feature hook into existing code?
- What existing services, modules, or components would you use?
- What files would you modify vs create new?
- What dependencies exist?

**Gotcha discovery questions:**

- What breaks easily in this codebase?
- Are there performance considerations?
- Security patterns to follow?
- Multi-tenancy or data isolation concerns?
- Known technical debt affecting this area?

**Advanced: Using sub-agents for large codebase exploration**

If your company codebase is large (50K+ lines), agents can spawn **sub-agents** for focused exploration:

```
You: "Use a sub-agent to explore how our payment processing currently works,
then plan the webhook feature following those patterns."
```

Sub-agent explores, synthesizes patterns, returns summary. Main agent plans/implements with clean context.

**Learn more:** [Chapter 05: Sub-Agents](../chapters/05-sub-agents.md) - Introduced on Day 2

---

#### Phase 2: Planning

**Create your execution strategy based on what you discovered:**

**Using orchestration partner (optional):**

- Borrow from the [/.claude/orchestration](/.claude/orchestration/) and begin to create your own
  orchestration partner, custom to your repo
- Initialize in your company repo: `/orchestration`
- Describe the feature you want to build
- Let partner analyze coordination requirements
- Get execution plan following the repo's discovered patterns

**Or plan manually:**

- Sketch task breakdown
- Identify integration points
- Note which existing patterns to follow
- Flag gotchas to avoid

**Planning questions:**

- How will you break this feature into tasks?
- What order makes sense? (sequential vs parallel)
- What existing code will you modify?
- What new code will you create?
- How will you test? (match repo's approach)

**Deliverable:** Execution plan (can be formal or just notes)

---

#### Phase 3: Build

- Implement the feature following discovered patterns
- Use orchestration methodology (agents if helpful)
- Test against repo's existing test suite
- Follow repo's validation requirements

**The goal isn't completion** - it's practicing brownfield discovery and applying orchestration methodology to real
work.

---

#### Optional: Document for Your Team

**If you discovered valuable patterns:**

Consider creating `.claude/` documentation in your company repo:

**What to document:**

- `.claude/meta/repo-identity.md` - Tech stack, architecture, critical systems
- `.claude/meta/common-patterns.md` - How features are built here
- `.claude/meta/critical-gotchas.md` - Known issues to avoid
- etc.

**Value for team:**

- New engineers onboard faster
- Teammates learn from your discoveries
- AI orchestration partner can use this context
- Prevents rediscovering same patterns

**Questions to consider:**

- Would this have helped you when you joined?
- Would teammates find it useful?
- Does your team culture support this?
- Do you have authority to add it?

---

### Bonus: Create Brownfield Slash Commands (Optional)

**If you'll work in this company repo regularly:**

Consider creating a custom slash command for instant repo context loading.

**Example:** Create `/init-payment-service` that loads payment service patterns

**How to create:**

1. Create file in your company repo: `.claude/commands/init-{your-repo}.md`
2. Write prompt that loads:
    - Tech stack and architecture (from your investigation)
    - Common patterns (what you discovered)
    - Critical gotchas (what you found)
    - Team conventions (review, testing)
3. Check into git (team collaboration)
4. Use in future sessions: `/init-{your-repo}`

**Value:**

- Instant context loading (no rediscovering)
- Team knowledge sharing
- Compound learning (improves over time)

**Learn more:** [Chapter 06: Custom Slash Commands](../chapters/06-custom-slash-commands.md)

---

## Course Complete! 🎉

**By end of this week, you've built:**

- ✅ Complete CRM with CRUD operations
- ✅ AI intelligence layer (summaries, scoring, recommendations)
- ✅ Task management system
- ✅ Authentication with protected routes
- ✅ Real-time WebSocket notifications with persistence
- ✅ Installable PWA (Angular service worker)

**Technical accomplishments:**

- ✅ 7+ major features implemented
- ✅ Multi-platform (web + mobile)
- ✅ 80%+ test coverage (unit + integration)
- ✅ All 5 validation gates passing
- ✅ Production-quality application

---

**You've learned:**

**Core methodology:**

- ✅ Infrastructure-first pattern
- ✅ Coordination through convention (field naming locks, schema as contract)
- ✅ 5 validation gates (comprehensive quality standard)
- ✅ Two-tier testing strategy
- ✅ Sequential vs parallel execution analysis
- ✅ Pre-execution validation protocol
- ✅ Strategic orchestration with partner

**Transferable skills:**

- ✅ AI agent orchestration strategies
- ✅ Multi-platform development (web + mobile)
- ✅ Complex feature coordination
- ✅ Testing strategies for AI features
- ✅ Real-time systems implementation
- ✅ Strategic vs tactical execution
- ✅ Brownfield discovery patterns (investigation-first)
- ✅ Pattern matching in existing codebases
- ✅ Real company codebase application

---

**You're ready to apply this to real work:**

**From brownfield hackathon:**

- Investigation of company codebase complete
- Execution plan ready (or partially built)
- Patterns discovered and documented
- Can ship tomorrow with confidence

**The methodology transfers:**

- Same strategic thinking (discovery before building)
- Same quality standards (5 validation gates)
- Same coordination patterns (but match repo conventions)
- Serena MCP navigates existing code
- Orchestration partner adapts to any repo

**You practiced on real code** - this isn't theoretical. You explored your actual company codebase and made real
progress on a feature you care about.

---

**Congratulations on completing AI Orchestration Mastery!** 🎉

You now have systematic methodology for orchestrating AI agents on complex software development - in greenfield AND
brownfield codebases.

---

**✅ Day 5 complete - Course finished!**

**See full trail:** [Companion overview](README.md)
