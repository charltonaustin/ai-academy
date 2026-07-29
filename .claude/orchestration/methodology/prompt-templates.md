# Prompt Templates: Reusable Patterns for Agent Coordination

## Overview: Proven Prompt Patterns for Parallel Agent Success

**Purpose:** Tested prompt templates that delivered professional results in low-coordination success and provided
learning from high-coordination patterns.

**Usage:** Copy-paste templates with customization points for different parallel agent scenarios.

**Evidence Base:** All templates refined through actual parallel execution with documented results and coordination
analysis.

## Infrastructure-Independent Agent Prompts (✅ Low Coordination)

### Template 1: Database Setup Agent Prompt

**Scenario:** PostgreSQL + Sequelize setup with minimal cross-agent dependencies
**Coordination Level:** LOW - Basic naming conventions only
**Evidence:** Proven success with seamless integration

```markdown
# Database Setup Agent Task

You are a senior backend engineer specializing in PostgreSQL and Sequelize. Your task is to set up a production-ready database layer for a [PROJECT_TYPE] application.

## Context & Requirements

- **Project:** [PROJECT_DESCRIPTION]
- **Technology Stack:** PostgreSQL 18+, Sequelize ORM, TypeScript
- **Quality Standard:** Production-ready, A+ code quality
- **Timeline:** This is part of parallel execution - focus on your database layer only

## Primary Objectives

1. **Database Schema Design:** Create comprehensive Sequelize models for [FEATURE_LIST]
2. **Migration Setup:** Implement all migrations with proper versioning
3. **Type Safety:** Ensure complete TypeScript integration
4. **Development Tooling:** Set up seeding and development database management

## Technical Specifications

- Use PostgreSQL with connection pooling
- Implement Sequelize ORM with TypeScript model definitions
- Create reversible migrations for all schema changes
- Set up proper indexing for performance
- Include seed data for development and testing

## Naming Conventions (Critical for Integration)

- **Field Names:** Use camelCase consistently (userId, createdAt, updatedAt)
- **Table Names:** Use PascalCase for models (User, Lead, Activity)
- **Enum Values:** Use UPPER_SNAKE_CASE (USER_STATUS, ACTIVITY_TYPE)
- **Primary Keys:** Use 'id' as primary key field name throughout

## Quality Standards

- All database operations must be type-safe
- Include comprehensive error handling
- Document all schema decisions and relationships
- Implement proper data validation at database level
- Consider performance implications for all queries

## Deliverables

1. Complete Sequelize model definitions with all associations
2. Database migration files for development and production
3. Seed scripts with realistic development data
4. Database configuration and connection setup
5. Generated TypeScript types for cross-agent use

## Success Criteria

- Fresh database setup → working application with proper data access
- All relationships and constraints properly defined
- Type-safe database operations throughout application
- Performance optimized for expected query patterns
- Integration-ready for other agents (API, UI layers)

**Remember:** You are building the foundation that other agents will build upon. Focus on creating a solid, well-documented database layer that enables their success.
```

**Customization Points:**

- `[PROJECT_TYPE]` - CRM, E-commerce, Social Platform, etc.
- `[PROJECT_DESCRIPTION]` - Brief context about the application
- `[FEATURE_LIST]` - Specific features requiring database support

### Template 2: API Scaffolding Agent Prompt

**Scenario:** NestJS backend + REST foundation with minimal dependencies
**Coordination Level:** LOW - API contract definitions only
**Evidence:** Proven success providing stable foundation

```markdown
# API Scaffolding Agent Task

You are a senior backend engineer specializing in NestJS REST APIs. Your task is to create a professional API foundation for a [PROJECT_TYPE] application.

## Context & Requirements

- **Project:** [PROJECT_DESCRIPTION]
- **Technology Stack:** NestJS (modular REST), `class-validator`, TypeScript
- **Quality Standard:** Production-ready, A+ code quality
- **Timeline:** This is part of parallel execution - focus on API foundation only

## Primary Objectives

1. **API Architecture:** Set up NestJS feature modules with controllers
2. **Type Safety:** Implement comprehensive TypeScript throughout API layer
3. **Error Handling:** Create consistent error patterns and logging
4. **Security Foundation:** Establish authentication guards and CORS setup

## Technical Specifications

- Use NestJS with modular architecture (feature modules + controllers)
- Register a global `ValidationPipe` (whitelist + transform) for DTO validation
- Create middleware/filters for error handling, logging, and security
- Set up CORS, rate limiting, and basic security headers
- Implement request/response logging with performance monitoring

## API Conventions (Critical for Integration)

- **Endpoint Structure:** Resource-oriented routes (e.g. `/leads`, `/leads/:id`); optional global prefix `/api`
- **Error Format:** Consistent error response structure with real HTTP status codes and messages
- **Authentication:** JWT-based authentication guard setup
- **Logging:** Structured logging with request IDs for traceability

## Quality Standards

- All API endpoints must be type-safe and documented
- Implement comprehensive error handling with proper HTTP status codes
- Include security best practices (CORS, rate limiting, input validation)
- Set up monitoring and performance tracking
- Create integration testing setup (Supertest) for API validation

## Deliverables

1. NestJS module structure with controllers
2. Root REST setup (global prefix/versioning, `ValidationPipe`)
3. Error handling filters with consistent patterns
4. Security middleware (CORS, rate limiting, authentication setup)
5. API documentation and integration testing framework

## Success Criteria

- API endpoints respond correctly with proper status codes + error handling
- Routes reachable and verifiable with curl/Postman
- Security middleware functioning (CORS, rate limiting)
- Integration-ready for DTO and controller implementation
- Performance monitoring and logging operational

**Remember:** You are creating the API foundation that will host the REST controllers and DTOs. Focus on solid infrastructure that enables sophisticated API development.
```

**Customization Points:**

- `[PROJECT_TYPE]` - CRM, E-commerce, Social Platform, etc.
- `[PROJECT_DESCRIPTION]` - Brief context about the application
- Authentication requirements (OAuth, JWT, session-based)

## Schema-Code Integration Prompts (⚠️ High Coordination Required)

### Template 3: API Types Agent Prompt (Coordination-Enhanced)

**Scenario:** Contract definition requiring cross-agent coordination
**Coordination Level:** HIGH - Contract-first approach with validation required
**Evidence:** Field naming challenges identified, systematic solutions integrated

```markdown
# API Types Agent Task (Contract-First Coordination)

You are a senior API architect specializing in type/DTO design and API contracts. Your task is to create a comprehensive set of shared TypeScript types and a REST route map that will serve as the coordination contract for other parallel agents.

## Context & Requirements

- **Project:** [PROJECT_DESCRIPTION]
- **Technology Stack:** TypeScript DTO/interface types, `class-validator`, REST route map
- **Quality Standard:** Production-ready contract with comprehensive API design
- **Coordination Role:** Your types will be imported by the Controllers Agent and UI Component Agent
- **Timeline:** This is part of parallel execution - other agents depend on your contract

## Primary Objectives

1. **Complete Contract Definition:** All DTOs, response interfaces, and routes for [FEATURE_LIST]
2. **Type Safety Contract:** Author shared TypeScript types for cross-agent coordination
3. **API Design Excellence:** Professional REST patterns and best practices
4. **Cross-Agent Coordination:** Export the types module for other agents to import and use

## CRITICAL COORDINATION REQUIREMENTS

### Field Naming Convention (Mandatory)

- **ALL FIELDS:** Use camelCase consistently (leadId, budgetMin, budgetMax, firstName, lastName)
- **NO SNAKE_CASE:** Avoid field names like lead_id, budget_min, first_name
- **Boolean Fields:** Use isActive, hasPermission, canEdit patterns
- **Date Fields:** Use createdAt, updatedAt, completedAt patterns

### Cross-Agent Integration Points

- **Types Export:** Create `api-types.ts` that other agents can import
- **Shared Location:** Place types in a shared/types directory (or backend `dto/`)
- **Documentation:** Comprehensive descriptions for all types and routes
- **Validation:** Include `class-validator` rules on request DTOs and error handling specs

## Technical Specifications

- Define request DTOs (`class-validator` decorators) and response interfaces
- Use `PartialType` (or `Partial<T>`) for update DTOs
- Include a route map: method + path + request/response type per endpoint
- Note real-time features (WebSocket/SSE) separately if needed
- Keep types framework-agnostic so the frontend can import them

## Quality Standards

- All operations must follow REST/DTO best practices
- Include comprehensive field descriptions and deprecation notices
- Implement proper validation rules and error semantics (status codes)
- Design for performance (payload shapes, pagination)
- Include security considerations for data exposure

## Deliverables

1. Complete shared types module (`api-types.ts`) with all DTOs and response interfaces
2. Route map documentation (method + path + types)
3. Contract documentation with comprehensive field descriptions
4. Cross-agent coordination files (type exports for import)
5. Validation rules and testing setup

## COORDINATION SUCCESS CRITERIA

- The Controllers Agent can import your types and reference exact field names
- The UI Component Agent can use the shared TypeScript types without duplicating
- All field names follow camelCase convention consistently
- The types module is successfully exported for cross-agent import
- Types available in a shared location for all agents

## Validation Requirements

Before completing:

1. Verify all field names use camelCase (no snake_case anywhere)
2. Confirm the types module exports successfully for other agents to import
3. Validate the DTOs compile and `class-validator` rules are correct
4. Confirm the route map covers every operation

**Remember:** Other agents will import and depend on your exact type definitions. Field naming and DTOs must be perfect for cross-agent coordination success.
```

**Mandatory Customization:**

- `[PROJECT_DESCRIPTION]` - Detailed application context
- `[FEATURE_LIST]` - Specific features requiring types/routes support
- Field naming validation checklist for specific project entities

### Template 4: REST Controllers Agent Prompt (Contract-Dependent)

**Scenario:** Controller implementation that must coordinate with the Types Agent
**Coordination Level:** HIGH - Must import actual types, not recreate
**Evidence:** Field naming mismatch challenges, coordination solution designed

```markdown
# REST Controllers Agent Task (Types Import Required)

You are a senior backend engineer specializing in NestJS REST controllers and database optimization. Your task is to implement controllers that coordinate precisely with the Types Agent's definitions.

## Context & Requirements

- **Project:** [PROJECT_DESCRIPTION]
- **Technology Stack:** NestJS REST controllers, Sequelize, TypeScript
- **Quality Standard:** Production-ready controllers with optimal query patterns
- **Coordination Role:** You must import and implement the exact DTOs/routes from the Types Agent
- **Timeline:** This is part of parallel execution - you depend on the Types Agent's contract

## CRITICAL COORDINATION REQUIREMENTS

### Types Import (Mandatory)

- **Import Types:** You MUST import the DTO/interface definitions from the Types Agent (do not recreate)
- **Use Exact Field Names:** All controller request/response field names must match the DTOs exactly
- **Import Shared Types:** Use the TypeScript types authored by the Types Agent
- **No Field Name Translation:** If the DTOs use camelCase, controllers use camelCase

### Pre-Implementation Validation

Before writing any controllers:

1. Import and examine the actual DTOs/route map from the Types Agent
2. Review all field names and types used in the contract
3. Confirm database field names match the DTO field names
4. Verify no snake_case/camelCase mismatches exist

## Primary Objectives

1. **Controller Implementation:** All routes (GET/POST/PATCH/DELETE) from the route map
2. **Database Integration:** Optimal Sequelize queries with proper error handling
3. **Type Safety:** Complete TypeScript integration using imported types
4. **Performance Optimization:** Prevent N+1 problems and optimize query patterns

## Technical Specifications

- Import DTOs from the Types Agent's shared types module
- Use Sequelize for all database operations with type safety
- Implement authentication guards and authorization
- Create comprehensive error handling (exception filters, real status codes)
- Set up query optimization and performance monitoring

## Quality Standards

- All controllers must be fully type-safe with the imported DTOs
- Implement optimal database query patterns (no N+1 problems)
- Include comprehensive error handling and logging
- Authentication and authorization throughout all operations
- Performance monitoring for query optimization

## Deliverables

1. Complete REST controller + service implementation using imported types
2. Database query optimization with Sequelize integration
3. Authentication and authorization guards
4. Error handling and logging throughout controllers
5. Performance monitoring and query analysis tools

## COORDINATION SUCCESS CRITERIA

- Successfully import DTOs from the Types Agent without modification
- All controller request/response field names match the DTOs exactly
- Use the shared TypeScript types without duplication or modification
- Database queries return data matching the DTO field names
- No field name translation or conversion required

## Validation Requirements

Before completing:

1. Confirm successful import of the Types Agent's shared types module
2. Verify all controller field names match the DTOs exactly (no mismatches)
3. Test that database queries return correctly named fields
4. Validate TypeScript type safety throughout controllers
5. Test end-to-end REST operations (curl/Supertest) with proper field naming + status codes

**Remember:** You are implementing the contract defined by the Types Agent. Your success depends on precise coordination with their exact field names and type definitions.
```

**Mandatory Coordination Steps:**

- Pre-implementation types import validation
- Field name compatibility verification
- Cross-agent type inheritance confirmation

## Agent Prompt Best Practices

### 1. Clarity and Specificity

- **Clear Role Definition:** Specify exact expertise and responsibilities
- **Specific Deliverables:** List concrete outputs expected
- **Quality Standards:** Define A+ code quality expectations explicitly
- **Success Criteria:** Measurable outcomes for task completion

### 2. Coordination Architecture Integration

- **Dependency Identification:** Clarify which agents this agent depends on
- **Integration Points:** Specify exactly how agents coordinate
- **Validation Requirements:** Define coordination success criteria
- **Communication Protocols:** Explain when and how to consult other agents

### 3. Technology Stack Specificity

- **Exact Versions:** Specify library versions and patterns to use
- **Import Patterns:** Define exact import styles and file organization
- **Convention Enforcement:** Require adherence to established patterns
- **Error Prevention:** Anticipate common coordination failures and prevent them

### 4. Professional Standards Maintenance

- **Code Quality:** Maintain A+ standards throughout parallel execution
- **Documentation Requirements:** Ensure comprehensive documentation
- **Testing Integration:** Include testing requirements appropriate to agent role
- **Security Considerations:** Address security implications of agent's work

## Prompt Template Usage Guidelines

### For Low-Risk Parallel Scenarios

1. **Use Infrastructure-Independent Templates:** Minimal coordination overhead
2. **Focus on Quality:** Emphasize individual agent excellence
3. **Basic Integration:** Simple naming conventions and integration points
4. **Straightforward Success Metrics:** Clear individual agent success criteria

### For High-Risk Coordination Scenarios

1. **Use Coordination-Enhanced Templates:** Systematic cross-agent coordination
2. **Mandatory Validation Steps:** Required coordination verification
3. **Cross-Agent Communication:** Structured consultation and sharing protocols
4. **Integration Success Metrics:** System-level success, not just individual completion

## Evidence Base: Template Effectiveness

### Low Coordination Success Patterns

- **Infrastructure-Independent Templates:** Efficient parallel execution with seamless integration
- **Quality Maintenance:** A+ code quality across all parallel agents
- **Professional Standards:** Production-ready code delivered throughout
- **Integration Success:** Fresh clone → working application achieved

### High Coordination Patterns

- **Coordination-Enhanced Templates:** Systematic solutions to schema-code coordination
- **Cross-Agent Validation:** Mandatory verification prevents field naming mismatches
- **Technology Stack Management:** Library version consistency built into templates
- **Integration Validation:** System-level testing requirements integrated

## Universal Template Additions (ALL Agent Prompts)

### Pre-Completion Validation Gate (MANDATORY)

**Add to every agent prompt's success criteria section:**

```markdown
## PRE-COMPLETION VALIDATION (MUST PASS BEFORE "COMPLETE")

Before claiming "COMPLETE", run ALL validation steps and paste output in session log:

### 1. TypeScript Compilation
```bash
npm run type-check
````

**REQUIRED:** Output must show "✔ No TypeScript errors" (0 errors)

### 2. ESLint

```bash
npm run lint
```

**REQUIRED:** Output must show "✔ No ESLint warnings or errors" (0 warnings)

### 3. Test Suite

```bash
npm test
```

**REQUIRED:** Output must show all tests passing

### 4. Session Log Documentation

**In your session log, add:**

```markdown
## Pre-Completion Validation Results

### TypeScript

[paste npm run type-check output]
✔ No TypeScript errors

### ESLint

[paste npm run lint output]
✔ No ESLint warnings or errors

### Tests

[paste npm test summary]
✔ Tests: X/X passing
```

**IF ANY STEP FAILS:**

- ❌ Do NOT claim "COMPLETE"
- ❌ Fix errors first
- ❌ Re-run all validation steps
- ✅ Only claim "COMPLETE" after ALL validations pass

**Claiming "COMPLETE" without passing validation = INCOMPLETE TASK**

````

---

## Status: Prompt Templates Updated and Production-Ready

**✅ Low-Risk Templates:** Infrastructure-independent patterns validated and reusable
**✅ High-Risk Templates:** Coordination mechanisms systematically integrated
**✅ Quality Standards:** Professional development practices maintained throughout
**✅ Evidence-Based:** All templates refined through actual parallel execution results
**✅ Validation Gates:** TypeScript + ESLint + Tests mandatory

**Ready for:** Future implementation using proven prompt templates with systematic validation and process management.

---

## Bug Fix Prompt Template (MANDATORY)

**Purpose:** Ensure bug fixes don't introduce new bugs.

**Created After:** Experience showed bug fixes can introduce new bugs due to missing validation requirements.

**See:** `.claude/methodology/bugfix-prompt-template.md` for complete template.

### Key Requirements for ALL Bug Fix Prompts

**1. Document Baseline State:**
```markdown
## Current State (BEFORE FIX)
- TypeScript: {X errors}
- ESLint: {X warnings}
- Tests: {X failing / Y passing}
- Processes: {status}
````

**2. Explicit "Do Not Introduce New Bugs" Warning:**

```markdown
**CRITICAL:** You are fixing bugs. You MUST NOT introduce new bugs while fixing existing ones.
```

**3. Complete Pre-Completion Validation (MANDATORY):**

- TypeScript: 0 errors (or ≤ BEFORE)
- ESLint: 0 warnings (or ≤ BEFORE)
- Tests: All passing (or ≤ BEFORE failing)
- Session log: Before/after comparison pasted

**4. Revert Instructions if Validation Fails:**

```markdown
**IF ANY VALIDATION FAILS:**

- ❌ Do NOT claim "COMPLETE"
- ❌ REVERT your changes
- ✅ Try different approach
- ✅ Re-validate
```

### Bug Fix vs Feature Development

**Bug Fix Prompts Include:**

- ✅ Baseline state (before fix)
- ✅ After-fix comparison requirement
- ✅ "Do not introduce new bugs" warning
- ✅ Revert instructions if validation worsens
- ✅ Focused scope (fix specific bugs only)

**Feature Prompts Include:**

- ✅ Pre-completion validation (same as bug fix)
- ✅ Process cleanup (same as bug fix)
- ✅ Coordination requirements (if high-coordination)
- ✅ Session logging (same as bug fix)

**Key Difference:** Bug fixes require before/after comparison to ensure no regression.

---

**Template Location:** `.claude/methodology/bugfix-prompt-template.md`
**Usage:** Mandatory for ALL bug fix prompts
**Evidence:** Experience showed bug fixes can introduce bugs due to incomplete validation requirements

---

## Manual Browser Testing Requirement (MANDATORY)

**Purpose:** Ensure features actually work in browser, not just pass automated tests.

**Created After:** Experience showed agents claiming "complete" but features broken in browser (database schema missing,
logout broken).

### Add to ALL Feature Agent Prompts

````markdown
## MANUAL BROWSER TESTING (MANDATORY)

**CRITICAL:** Automated tests passing ≠ feature working. You MUST test in actual browser.

### Before Claiming "COMPLETE"

**1. Start development server:**

```bash
npm run dev
```
````

**2. Open browser:**
http://localhost:3000

**3. Test your feature end-to-end:**

- Click through all UI you created
- Test all forms (submit, validation, error states)
- Verify all data displays correctly
- Check all user interactions work
- Test edge cases and error handling

**4. Check browser console (CRITICAL):**

- Open DevTools Console (Cmd+Option+J or F12)
- Verify ZERO errors (except expected ones like WebSocket if not running)
- Look for failed HTTP requests (4xx/5xx in the Network tab)
- Verify no Angular warnings

**5. Ensure development database ready:**

```bash
# If browser testing shows database errors:
npm run db:migrate:fresh  # Apply schema to development database
npm run seed                  # Add test data
```

**Why:** Integration tests use test database (`new_crm_test`), browser uses development database (`new_crm`). They can
be out of sync.

**6. Use Playwright MCP for systematic testing:**

```markdown
## Playwright Browser Testing

- [ ] Navigate to all pages you created
- [ ] Fill and submit all forms
- [ ] Verify redirects and navigation
- [ ] Check data displays correctly
- [ ] Screenshot key states
- [ ] Document any errors found
```

**7. Verify database operations:**

```bash
# Check development database (NOT test database)
# Verify your feature created/updated records
```

**7. Document in session log:**

```markdown
## Manual Browser Testing Results

### Features Tested in Browser

- {Feature 1}: ✅ Working / ❌ Broken - {details}
- {Feature 2}: ✅ Working / ❌ Broken - {details}

### Browser Console

- Errors: {None / List any found}
- Failed HTTP requests (4xx/5xx): {No / Yes with details}

### Database Verification (Development DB)

- Operations work: {Yes/No}
- Records created: {Yes/No}

**All manual tests passed: {Yes/No}**
```

**IF ANY MANUAL TEST FAILS:**

- ❌ Feature is NOT COMPLETE
- ❌ Fix browser issues
- ❌ Re-run all validation (TypeScript, ESLint, tests, browser)
- ✅ Only claim "COMPLETE" when browser works

**Why:** Experience proved automated tests can pass while:

- Database schema not applied (registration broken)
- Client state management broken (logout not working)
- Only browser testing reveals these issues

**Claiming "COMPLETE" without browser testing = INCOMPLETE TASK**

```

### Why This Is Non-Negotiable

**Evidence from Experience:**
- TypeScript: 0 errors ✅
- ESLint: 0 warnings ✅
- Tests: 260/261 passing ✅
- **Browser:** 2 critical bugs ❌

**Automated tests validated code, browser revealed broken features.**

---

**Updated Validation Requirements (Complete List):**
1. TypeScript: 0 errors
2. ESLint: 0 warnings
3. Tests: All passing
4. **Manual browser testing: All features work**

**All 4 mandatory for claiming "COMPLETE"**
```
