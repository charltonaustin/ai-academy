# Infrastructure Agent Prompt Library

**Purpose:** Reusable, battle-tested agent prompts for common infrastructure setup tasks

**Usage:** Copy prompt → Adjust for your project → Execute with single agent

**Quality:** All prompts based on real implementations with proven results

---

## When to Use These Prompts

### Early in Project (Foundation Phase)

Use these prompts **BEFORE** building features:

1. **Foundation Setup** - Project scaffolding, database, dev scripts
2. **Testing Infrastructure** - Test framework, utilities, example tests
3. **Integration Testing Setup** - Separate test database, integration test patterns

**Why First:** Establishes foundation so feature agents can work in parallel without infrastructure blockers.

### During Project (As Needed)

Use these prompts when adding infrastructure that **benefits all features**:

4. **Authentication System** - JWT, session management, auth guards
5. **WebSocket Server** - Real-time communication infrastructure
6. **CI/CD Pipeline** - GitHub Actions, deployment, quality gates

---

## Prompt Categories

### Category 1: Project Foundation

Essential infrastructure for greenfield projects.

#### 1.1 NestJS + Angular + TypeScript + Database Foundation

**See:** Foundation Infrastructure implementation (proven pattern)

**Scope:** Comprehensive (single agent)
**Deliverables:**

- NestJS backend setup
- Angular frontend setup
- TypeScript strict mode
- PostgreSQL Docker setup
- Database scripts (setup, seed, reset, migrate)
- NestJS REST API (controllers + DTOs)
- Basic UI components (Navigation, layout)

**When to Use:** Starting new full-stack project with database

**Prompt Location:** See example foundation infrastructure prompts in workspace

**Key Adaptations Needed:**

- Database name (replace "new_crm" with your project name)
- Database fields (customize lead schema to your domain)
- Shared API types / DTOs (customize to your data model)

---

#### 1.2 Testing Framework Infrastructure

**See:** Example testing framework implementation

**Scope:** Moderate (single agent)
**Deliverables:**

- Jest + Angular Testing Library setup
- Test scripts (test, test:watch, test:coverage)
- Example unit tests (services, components, controllers)
- Test utilities (mocking patterns, helpers)
- Coverage configuration (thresholds, reporting)

**When to Use:** After foundation setup, before building features

**Prompt Template:**

```markdown
# Testing Framework Infrastructure Setup

**Agent Role:** Test Infrastructure Engineer
**Scope:** Moderate

## Context

{Project name} needs comprehensive testing infrastructure with Jest and Angular Testing Library. This infrastructure must be ready BEFORE feature agents begin work.

## Objectives

1. Install and configure Jest + Angular Testing Library
2. Create test scripts in package.json
3. Write example tests (service, component, controller)
4. Configure coverage reporting with 80% thresholds
5. Create test utilities and mocking patterns
6. Document testing patterns in tests/README.md

## Tech Stack

- Jest (test runner)
- Angular Testing Library (component testing)
- TypeScript (strict mode)
- {Add other relevant tech}

{Continue with detailed specifications...}
```

---

#### 1.3 Integration Testing Infrastructure

**See:** `INTEGRATION-TEST-SETUP-PROMPT.md` (this feature's prompt)

**Scope:** Substantial (single agent)
**Deliverables:**

- Separate test database (`{project}_test`)
- `.env.test` configuration
- Test database scripts (setup, migrate, reset)
- Database type validation tests
- Integration test suite (REST endpoints, services, full stack)
- NO MOCKS validation

**When to Use:** After testing framework established, when integration bugs found

**Prompt Location:** See example integration test setup prompts in workspace

**Reusable As-Is:** Just replace project name and verify database setup matches your Docker config

---

### Category 2: Backend Infrastructure

Infrastructure for backend services and APIs.

#### 2.1 Database Setup (PostgreSQL + Docker)

**See:** Example database setup implementation

**Scope:** Moderate (single agent)
**Deliverables:**

- Docker container for PostgreSQL
- Database setup scripts
- Schema migration system
- Seed data scripts
- Connection pooling utilities

**Key Pattern:**

```javascript
// scripts/db-docker-setup.js
- Check Docker installed
- Clean up existing container
- Start PostgreSQL container
- Wait for database ready
- Update .env.local with connection string
```

**Reusable:** Yes, just change database name and credentials

---

#### 2.2 REST API Layer

**See:** Example REST setup implementation

**Scope:** Moderate-to-substantial (single agent)
**Deliverables:**

- Feature modules + controllers
- Shared DTOs / response types foundation
- Basic routes (GET/POST/PATCH/DELETE)
- Global `ValidationPipe` (whitelist + transform)
- Error handling (exception filters)

**Pattern:** NestJS feature module with REST controllers

**Reusable:** Yes, foundation pattern is universal

---

#### 2.3 WebSocket Server Infrastructure

**See:** Example WebSocket infrastructure implementation

**Scope:** Moderate-to-substantial (single agent)
**Deliverables:**

- WebSocket server (ws library)
- JWT authentication for connections
- Connection management (Map<userId, Set<WebSocket>>)
- PubSub event broadcasting
- Heartbeat ping/pong
- Graceful shutdown handlers
- Concurrent server setup (NestJS + WebSocket)

**When to Use:** Adding real-time features

**Prompt Location:** See example WebSocket infrastructure prompts in workspace

**Key Adaptations:**

- Event types (customize for your domain)
- Authentication (integrate with your auth system)
- PubSub vs Redis (start with PubSub, migrate to Redis later)

---

### Category 3: Frontend Infrastructure

Infrastructure for Angular applications.

#### 3.1 UI Component Library Foundation

**Scope:** Moderate (single agent)
**Deliverables:**

- Tailwind CSS setup
- Base UI components (Button, Card, Input, etc.)
- Component testing examples
- Accessibility patterns (ARIA, semantic HTML)
- Responsive design utilities

**Pattern:** Start with Angular Material or build custom

---

#### 3.2 HTTP Client Setup (Angular HttpClient)

**See:** Example `provideHttpClient` setup implementation

**Scope:** Small-to-moderate (single agent)
**Deliverables:**

- `provideHttpClient()` configuration + API base URL
- HTTP interceptor (auth header, error mapping)
- Typed data services per resource
- Error handling patterns (`HttpErrorResponse`)
- Reusable service methods for common requests

**Reusable:** Yes, HttpClient setup pattern universal

---

### Category 4: Quality & Testing

#### 4.1 ESLint + Prettier Configuration

**Scope:** Small-to-moderate (single agent)
**Deliverables:**

- ESLint config with TypeScript support
- Prettier config
- Pre-commit hooks (optional)
- Editor config (.editorconfig)
- Scripts for lint:fix

**Reusable:** Yes, config files portable

---

#### 4.2 CI/CD Pipeline (GitHub Actions)

**Scope:** Moderate-to-substantial (single agent)
**Deliverables:**

- GitHub Actions workflow
- Test running on PR
- Type checking on PR
- Lint checking on PR
- Coverage reporting
- Deployment pipeline (optional)

**Pattern:**

```yaml
.github/workflows/test.yml:
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Start test database
  - Run migrations
  - Run tests
  - Upload coverage
```

**Reusable:** Yes, customize for your deployment target

---

## How to Use This Library

### For New Projects

**Phase 1: Foundation (Sequential)**

1. Use prompt 1.1 (NestJS + Angular + Database Foundation)
2. Use prompt 1.2 (Testing Framework)
3. Use prompt 1.3 (Integration Testing Setup)

**Result:** Complete foundation ready for feature development

**Scope:** Extensive (3 agents sequential)

---

**Phase 2: Add Features (Parallel)**

- Now feature agents can work in parallel
- All infrastructure exists
- No blockers

---

### For Existing Projects

**Assess what's missing:**

```bash
# Check testing infrastructure
ls tests/setup.ts         # Test framework?
ls .env.test             # Separate test DB?
ls tests/integration/    # Integration tests?

# Check backend infrastructure
ls lib/db.ts            # Database utilities?
ls src/app/api/         # HTTP data services?
ls realtime/server.ts   # WebSocket server?
```

**Add missing pieces:**

- Use relevant prompts from library
- Adapt to existing patterns
- Single agent per infrastructure piece

---

## Prompt Adaptation Checklist

When using a prompt from this library:

### Before Execution

- [ ] Replace project name throughout prompt
- [ ] Update database credentials
- [ ] Adjust tech stack section to match your project
- [ ] Verify directory structure matches (lib/ vs src/)
- [ ] Check if dependencies already installed

### During Execution

- [ ] Agent should document adaptations in session log
- [ ] Agent should follow existing code patterns
- [ ] Agent should integrate with existing infrastructure

### After Execution

- [ ] Verify infrastructure works (manual testing)
- [ ] Update prompt library if improvements discovered
- [ ] Document any project-specific adaptations

---

## Parallelization Decision Tree

### Question: Can this infrastructure work be parallelized?

**Ask yourself:**

1. **Does Task B depend on Task A completing first?**
    - YES → Sequential (single agent)
    - NO → Maybe parallel

2. **Do tasks modify the same files?**
    - YES → Sequential (conflict risk)
    - NO → Maybe parallel

3. **Is total scope substantial?**
    - NO → Sequential (overhead not worth it)
    - YES → Maybe parallel

4. **Are there clear, independent deliverables?**
    - NO → Sequential (cohesive design needed)
    - YES → Maybe parallel

5. **Does parallelization provide significant efficiency gains?**
    - NO → Sequential (not worth coordination)
    - YES → Consider parallel

### Examples from new-crm

**Sequential (Single Agent):**

- ✅ Foundation setup (comprehensive scope, but linear dependencies)
- ✅ Testing framework (moderate scope, too small to split)
- ✅ Integration test setup (substantial scope, linear dependencies)
- ✅ WebSocket infrastructure (moderate-to-substantial scope, cohesive design)

**Parallel (Multiple Agents):**

- ✅ Real-time feature tasks (REST + Client + Events)
    - Different files, independent work, significant efficiency gains
- ✅ Database and API layers (Database + REST)
    - Different layers, clear contracts, efficiency gains

**Rule of Thumb:** Infrastructure = Sequential, Features = Parallel

---

## Infrastructure Prompts Quick Reference

| Prompt                    | Scope                   | When to Use                 | Parallelizable? |
|---------------------------|-------------------------|-----------------------------|-----------------|
| **Full-Stack Foundation** | Comprehensive           | New project start           | ❌ No            |
| **Testing Framework**     | Moderate                | After foundation            | ❌ No            |
| **Integration Tests**     | Substantial             | When integration bugs found | ❌ No            |
| **Database Setup**        | Moderate                | New project or adding DB    | ❌ No            |
| **REST API**              | Moderate-to-substantial | After database exists       | ❌ No            |
| **WebSocket Server**      | Moderate-to-substantial | Adding real-time features   | ❌ No            |
| **Auth System**           | Substantial             | When user management needed | ❌ No            |
| **CI/CD Pipeline**        | Moderate-to-substantial | When ready for deployment   | ❌ No            |

**Total Foundation Scope (Sequential):** Extensive
**After Foundation:** Feature agents can work in parallel

---

## Quality Standards for Infrastructure Prompts

### All Infrastructure Prompts Must Include

**1. Session Logging:**

- Document design decisions
- Document adaptations to existing patterns
- Document manual testing results
- Capture patterns for future reuse

**2. Testing Requirements:**

- Unit tests for utilities (if applicable)
- Integration tests for database features (NO MOCKS)
- Manual testing checklist
- Validation against real environment

**3. Documentation:**

- README updates with usage instructions
- Code comments for complex logic
- Examples for future developers
- Troubleshooting guide

**4. Fresh Clone Validation:**

- New developer can run `npm run setup`
- All scripts work out-of-the-box
- No manual steps required
- Documented in README

---

## Lessons from Implementation Experience

### Foundation Infrastructure Learnings

**What Worked:**

- Infrastructure-first pattern (setup before features)
- Database scripts with error handling
- Clear separation (setup vs seed vs migrate)

**What to Carry Forward:**

- Always start with infrastructure
- Test scripts work on fresh clone
- Document all commands in README

---

### Integration Testing Learnings

**What Failed:**

- Mock-heavy tests hid type mismatches
- No separate test database
- No integration validation gate

**New Requirements:**

- Separate test database (mandatory)
- Two-tier testing (unit + integration)
- Database type validation tests
- Integration validation gate before "complete"

**These Are Now Standard in All Infrastructure Prompts.**

---

### Process Management & Validation Learnings

**What Failed:**

- Agents claimed "complete" without TypeScript validation (221 errors went undetected)
- Test files missing imports (tests passed at runtime, TypeScript failed)

**Root Causes:**

- Agents ran `npm test` but not `npm run type-check`
- Runtime success ≠ compilation success

**New Requirements:**

- **TypeScript validation mandatory:** Run `npm run type-check` before claiming complete
- **Validation output required:** Paste all validation results in session log

**These Are Now Standard in All Agent Prompts (Not Just Infrastructure).**

---

## Future Additions to Library

As we build more features, add prompts for:

### Backend

- [ ] Authentication & Authorization (JWT, sessions, RBAC)
- [ ] File Upload Infrastructure (S3, local storage)
- [ ] Background Job System (Bull, cron)
- [ ] Email Service (SendGrid, SES)
- [ ] Caching Layer (Redis)

### Frontend

- [ ] State Management (Zustand, Context)
- [ ] Form Handling (Angular Reactive Forms, validation)
- [ ] Data Tables (pagination, sorting, filtering)
- [ ] File Upload UI (drag-drop, progress)
- [ ] Toast Notifications (we have this!)

### DevOps

- [ ] Docker Compose (multi-service)
- [ ] Environment Management (.env.\*, secrets)
- [ ] Database Migrations (versioning, rollback)
- [ ] Monitoring & Logging (Sentry, DataDog)

### Quality

- [ ] E2E Testing (Playwright, Cypress)
- [ ] Performance Testing (Lighthouse, load tests)
- [ ] Security Scanning (npm run audit, OWASP)
- [ ] Accessibility Testing (axe-core)

**Process:** After implementing each, extract prompt to this library

---

## Prompt Template for New Infrastructure

When adding new infrastructure prompts to this library:

```markdown
# {Infrastructure Name} Setup

**Agent Role:** {Specialist role}
**Coordination Level:** LOW (infrastructure-independent)
**Scope:** {Small/Moderate/Substantial/Comprehensive/Extensive}
**Dependencies:** {List or "None"}
**Based On:** {Which implementation if applicable}

---

## Context & Requirements

{Brief description of what this infrastructure does and why it's needed}

**Project Tech Stack:**

- {List relevant technologies}

**Critical Requirement:** {Most important constraint, e.g., "Fresh clone demo readiness"}

---

## Primary Objectives

1. {Objective 1}
2. {Objective 2}
3. {Objective 3}
   ...

---

## Technical Specifications

{Detailed implementation instructions with code examples}

---

## Testing Requirements (Two-Tier Strategy)

### Unit Tests

{What to test with mocks}

### Integration Tests

{What to test WITHOUT mocks - mandatory}

---

## Validation Checklist

{Comprehensive checklist before claiming complete}

---

## Session Logging Requirement

{Where to create log, what to document}

---

## Success Criteria

{Functional completeness, quality standards, integration readiness}

---

## Deliverables

{All files to create/modify}

---

## Known Challenges & Solutions

{Common issues and how to solve them}
```

---

## Using This Library for Future Projects

### Step 1: Assess Project Needs

**Questions to ask:**

- Starting from scratch or adding to existing project?
- Need database? Real-time features? Authentication?
- What's already in place? What's missing?

### Step 2: Select Prompts

**For Greenfield Project:**

1. Foundation Setup (1.1)
2. Testing Framework (1.2)
3. Integration Testing (1.3)

**For Adding Features:**

- Select specific infrastructure needed
- Example: Adding real-time → WebSocket Server prompt

### Step 3: Adapt Prompts

**Customizations:**

- Project name
- Database schema
- Directory structure
- Existing patterns

### Step 4: Execute Sequential

**Run one agent at a time:**

- Foundation → Testing → Integration Testing
- Each builds on previous
- No parallelization for infrastructure

### Step 5: Validate & Document

**After each infrastructure agent:**

- Validate infrastructure works
- Update this library if improvements found
- Document project-specific adaptations

---

## Success Metrics

### Infrastructure Quality Indicators

**After foundation infrastructure (prompts 1.1, 1.2, 1.3):**

- [ ] Fresh clone → `npm run setup` → working app (< 5 min)
- [ ] `npm test` uses separate test database
- [ ] All tests passing (unit + integration)
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Test coverage > 80%
- [ ] Integration tests exist (NO MOCKS)
- [ ] Documentation complete (README, test guide)

**Foundation scope:** Extensive (sequential)
**Ready for parallel feature development:** ✅

---

## Maintenance & Evolution

### Adding New Prompts

**When to add:**

- After implementing infrastructure for a feature
- Pattern is proven (worked well, no major issues)
- Reusable across projects

**How to add:**

1. Extract agent prompt from feature implementation
2. Generalize (remove project-specific details)
3. Add to this library with metadata (time, dependencies)
4. Document in README
5. Tag with implementation reference where proven

### Updating Existing Prompts

**When to update:**

- Bug found in implementation
- Better pattern discovered
- Methodology learning suggests improvement

**How to update:**

1. Note what changed and why
2. Update prompt with improvement
3. Add version note: "Updated: YYYY-MM-DD (reason)"
4. Test updated prompt on new project (if possible)

---

## Current Library Status

**Available Prompts:**

- ✅ 1.1 Full-Stack Foundation (NestJS + Angular)
- ✅ 1.2 Testing Framework (Jest)
- ✅ 1.3 Integration Testing
- ✅ 2.3 WebSocket Server

**Proven Results:**

- Foundation setup successful, enabled subsequent feature development
- WebSocket infrastructure clean, zero bugs
- Integration testing caught 2 critical bugs before delivery

**To Be Added:**

- 4.1 Authentication System (planned)
- More backend infrastructure as we build

---

## Integration with Methodology

### How This Library Supports Methodology Development

**1. Reusability:**

- Proven patterns captured for future use
- No need to reinvent infrastructure each time
- More efficient project starts

**2. Quality:**

- Battle-tested prompts (from real implementations)
- Known time estimates
- Documented challenges and solutions

**3. Teaching:**

- Prompts serve as curriculum material
- Show best practices
- Document evolution of patterns

**4. Efficiency:**

- Infrastructure setup more efficient each time
- Reduced trial and error
- Known working patterns

### How to Use with Orchestration Partner

**Orchestration Partner should:**

1. Recommend infrastructure prompts based on project phase
2. Adapt prompts to specific project context
3. Validate infrastructure setup after agent completes
4. Document improvements in feature retrospectives

**Engineers should:**

1. Reference library when planning features
2. Use prompts as starting point (customize for project)
3. Feed improvements back through retrospectives
4. Apply proven patterns to new projects

---

## Conclusion

This library transforms infrastructure setup from **custom work every time** to **proven patterns executed efficiently
**.

**Benefits:**

- More efficient project starts (known patterns)
- Higher quality (battle-tested)
- Consistent architecture across projects
- Teaching material for curriculum

**Next Steps:**

1. Use Integration Testing Setup prompt for your project
2. Add Authentication prompt as implemented
3. Continue building library as you implement features

---

**Status:** Library initialized with 4 proven prompts
**Source:** Real-world successful implementations
**Quality:** A+ (all prompts from successful implementations)
**Ready for:** Immediate use in your projects
