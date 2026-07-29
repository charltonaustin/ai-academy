# Testing as Infrastructure: Early Setup, Continuous Coverage

## Critical Pattern: Testing Framework as Infrastructure

**Problem:** Agents defer testing when "no test infrastructure exists yet"

**Impact:** Zero test coverage, technical debt accumulation

**Root Cause:** Testing framework not part of infrastructure-first pattern

**Solution:** Testing framework initialization as Task 0 deliverable, just like setup scripts

**This is a systematic gap** that infrastructure-first approach solves.

---

## Methodology Principle: Testing Framework = Infrastructure

### Just Like npm Scripts

**npm Scripts Pattern (Already Proven):**

- ✅ Set up BEFORE feature agents need it
- ✅ No functionality, just infrastructure
- ✅ Enables all future agents immediately
- ✅ Technology stack determined by project type

**Testing Framework Pattern (Same Approach):**

- ✅ Created during initial setup phase (Task 0)
- ✅ No tests yet, just infrastructure
- ✅ Enables all future agents to write/run tests
- ✅ Part of infrastructure before parallel execution

**Why This Works:**
When testing framework exists from Task 0, agents have NO EXCUSE for skipping tests. Infrastructure removes the blocker.

---

## Updated Task 0 Responsibilities

### Task 0 Without Testing Framework

```
1. Project scaffolding (NestJS backend + Angular frontend)
2. Database setup (PostgreSQL + Sequelize)
3. Development scripts (setup, seed, reset)
4. Environment configuration (.env templates)
```

### Task 0 With Testing Framework (Recommended)

```
1. Project scaffolding (NestJS backend + Angular frontend)
2. Database setup (PostgreSQL + Sequelize)
3. Development scripts (setup, seed, reset)
4. Testing framework (Jest + Testing Library) ← NEW
5. Test scripts (test, test:watch, test:coverage) ← NEW
6. Example tests proving framework works ← NEW
7. CI configuration for automated testing ← NEW
8. Environment configuration (.env templates)
```

**Scope Addition:** Extended Task 0 scope (one-time infrastructure investment)

---

## Technology Stack Detection

### Testing Framework Selection Based on Project Type

**Backend-Heavy (Node.js APIs, Services):**

- Jest (fast, TypeScript-native)
- MSW for API mocking
- Database mocking utilities

**Frontend-Heavy (Angular, UI Components):**

- Vitest via Angular CLI (`ng test`) — the default runner in Angular 22+
- Angular `TestBed` + `ComponentFixture`
- `HttpTestingController` for HTTP mocking

**Full-Stack NestJS + Angular REST (Our Case):**

- Backend: Jest (NestJS default)
- Frontend: Vitest (`ng test`) with Angular `TestBed`
- `HttpTestingController` (`@angular/common/http/testing`) for REST client tests
- MSW for REST API mocking
- Built-in Angular CLI code coverage (Vitest's V8/Istanbul provider)

**PWA (Angular service worker):**

- Vitest (`ng test`)
- Mock `SwPush` / `SwUpdate` from `@angular/service-worker`
- Fake `navigator.onLine` for offline-path tests

**Task 0 Agent Determines:** Based on project scaffold, choose appropriate testing stack

---

## Task 0 Testing Infrastructure Deliverables

### 1. Package.json Scripts

**Frontend (`crm-frontend/`) — Angular CLI:**

```json
{
  "scripts": {
    "test": "ng test --no-watch",
    "test:watch": "ng test",
    "test:coverage": "ng test --no-watch --coverage",
    "test:ci": "ng test --no-watch --coverage"
  }
}
```

**Backend (`crm-backend/`) — NestJS/Jest:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

### 2. Coverage Configuration (Angular frontend)

Angular CLI produces coverage with `--coverage` (Vitest's V8 provider). There is no
`karma.conf.js` in Angular 22 — enforce thresholds on the `test` target in `angular.json`:

```jsonc
// angular.json → projects.crm-frontend.architect.test.options
{
  "coverage": true,
  "coverageThresholds": {
    "statements": 80,
    "branches": 70,
    "functions": 80,
    "lines": 80
  }
}
```

For anything Vitest supports that Angular doesn't surface directly (reporters, extra
providers), add a `vitest.config.ts` at the project root and Angular's unit-test builder will
merge it.

### 3. Test Setup (Angular)

Angular's CLI wires up the Vitest environment (jsdom + `TestBed`) through the `unit-test`
builder — no manual setup file is required. Use `TestBed` in each spec. For environment values,
provide them through Angular's `environment.ts` (or override providers in `TestBed`), rather
than mutating `process.env`.

### 4. Example Tests (Proof Framework Works)

**File:** `src/app/example.spec.ts` (plain unit test)

```typescript
describe('Testing Framework Validation', () => {
  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });
});
```

**File:** `src/app/example.component.spec.ts` (component test)

```typescript
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({ standalone: true, template: '<div>Testing Framework Works</div>' })
class TestComponent {}

describe('Component Testing Validation', () => {
  it('should render components', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Testing Framework Works');
  });
});
```

### 5. CI Configuration (GitHub Actions)

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### 6. README Documentation

**Add Section:** Testing

````markdown
## Testing

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```
````

### Writing Tests

- **Unit tests (services/utils):** `src/app/**/*.spec.ts`
- **Component tests:** `src/app/**/*.component.spec.ts`
- **Integration/E2E tests:** Playwright specs under `e2e/`

### Coverage Requirements

- Minimum 80% coverage for service layers
- All business logic must have unit tests
- Critical user flows must have integration tests

````

---

## Agent Responsibilities: Testing is Part of "Done"

### Updated Definition of Task Completion

**Without Testing Requirements:**
```markdown
Task Complete When:
- ✅ Feature implemented
- ✅ TypeScript compilation passes
- ✅ Linting passes
- ✅ Session log complete
````

**With Testing Requirements (Recommended):**

```markdown
Task Complete When:

- ✅ Feature implemented
- ✅ TypeScript compilation passes
- ✅ Linting passes
- ✅ Unit tests written and passing ← NEW
- ✅ Coverage ≥ 80% for new code ← NEW
- ✅ Session log complete (including test strategy)
```

### Pre-Completion Validation Enhanced

```bash
# TypeScript
npx tsc --noEmit         # Zero errors required

# Linting
npm run lint                 # Zero errors required

# Testing (NEW)
npm test                 # All tests pass
npm run test:coverage        # ≥ 80% coverage for new code

# Build
npm run build                # Production build succeeds
```

---

## Coverage Requirements by Code Type

### Service Layer (Backend Business Logic)

**Coverage:** ≥ 80% (lines, functions, branches)
**Test Types:** Unit tests with mocked dependencies

**Example (LeadSummaryService):**

```typescript
describe('LeadSummaryService', () => {
  it('should generate summary with valid interactions', async () => {
    // Mock OpenAI response
    // Test successful generation
    // Verify Zod validation
  });

  it('should retry on failure with exponential backoff', async () => {
    // Mock API failure on attempt 1
    // Mock success on attempt 2
    // Verify retry logic
  });

  it('should throw after max retries', async () => {
    // Mock failures on all attempts
    // Verify error thrown
  });
});
```

### REST Controllers

**Coverage:** ≥ 70% (integration complexity)
**Test Types:** Integration tests with mocked database (+ Supertest e2e against routes)

### Angular Components

**Coverage:** ≥ 80% (component logic)
**Test Types:** `TestBed` component tests with DOM interaction simulation

---

## Agent Prompt Template: Testing Requirements

### Add to ALL Feature Agent Prompts

````markdown
## TESTING REQUIREMENTS (MANDATORY)

Testing framework is initialized and ready for use. You MUST write tests for all code you implement.

### Test Coverage Requirements

- **Unit Tests:** All business logic, services, utilities (≥ 80% coverage)
- **Component Tests:** All Angular components with user interactions (≥ 80% coverage)
- **Integration Tests:** REST endpoints, controllers, database operations (≥ 70% coverage)

### Writing Tests

**Location Pattern:**

- Services: `src/app/**/[service-name].service.spec.ts`
- Components: `src/app/**/[component-name].component.spec.ts`
- Utils: `src/app/**/[util-name].spec.ts`
- Controllers (backend): `src/**/[name].controller.spec.ts`

**Running Tests:**

```bash
npm test              # Run all tests
npm run test:watch        # Watch mode during development
npm run test:coverage     # Check coverage
```
````

### Pre-Completion Validation

Before reporting task complete:

- [ ] All tests written for new code
- [ ] All tests passing (`npm test`)
- [ ] Coverage ≥ 80% for new code (`npm run test:coverage`)
- [ ] No skipped or pending tests (unless explicitly documented)

### Test Quality Standards

- Use descriptive test names: `it('should generate summary when lead has interactions')`
- Mock external dependencies (APIs, databases, LLM calls) appropriately
- Test both success and error scenarios
- Include edge cases and validation failures
- Ensure tests are deterministic (no flaky tests)

**Failure to write tests = Incomplete task regardless of code quality.**

````

---

## Session Logging: Testing Strategy Section

### ALL Agent Session Logs Must Include

```markdown
## Testing Strategy

### Test Coverage Plan
**Target Coverage:** 80% for new code

**Test Types Planned:**
- [ ] Unit tests for [list components/services]
- [ ] Integration tests for [list integrations]
- [ ] Component tests for [list UI components]
- [ ] Edge case tests for [list edge cases]

### Testing Approach
**Mock Strategy:** [What dependencies will be mocked and how]
**Test Organization:** [How tests are structured and named]
**Coverage Focus:** [Which parts need highest coverage]

### Testing Results
**Tests Written:** [count]
**Tests Passing:** [count] / [count]
**Coverage Achieved:** [percentage]%

**Coverage Report:**
````

File | % Stmts | % Branch | % Funcs | % Lines
lib/services/my-service.ts | 85.2 | 78.5 | 90.0 | 84.8

```

**Challenges Encountered:** [List testing difficulties and solutions]
**Methodology Insights:** [What this teaches about testing parallel agent work]
```

---

## Pattern Evolution

### Without Testing Infrastructure (Failure Pattern)

- Agents defer testing repeatedly
- Zero test coverage for production services
- Technical debt accumulates
- **Lesson:** Testing framework must exist BEFORE feature work

### With Testing Infrastructure (Success Pattern)

- Testing framework set up in Task 0
- Example tests demonstrating patterns
- Coverage thresholds enforced (80% lines, 70% branches)
- Comprehensive testing documentation
- **Lesson:** Infrastructure-first testing enables TDD and prevents technical debt

### Advanced: Integration Testing (Evolution)

- Separate test database for integration tests
- Two-tier testing strategy (unit + integration)
- Integration validation gate catches bugs before completion
- **Lesson:** Testing infrastructure evolves with project needs

---

## Coverage Enforcement Strategy

### Phase 1: Soft Requirement (Initial Rollout)

- Agents expected to write tests
- Coverage tracked but not blocking
- Orchestration partner reviews test quality during validation
- Learn from test patterns in retrospectives

### Phase 2: Hard Requirement (Current Standard)

- Tests required for PR approval
- CI blocks merge if coverage < 80%
- Pre-completion validation enforced
- Agent prompts include strict enforcement

---

## Infrastructure Agent Task Specification

### Task: Testing Framework Setup (Part of Task 0)

**Agent Type:** Infrastructure Setup Agent
**Timing:** Initial infrastructure phase, before any feature work
**Coordination Level:** LOW (foundation for all future agents)

**Primary Objectives:**

1. Install and configure testing framework (Jest + Testing Library)
2. Create test scripts in package.json
3. Configure test coverage reporting with thresholds
4. Write example tests proving framework works
5. Set up CI/CD test automation
6. Document testing approach in README

**Technical Requirements:**

- Frontend: Vitest via Angular CLI (`ng test`) with `TestBed`
- Backend: Jest (NestJS default)
- `HttpTestingController` (`@angular/common/http/testing`) for REST client tests
- Angular CLI `--coverage` (Vitest V8 provider) for coverage reporting

**Deliverables:**

1. `angular.json` test target - Frontend coverage thresholds (optional; CLI defaults otherwise)
2. `src/app/example.spec.ts` - Example unit test
3. `src/app/example.component.spec.ts` - Example component test
4. Backend `jest` config + example service spec
5. Updated `package.json` with test scripts
6. `.github/workflows/test.yml` - CI test automation
7. README section on testing

**Validation:**

- [ ] `npm test` runs successfully
- [ ] Example tests pass
- [ ] Coverage report generates with thresholds
- [ ] CI workflow configured and functional

**Success Criteria:**

- All test scripts functional
- Example tests demonstrate framework capabilities
- Future agents can immediately write and run tests
- Documentation clear on testing approach
- Coverage thresholds enforced automatically

---

## Curriculum Integration

### Teaching Module: Testing as Infrastructure

**Learning Objective:** Engineers understand testing framework setup enables parallel agent validation from start

**Content:**

1. **Infrastructure-First Pattern:** Testing like setup scripts - infrastructure before features
2. **Early Detection:** Why waiting to set up tests creates technical debt
3. **Agent Enablement:** How testing infrastructure enables all agents to validate their work
4. **Coverage as Quality:** Test coverage as coordination mechanism (ensures completeness)

**Evidence from Practice:**

- Without framework: Agents couldn't write tests - technical debt created
- With framework in Task 0: All agents could write tests immediately
- Integration tests: Caught production bugs before delivery
- Pattern: Infrastructure-first prevents systematic gaps

---

## Status: Testing Methodology Systematized

**✅ Root Cause Identified:** Testing framework not part of infrastructure-first pattern
**✅ Solution Proven:** Testing as Task 0 deliverable works reliably
**✅ Agent Prompts Enhanced:** Testing requirements standard in all templates
**✅ Methodology Updated:** Testing infrastructure pattern documented
**✅ Coverage Strategy:** Soft rollout → hard enforcement → integration validation

**Ready for:** All projects can include testing framework in Task 0, enabling systematic quality validation from day
one.
