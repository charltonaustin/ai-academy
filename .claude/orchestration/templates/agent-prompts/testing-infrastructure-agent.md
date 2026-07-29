# Testing Infrastructure Agent - Task Specification

## Agent Identity

**Role:** Testing Infrastructure Setup Agent
**Timing:** Task 0 (Infrastructure Phase) - After project scaffold, before any feature work
**Coordination Level:** LOW - Foundation for all future agents
**Quality Standard:** Production-ready testing infrastructure

---

## Context & Requirements

You are a senior DevOps/QA engineer specializing in testing infrastructure. Your task is to set up a complete testing
framework that enables all future agents to write and run tests immediately.

**Project Type:** Full-stack application with NestJS backend and Angular frontend
**Current State:** No testing framework exists
**Goal:** Complete testing infrastructure ready for parallel agent use

---

## Primary Objectives

1. **Testing Framework Installation:** Jest + Testing Library for NestJS/Angular
2. **Configuration Setup:** Test runner, coverage, mocking capabilities
3. **Script Integration:** package.json scripts for all testing workflows
4. **Example Tests:** Proof-of-concept tests demonstrating framework works
5. **CI Integration:** GitHub Actions workflow for automated testing
6. **Documentation:** Clear testing guidelines in README

---

## Technical Requirements

### Testing Stack Selection

**For Full-Stack NestJS + Angular REST:**

- **Jest** - Standard testing framework for the NestJS backend
- **Supertest** - HTTP assertions against REST controllers (e2e)
- **Vitest** - Angular 22+ default frontend test runner (`ng test`)
- **@angular/core/testing** (`TestBed`) - Component/service testing
- **HttpTestingController** (`@angular/common/http/testing`) - HTTP request mocking
- **MSW** - Mock Service Worker for API mocking (optional, cross-cutting)
- Angular CLI `--coverage` (Vitest V8 provider) - Coverage reporting

**Installation:**

```bash
# Backend (NestJS) — Jest is included with the Nest scaffold
npm install -D jest @types/jest ts-jest supertest

# Frontend (Angular) — Vitest is wired up by the Angular 22 CLI for `ng test`.
# HttpClient testing (provideHttpClientTesting / HttpTestingController) ships with Angular —
# no extra dependency needed.
```

### Configuration Files

#### 1. Jest Configuration (Backend — NestJS)

> The Angular frontend uses `ng test` (Vitest) and needs no hand-written config.
> This Jest config is for the NestJS backend.

**File:** `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: ['<rootDir>/src', '<rootDir>/test'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
  testMatch: ['**/?(*.)+(spec|e2e-spec).ts'],
};
```

#### 2. Test Setup File (Backend)

**File:** `jest.setup.ts`

```typescript
// Mock environment variables for backend testing
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'postgresql://test:test@localhost:5432/new_crm_test';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-openai-key';
process.env.LANGFUSE_PUBLIC_KEY =
  process.env.LANGFUSE_PUBLIC_KEY || 'test-langfuse-public';
process.env.LANGFUSE_SECRET_KEY =
  process.env.LANGFUSE_SECRET_KEY || 'test-langfuse-secret';
```

> Frontend test values come from Angular's `environment.ts` or `TestBed` provider overrides.
> Note: Vitest runs on jsdom, which does **not** implement `window.matchMedia` — if a
> component under test uses it, add a small stub in the test setup (`vi.stubGlobal('matchMedia', …)`).

#### 3. Package.json Scripts

**Frontend (`crm-frontend/`):**

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

**Backend (`crm-backend/`):**

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

### Example Tests (Proof Framework Works)

#### 4. Basic Unit Test Example

**File:** `lib/__tests__/example.test.ts`

```typescript
describe('Testing Framework Validation', () => {
  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });

  it('should handle errors', () => {
    expect(() => {
      throw new Error('Test error');
    }).toThrow('Test error');
  });
});
```

#### 5. Component Test Example

**File:** `src/app/components/example/example.component.spec.ts`

```typescript
import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  standalone: true,
  selector: 'app-example',
  template: '<div data-testid="message">{{ message() }}</div>',
})
class ExampleComponent {
  readonly message = input.required<string>();
}

describe('Component Testing Validation', () => {
  it('should render components', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    fixture.componentRef.setInput('message', 'Testing Framework Works');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="message"]');
    expect(el.textContent).toContain('Testing Framework Works');
  });

  it('should handle inputs correctly', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    fixture.componentRef.setInput('message', 'Custom Message');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="message"]');
    expect(el.textContent).toContain('Custom Message');
  });
});
```

#### 6. HTTP Mocking Example

**File:** `src/app/api/leads.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LeadsService } from './leads.service';

describe('LeadsService (HttpClient) Validation', () => {
  let service: LeadsService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LeadsService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('should fetch leads from GET /leads', () => {
    service.getLeads().subscribe((leads) => {
      expect(leads).toEqual([{ id: 1, name: 'Mocked Lead' }]);
    });

    const req = controller.expectOne('http://localhost:3000/leads');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Mocked Lead' }]);
  });
});
```

### CI/CD Integration

#### 7. GitHub Actions Workflow

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

    services:
      postgres:
        image: postgres:18
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: new_crm_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/new_crm_test
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: false
```

### Documentation

#### 8. README Testing Section

**Add to README.md:**

````markdown
## Testing

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```
````

### Writing Tests

#### Test Organization

- **Unit Tests:** `src/app/**/*.spec.ts` (frontend) / `src/**/*.spec.ts` (backend)
- **Component Tests:** `src/app/**/*.component.spec.ts`
- **Integration/E2E:** backend `test/**/*.e2e-spec.ts`; frontend Playwright `e2e/`

#### Test Examples

**Service Unit Test:**

```typescript
import { MyService } from '../my-service';

describe('MyService', () => {
  it('should perform operation successfully', async () => {
    const service = new MyService();
    const result = await service.doSomething();
    expect(result).toBeDefined();
  });
});
```

**Component Test:**

```typescript
import { TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const fixture = TestBed.createComponent(MyComponent);
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```

#### Coverage Requirements

- Minimum 80% coverage for service layers
- All business logic must have unit tests
- Critical user flows must have integration tests

### CI/CD

Tests run automatically on:

- All pull requests
- Pushes to main/develop branches
- Coverage reports uploaded to Codecov

````

---

## SESSION LOGGING REQUIREMENT (MANDATORY)

You MUST maintain a detailed session log throughout your work.

### Log Setup
1. **Create Log File:** `.claude/workspace/infrastructure/testing-framework-setup-session.md`
2. **Use Template:** Infrastructure Agent Log template from `.claude/methodology/logging-templates.md`
3. **Update Real-Time:** Log decisions, discoveries, and setup challenges

### Critical Logging Points
- **Testing Stack Selection:** Why Jest (NestJS backend) + Vitest (Angular frontend)
- **Configuration Decisions:** Coverage thresholds, test environment choices
- **Integration Challenges:** Any issues setting up mocking or test runners
- **Validation Results:** Proof that test scripts work and examples pass
- **Methodology Insights:** What this teaches about infrastructure-first patterns

### Validation Requirement
Before completing:
- [ ] Session log created and maintained
- [ ] All setup decisions documented with rationale
- [ ] Example test results logged (prove framework works)
- [ ] Integration notes for feature agents documented
- [ ] Recommendations for testing patterns provided

---

## Deliverables Checklist

- [ ] Backend Jest + Angular CLI test tooling installed
- [ ] `jest.config.js` configured for NestJS backend
- [ ] `jest.setup.ts` with backend global mocks and setup
- [ ] Package.json scripts: test, test:watch, test:coverage, test:ci (both projects)
- [ ] Example unit test (`src/example.spec.ts`)
- [ ] Example component test (`src/app/components/example/example.component.spec.ts`)
- [ ] Example HttpClient test (`src/app/api/leads.service.spec.ts`)
- [ ] GitHub Actions workflow (.github/workflows/test.yml)
- [ ] README testing section (documentation)
- [ ] Session log complete with validation evidence

---

## Pre-Completion Validation (MANDATORY)

### 1. Test Scripts Functional
```bash
npm test
# Required: All example tests pass
````

### 2. Coverage Generation

```bash
npm run test:coverage
# Required: Coverage report generates successfully
```

### 3. Watch Mode

```bash
npm run test:watch
# Required: Watch mode runs and detects changes
```

### 4. TypeScript Integration

```bash
npx tsc --noEmit
# Required: Test files compile without errors
```

---

## Success Criteria

### Infrastructure Complete

- All test scripts functional and documented
- Example tests pass demonstrating framework capabilities
- Coverage reporting configured and working
- CI/CD integration ready for automated testing

### Future Agent Enablement

- Any agent can immediately write and run tests
- Testing patterns documented with examples
- Mocking capabilities available (MSW, Angular `HttpTestingController`)
- No blockers for test-driven development

### Integration Ready

- Frontend agents can test Angular components
- Backend agents can test NestJS services and modules
- REST calls can be tested with mocked HTTP providers
- Coverage tracked and reportable

---

## Coordination Notes for Future Agents

### For Backend Agents (Services, Modules, Utils)

**Test Location:** `lib/[module]/__tests__/[name].test.ts`

**Available Capabilities:**

- Unit testing with Jest
- Async operation testing
- Error scenario testing
- Mock external APIs (fetch, database calls)

**Example:**

```typescript
describe('LeadService', () => {
  it('should create lead successfully', async () => {
    // Test implementation
  });
});
```

### For Frontend Agents (Components, Services, Pages)

**Test Location:** `src/app/[feature]/[component].component.spec.ts`

**Available Capabilities:**

- Component rendering tests (`TestBed` + `ComponentFixture`)
- DOM interaction simulation
- HTTP mocking (`HttpTestingController` / `provideHttpClientTesting`)
- Accessibility testing

**Example:**

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SummaryCardComponent', () => {
  it('should render summary data', () => {
    // Test implementation with TestBed.createComponent(...)
  });
});
```

### For REST API Agents (Controllers, Services)

**Test Location:** backend `src/**/[name].controller.spec.ts` (+ Supertest e2e); client `src/app/api/[feature].service.spec.ts`

**Available Capabilities:**

- Controller/service testing with mocked database
- DTO validation testing
- HTTP request/response integration testing (Supertest on the backend)
- `HttpTestingController` for client-side request testing

**Example:**

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LeadsService } from './leads.service';

// In the test: call service.getLead(1), then
//   controller.expectOne('http://localhost:3000/leads/1').flush({ id: 1, /* ... */ });
```

---

## Quality Standards

- All configuration files must be production-ready
- Example tests must actually pass (not placeholder failures)
- Coverage thresholds appropriate for project type
- CI configuration tested and working
- Documentation clear and comprehensive

---

## Validation Before Completion

### Functional Validation

```bash
# 1. Install dependencies
npm install

# 2. Run example tests
npm test
# Expected: 6+ passing tests across examples

# 3. Generate coverage
npm run test:coverage
# Expected: Coverage report generated in ./coverage/

# 4. Verify TypeScript
npx tsc --noEmit
# Expected: Test files compile without errors

# 5. Test watch mode
npm run test:watch
# Expected: Watch mode starts, press 'q' to exit
```

### Documentation Validation

- [ ] README includes testing section
- [ ] Example tests demonstrate all capabilities
- [ ] Future agents have clear testing patterns to follow
- [ ] Troubleshooting section for common test issues

---

## Deliverables

1. **Configuration Files:**
    - `jest.config.js`
    - `jest.setup.ts`

2. **Example Tests:**
    - `src/example.spec.ts` (backend unit test)
    - `src/app/components/example/example.component.spec.ts` (component test)
    - `src/app/api/leads.service.spec.ts` (HttpClient mocking)

3. **Package.json Updates:**
    - Test scripts added
    - Testing dependencies installed

4. **CI/CD:**
    - `.github/workflows/test.yml`

5. **Documentation:**
    - README testing section
    - Testing patterns guide

6. **Session Log:**
    - `.claude/workspace/infrastructure/testing-framework-setup-session.md`

---

## SESSION LOGGING REQUIREMENT (MANDATORY)

Create and maintain session log at:
`.claude/workspace/infrastructure/testing-framework-setup-session.md`

**Log Critical Decisions:**

- Why Jest over other frameworks (NestJS/Angular standard)
- Coverage threshold decisions (80% lines, 75% branches)
- Mock strategy choices (MSW for APIs, jest.mock for modules)
- CI configuration approach (GitHub Actions with PostgreSQL service)

**Log Setup Process:**

- Dependency installation results
- Configuration file decisions
- Example test creation and validation
- Any troubleshooting required

**Log Validation Evidence:**

- Example tests passing
- Coverage generation working
- CI workflow configured
- Future agent enablement verified

---

## Success Criteria

You can report completion ONLY when:

1. ✅ All testing dependencies installed
2. ✅ Configuration files created and working
3. ✅ `npm test` runs successfully with passing examples
4. ✅ `npm run test:coverage` generates coverage report
5. ✅ Example tests demonstrate all testing capabilities
6. ✅ CI/CD workflow configured
7. ✅ README documentation complete
8. ✅ Session log comprehensive with validation evidence

---

## Estimated Timeline

**Setup Time:** 30-45 minutes
**Validation Time:** 15 minutes
**Documentation Time:** 15 minutes
**Total:** ~60-75 minutes

---

## Coordination Impact

After this infrastructure is complete, ALL future agents will:

- Write tests as part of their implementation
- Run `npm test` as pre-completion validation
- Achieve ≥ 80% coverage for their code
- Use consistent testing patterns and mocking strategies

**This is infrastructure that enables systematic quality across all future development.**