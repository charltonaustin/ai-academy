# Atomic Commit Guidelines: Professional Git Practices for Agent Execution

## Overview: Clean Git History for Easier Code Review

**Purpose:** Ensure agents produce reviewable, professional git history through atomic commits that make code review
efficient and feature evolution clear.

**Evidence Base:** Code review preference for commit-by-commit review rather than large "feature dump" commits.

**Usage:** This standard block MUST be included in ALL agent prompts for feature development.

## Standard Protocol Block for Agent Prompts

```markdown
## GIT COMMIT GUIDELINES (MANDATORY)

You MUST follow atomic commit practices throughout your implementation. This makes code review easier and maintains a clean git history.

### Guidelines for Atomic Commits

1. **One logical change per commit**
   - If you need "and" in your commit message, it might need to be split
   - Example: ✅ "Add [Component] with [specific feature]" ❌ "Add service and tests and types and controllers"

2. **Commit working code**
   - Each commit should leave the codebase in a working state
   - Pre-commit hooks will automatically verify your code (ESLint, TypeScript, tests)
   - Don't commit broken code "to fix later"

3. **Commit related changes together**
   - A feature and its tests should be in the same commit
   - Example: Service implementation + unit tests = one commit
   - Don't commit half a feature

4. **Commit frequently**
   - Small, frequent commits are easier to understand and revert
   - Better to have 5-7 atomic commits than one massive commit

### Pre-commit Hooks

**IMPORTANT**: All commits must pass automated checks before being accepted:

1. **ESLint** - Code must pass linting rules (`npm run lint`)
2. **TypeScript** - No type errors allowed (`tsc`)
3. **Unit Tests** - All tests must pass (`npm test`)

If any of these checks fail, the commit will be rejected and you'll need to fix the issues before committing.

### Suggested Commit Sequence for This Feature

[Provide feature-specific commit sequence here]

**Each commit should:**

- Pass all pre-commit checks
- Leave the application in a working state
- Be reviewable as a standalone change
- Have a clear, descriptive commit message
```

## Feature-Specific Commit Sequence Examples

### Backend Service Feature

```
1. feat: add dependencies for [service]
2. feat: create [ServiceName] with core logic
3. test: add unit tests for [ServiceName]
4. feat: add [observability/tracing] integration
5. feat: extend shared API types with [new DTOs]
6. feat: implement REST controllers for [operations]
7. test: add integration tests for [feature]
```

### Frontend Component Feature

```
1. feat: create [ComponentName] with basic structure
2. feat: add [state management/data fetching] to [Component]
3. test: add unit tests for [Component]
4. feat: integrate [Component] into [parent view]
5. feat: add loading and error states to [Component]
6. style: implement responsive design for [Component]
```

### Full-Stack Feature

```
Backend commits:
1. feat: add backend dependencies for [feature]
2. feat: create [Service] with business logic
3. test: add backend unit tests
4. feat: extend shared API types for [feature]
5. feat: implement REST controllers
6. test: add backend integration tests

Frontend commits:
7. feat: create [Component] for [feature]
8. feat: add HttpClient service methods for [feature]
9. test: add frontend unit tests
10. feat: integrate [Component] into application
11. feat: add loading/error states
```

## Benefits of Atomic Commits

### For Code Review

- **Review commit-by-commit** instead of reviewing 50 changed files at once
- **Understand feature evolution** by seeing logical progression
- **Easy to request changes** on specific commits without blocking entire feature
- **Easy to revert** if a specific change causes issues

### For Git History

- **Clear feature timeline** showing what was built when
- **Easier debugging** with `git bisect` to find regression source
- **Better documentation** of why changes were made
- **Professional practices** maintained throughout project

### For Agents

- **Clear guidance** on commit frequency and granularity
- **Structural framework** via suggested commit sequences
- **Quality gates** via pre-commit hook requirements
- **Prevents "big bang"** commits that are hard to review

## Integration with Quality Standards

Atomic commits are part of the comprehensive **Quality Standards** that apply to all agent work:

- ✅ A+ code quality
- ✅ Professional git practices (atomic commits)
- ✅ Test coverage requirements (≥ 80% backend)
- ✅ Type safety enforcement (TypeScript strict mode)
- ✅ Accessibility standards (WCAG 2.1 AA)

## Pre-commit Hook Enforcement

This project has automated quality gates that enforce standards:

```bash
# Pre-commit checks that MUST pass
1. npm run lint     # ESLint - code style and quality
2. tsc           # TypeScript - type safety
3. npm test     # Unit tests - functionality
```

**If any check fails, the commit is rejected.** This ensures every commit maintains project quality standards.

## Common Atomic Commit Patterns

### Pattern 1: Service + Tests

```
feat: create LeadSummaryService with Zod validation

- Add LeadSummaryService class with generateSummary method
- Implement Zod schema for summary structure validation
- Add retry logic for invalid LLM outputs
- Include unit tests with mocked LLM responses

Tests: 15 passing
Coverage: 95% for LeadSummaryService
```

### Pattern 2: Schema Extension

```
feat: extend shared Lead type with summary field

- Add summary field to Lead type
- Add generateSummary mutation
- Add getSummary query
- Update generated TypeScript types

Breaking changes: None
Backward compatible: Yes
```

### Pattern 3: Integration Work

```
feat: integrate SummaryCard into LeadCard component

- Add collapsible summary section to LeadCard
- Implement expand/collapse animation
- Add loading skeleton for summary generation
- Handle error states gracefully

Accessibility: WCAG 2.1 AA compliant
Responsive: Tested mobile and desktop
```

## Anti-Patterns to Avoid

### ❌ Bad: Massive "Add Feature" Commit

```
feat: add AI summaries

- Added LeadSummaryService
- Added shared API type changes
- Added controllers
- Added frontend components
- Added tests
- Fixed unrelated bug
- Updated dependencies

Files changed: 47
```

**Problem:** Impossible to review atomically, mixes concerns, includes unrelated changes

### ✅ Good: Logical Sequence

```
1. feat: add Vercel AI SDK dependencies
2. feat: create LeadSummaryService with Zod validation
3. test: add unit tests for LeadSummaryService
4. feat: extend shared Lead type with summary field
5. feat: create SummaryCard component
6. feat: integrate SummaryCard into LeadCard
7. test: add integration tests for summary feature
```

**Benefit:** Each commit reviewable independently, clear progression, easy to understand

## Status: Mandatory for All Agent Prompts

**✅ Standard Protocol:** Include in every feature development agent prompt
**✅ Quality Gate:** Pre-commit hooks enforce standards automatically
**✅ Teaching Value:** Demonstrates professional development practices
**✅ Review Efficiency:** Makes code review process significantly easier

**Agents must follow these guidelines to maintain professional git history and enable efficient code review.**
