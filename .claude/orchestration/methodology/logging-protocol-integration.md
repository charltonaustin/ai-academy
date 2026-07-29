# Standard Logging Protocol Block - Add to ALL Agent Prompts

## Copy-Paste Logging Instructions

Add this exact block to every feature-building agent prompt:

```markdown
## SESSION LOGGING REQUIREMENT (MANDATORY)

You MUST maintain a detailed session log throughout your work. This is not optional.

### Log Setup

1. **Create Log File:** `.claude/workspace/[FEATURE]/agent-logs/[YOUR-AGENT-NAME]-session.md`
2. **Use Template:** Copy appropriate template from `.claude/methodology/logging-templates.md`
3. **Update Real-Time:** Log decisions, discoveries, and coordination events as they happen

### Critical Logging Points (MUST LOG)

- **Technology Stack Decisions:** Any library version, pattern, or architecture choices
- **Coordination Assumptions:** What you assume other agents will provide or do
- **Integration Challenges:** Any issues coordinating with other agents' work
- **Field Naming Decisions:** All naming conventions that affect other agents
- **API Integration Patterns:** How frontend communicates with backend services
- **Methodology Insights:** What you learn about parallel execution during your work

### Log Template Selection

- **Infrastructure Agent:** Use Infrastructure Agent Log template
- **Parallel Coordination Agent:** Use Parallel Coordination Agent Log template
- **Sequential Task Agent:** Use Sequential Task Agent Log template

### Why This Matters

Your session log becomes teaching material for the AI orchestration curriculum. The methodology partner uses your detailed execution data to:

- Create systematic failure analysis and prevention guides
- Build teaching examples from real agent coordination
- Improve coordination protocols based on actual agent behavior
- Document what works vs creates friction in parallel execution

### Validation Requirement

Before completing your task:

- [ ] Session log created and maintained throughout work
- [ ] All critical decisions documented with reasoning
- [ ] Coordination events logged with other agents
- [ ] Integration challenges and solutions recorded
- [ ] Final status and recommendations documented

**Failure to maintain session log = Incomplete task regardless of code quality.**
```

## TESTING REQUIREMENTS (MANDATORY)

Testing framework is initialized and ready for use. You MUST write tests for all code you implement.

### Test Coverage Requirements

- **Unit Tests:** All business logic, services, utilities (≥ 80% coverage)
- **Component Tests:** All Angular components with user interactions (≥ 80% coverage)
- **Integration Tests:** REST endpoints, controllers, database operations (≥ 70% coverage)

### Writing Tests

**Location Pattern:**

- Services: `lib/services/__tests__/[service-name].test.ts`
- Components: `src/app/**/[component-name].component.spec.ts`
- Utils: `lib/utils/__tests__/[util-name].test.ts`
- Controllers: `src/**/*.controller.spec.ts`

**Running Tests:**

```bash
npm test              # Run all tests once
npm run test:watch        # Watch mode during development
npm run test:cov          # Check coverage metrics
```

### Test Quality Standards

- Use descriptive test names: `it('should generate summary when lead has interactions')`
- Mock external dependencies (APIs, databases, LLM calls) appropriately
- Test both success and error scenarios
- Include edge cases and validation failures
- Ensure tests are deterministic (no flaky tests)

### Pre-Completion Validation

Before reporting task complete:

- [ ] All tests written for new code
- [ ] All tests passing (`npm test`)
- [ ] Coverage ≥ 80% for new code (`npm run test:cov`)
- [ ] No skipped or pending tests (unless explicitly documented)
- [ ] Tests documented in session log

**For complete pre-completion validation requirements (TypeScript, ESLint, process cleanup), see
coordination-protocols.md**

**Failure to write tests = Incomplete task regardless of code quality.**

````

## API INTEGRATION VALIDATION (MANDATORY FOR FRONTEND AGENTS)

### Critical Logging Point for Frontend Agents

When implementing ANY component that:
- Fetches data from REST endpoints
- Handles loading/error states
- Manages client-side state (signals / RxJS)
- Implements optimistic updates

**MUST LOG:**
```markdown
### API Integration Check
**Component:** [ComponentName]
**Integration Points:**
- [ ] REST endpoints defined: [List routes]
- [ ] Loading states handled: [Yes/No - How?]
- [ ] Error states handled: [Yes/No - How?]
- [ ] Cache management: [Describe cache policy]
- [ ] Verified API responses match expected types

**Testing:**
[Describe how API integration was tested - mock responses, real API calls, etc.]
````

### Session Log Template Addition for Frontend Agents

Add to all frontend agent session logs:

```markdown
## API Integration Validation

### Components Created/Modified

- [ComponentName]: [API Integration Status]
    - REST calls: [List routes used]
    - Error handling: [Implemented error boundaries / fallback UI]
    - Loading states: [Skeleton screens / spinners / progressive loading]
    - Cache strategy: [cache-first / network-only / etc.]
    - Notes: [Any integration-related implementation details]
```

### Why This Logging Is Critical

**Problem Pattern:** API integration issues between frontend and backend services
**Root Cause:** Agents don't always coordinate on API contracts and error handling
**Solution:** Explicit logging of API integration patterns creates accountability and teaching material

**This logging helps:**

- Catch API contract mismatches during development
- Create teaching examples of proper Angular `HttpClient` patterns
- Document agent understanding of REST best practices
- Provide evidence for methodology refinement

## Implementation Strategy

### For All Features:

1. **Add logging block to ALL agent prompts** - Infrastructure, parallel, sequential
2. **Create agent-logs directory** when starting any feature
3. **Verify logging compliance** as part of task completion

### For Existing Agent Specs:

Update all agent specifications in `.claude/methodology/agent-specs-library.md` to include the logging protocol.

### For Prompt Templates:

Update all templates in `.claude/methodology/prompt-templates.md` to include the standard logging block.

## Benefits of Systematic Logging

### Rich Methodology Data

Instead of: "A high-coordination feature had field naming issues"
You get: "Schema Agent chose camelCase at 10:23am (see decision log), Query Agent didn't import schema file and used
snake_case at 10:45am (see coordination failure log), UI Agent discovered mismatch at 11:15am (see integration challenge
log)"

### Teaching-Quality Examples

Real agent execution logs become curriculum examples showing:

- How coordination actually works vs theory
- Where agents struggle with cross-dependencies
- What decisions lead to integration success vs failure
- How to debug systematic coordination failures

### Evidence-Based Protocol Improvement

- Which coordination mechanisms agents actually use effectively
- Where coordination protocols need reinforcement
- What types of integration challenges are most common
- How to design better prompts based on agent behavior patterns

This transforms methodology development from "guessing what works" to "systematic analysis of documented agent
behavior."
