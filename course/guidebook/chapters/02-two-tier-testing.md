# Chapter 02: Two-Tier Testing Strategy

**Part 1: Strategic Orchestration Foundations**
**When to read:** Day 2 Morning

---

## Overview

Why unit tests WITH mocks + integration tests WITHOUT mocks are both required. This chapter explains the mock blindness
problem and shows how to write tests that catch real bugs.

---

## 1. Theory: The Mock Blindness Problem

### The Illusion of Safety

**Common scenario:**

```
✅ Tests: 47/47 passing
✅ TypeScript: 0 errors
✅ ESLint: 0 warnings

[You deploy to production]

❌ Runtime error: Cannot read property 'toISOString' of string
```

**What happened?** Mocks created a false sense of security.

### How Mocks Hide Integration Bugs

**Mock-heavy tests validate logic, not integration:**

```typescript
// Unit test (WITH mocks)
jest.mock('../database/models/Lead');

it('returns formatted data', async () => {
    const mockLead = {
        id: '123',
        createdAt: new Date('2024-01-01'),  // ← Mock returns Date object
        updatedAt: new Date('2024-01-02'),
    };

    Lead.findByPk.mockResolvedValue(mockLead);

    const result = await leadService.getLeadSummary('123');

    expect(result.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    // ✅ Test passes - mock returns Date, code expects Date
});
```

**Real production behavior:**

```typescript
// What actually happens in production
const lead = await Lead.findByPk('123');

console.log(typeof lead.createdAt);  // → "string" (PostgreSQL returns strings!)

lead.createdAt.toISOString();  // ❌ TypeError: createdAt.toISOString is not a function
```

**The problem:** Mock returned `new Date()`, PostgreSQL returns `"2024-01-01T00:00:00.000Z"` (string). Test passed,
production broke.

### Why This Happens with AI-Generated Code

AI agents default to heavily mocked tests because:

1. **Faster to write** - No database setup, no service configuration
2. **Faster to run** - No I/O, pure logic
3. **Easier to control** - Deterministic outcomes, no flakiness
4. **Training data bias** - Most test examples online use mocks heavily

**Result:** Agents produce passing tests that validate logic but miss integration issues.

### The Two-Tier Solution

**Tier 1: Unit Tests (WITH mocks)**

- Purpose: Test logic in isolation, fast feedback
- Validates: Business rules, edge cases, error handling
- **Limitation:** Cannot catch type mismatches between layers

**Tier 2: Integration Tests (NO mocks)**

- Purpose: Test cross-layer integration, catch real bugs
- Validates: Database types, service communication, full stack flow
- **Strength:** Catches issues unit tests hide

**Both required:** Unit tests for speed and coverage, integration tests for confidence.

---

## 2. Evidence: Integration Testing Discovery

### Real Example: The Date String Bug

**Scenario:** System alerts feature for CRM

**Unit tests (all mocked):**

```typescript
// ✅ 8/8 unit tests passed
describe('SystemAlert Service (unit)', () => {
    beforeEach(() => {
        jest.mock('../models/SystemAlert');
    });

    it('stores alert in database', async () => {
        const mockAlert = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            message: 'Test alert',
            createdAt: new Date('2024-01-01'),  // ← Mock returns Date
        };

        SystemAlert.create.mockResolvedValue(mockAlert);

        const result = await alertService.createAlert({message: 'Test alert'});

        expect(result.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });
});
```

**Production reality:**

```typescript
// ❌ Runtime error in production
const alert = await alertService.createAlert({message: 'Critical error'});

// PostgreSQL returns: { id: "550e8400-...", createdAt: "2024-01-01T00:00:00.000Z" }
// Code expects:       { id: "550e8400-...", createdAt: Date object }

alert.createdAt.toISOString();  // ❌ TypeError: createdAt.toISOString is not a function
```

**Why the bug existed:**

1. Sequelize configured with `raw: true` (returns plain objects, not instances)
2. PostgreSQL timestamp columns return strings, not Date objects
3. Mock returned `new Date()`, hiding the type mismatch
4. TypeScript didn't catch it (runtime behavior ≠ compile-time types)

**The fix required:**

```typescript
// Option 1: Convert at database layer
const alert = await SystemAlert.create({message}, {raw: false});  // Returns Sequelize instance with Date getters

// Option 2: Convert in service layer
const alert = await SystemAlert.create({message});
return {
    ...alert,
    createdAt: new Date(alert.createdAt),  // Explicit conversion
};
```

**Integration test that WOULD have caught this:**

```typescript
// ✅ Integration test (NO mocks)
it('returns Date objects', async () => {
    const alert = await alertService.createAlert({message: 'Test alert'});

    // Real database query, real type behavior
    expect(alert.createdAt).toBeInstanceOf(Date);  // ❌ Would have failed
    expect(alert.createdAt.toISOString()).toMatch(/\d{4}-\d{2}-\d{2}/);  // ❌ Would have failed
});
```

### Real Example: The Invalid UUID Bug

**Scenario:** System alerts with UUID validation

**Unit tests (all mocked):**

```typescript
// ✅ 5/5 unit tests passed
it('broadcasts to all users', async () => {
    const mockAlert = {
        id: 'test-123',  // ← Mock uses invalid UUID format
        message: 'Test',
    };

    SystemAlert.findByPk.mockResolvedValue(mockAlert);

    await alertService.publishAlert('test-123');

    expect(broadcastService.send).toHaveBeenCalled();
});
```

**Production reality:**

```typescript
// ❌ Database constraint violation
await alertService.publishAlert('test-123');
// ERROR: invalid input syntax for type uuid: "test-123"
```

**Why the bug existed:**

1. Database column type: UUID (requires valid UUID format)
2. Mock used `'test-123'` (invalid UUID, but mock accepted it)
3. Real PostgreSQL rejects invalid UUIDs with constraint error

**Integration test that WOULD have caught this:**

```typescript
// ✅ Integration test (NO mocks)
it('requires valid UUID', async () => {
    await expect(
        alertService.publishAlert('test-123')  // Invalid UUID
    ).rejects.toThrow('invalid input syntax for type uuid');
});

it('works with valid UUID', async () => {
    const alert = await alertService.createAlert({message: 'Test'});
    // alert.id is real UUID from database

    await expect(
        alertService.publishAlert(alert.id)
    ).resolves.not.toThrow();
});
```

### The Pattern

**❌ WRONG: All mocked (hides type mismatches)**

```typescript
jest.mock('@/lib/services/notification.service');
jest.mock('../models/SystemAlert');

it('creates alert', async () => {
    SystemAlert.create.mockResolvedValue({id: 'fake-id', createdAt: new Date()});
    // Mock controls everything - no real behavior tested
});
```

**✅ CORRECT: Real database, real services (catches bugs)**

```typescript
// NO MOCKS - use real database
it('creates notification and persists to database', async () => {
    const notification = await notificationService.createAndPublish({
        userId: testUser.id,
        message: 'Test notification',
    });

    // Real database query
    const dbRecord = await sequelize.models.Notification.findByPk(notification.id);

    expect(dbRecord).toBeDefined();
    expect(dbRecord.createdAt).toBeInstanceOf(Date);  // Catches string vs Date bugs
    expect(dbRecord.id).toMatch(/^[0-9a-f-]{36}$/);   // Catches invalid UUID bugs
});
```

---

## 3. Protocol: Two-Tier Testing Requirements

### Tier 1: Unit Tests (WITH Mocks)

**Purpose:** Test logic in isolation, fast feedback

**Characteristics:**

- Mocked external dependencies (database, services, APIs)
- Fast execution (<1s per test)
- Deterministic (no flakiness)
- High coverage of edge cases

**What they validate:**

- Business logic correctness
- Error handling paths
- Input validation
- Conditional branches

**What they miss:**

- Type mismatches between layers
- Database constraint violations
- Service integration failures
- Real API behavior

**Example:** "markAsRead throws error if notification not found"

```typescript
it('throws if notification not found', async () => {
    Notification.findByPk.mockResolvedValue(null);  // Mock not found

    await expect(
        notificationService.markAsRead('non-existent-id')
    ).rejects.toThrow('Notification not found');
});
```

### Tier 2: Integration Tests (NO Mocks)

**Purpose:** Test cross-layer integration, catch real bugs

**Characteristics:**

- NO mocks (real database, real services)
- Slower execution (database I/O, API calls)
- Tests actual system behavior
- Minimum 1 per feature

**What they validate:**

- Database query correctness
- Type compatibility across layers
- Service communication
- Constraint validation
- Full stack integration

**What they catch:**

- Date string vs Date object bugs
- UUID format violations
- Database constraint errors
- Type mismatches TypeScript can't catch

**Example:** "Create notification → Verify in DB → Verify broadcast"

```typescript
it('persists to database', async () => {
    // NO MOCKS - use real database
    const notification = await notificationService.createNotification({
        userId: testUser.id,
        message: 'Integration test',
    });

    // Real database query
    const dbRecord = await Notification.findByPk(notification.id);

    expect(dbRecord).toBeDefined();
    expect(dbRecord.createdAt).toBeInstanceOf(Date);  // Real type validation
    expect(dbRecord.userId).toBe(testUser.id);
});
```

### Minimum Requirements

Every feature must have BOTH tiers:

```yaml
per_task:
  unit_tests: 'Multiple (edge cases with mocks)'
  integration_tests: 'At least 1 (happy path, NO MOCKS)'

per_feature:
  e2e_tests: 'At least 1 (full user flow validation)'
```

**"Tests passing" means:**

- ✅ All unit tests pass (WITH mocks)
- ✅ All integration tests pass (NO mocks)
- ✅ All e2e tests pass (full browser/API flow)

**Not just:** "Unit tests pass" ✅

---

## 4. Practice: Writing Both Test Types

### Example: Lead Summary Feature

**Feature:** Generate AI summaries for leads, store in database

**Tier 1: Unit Tests (WITH mocks)**

```typescript
// test/unit/lead-summary.service.spec.ts
import {LeadSummaryService} from '@/services/lead-summary.service';

jest.mock('@/models/Lead');
jest.mock('@/services/llm.service');

describe('LeadSummaryService (unit)', () => {
    let service: LeadSummaryService;

    beforeEach(() => {
        service = new LeadSummaryService();
        jest.clearAllMocks();
    });

    it('calls LLM with lead data', async () => {
        const mockLead = {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            budget: 50000,
        };

        const mockSummary = 'John Doe is a high-value lead...';

        Lead.findByPk.mockResolvedValue(mockLead);
        llmService.generate.mockResolvedValue(mockSummary);

        const result = await service.generateSummary('123');

        expect(llmService.generate).toHaveBeenCalledWith(
            expect.stringContaining('John Doe')
        );
        expect(result).toBe(mockSummary);
    });

    it('throws if lead not found', async () => {
        Lead.findByPk.mockResolvedValue(null);

        await expect(
            service.generateSummary('non-existent')
        ).rejects.toThrow('Lead not found');
    });

    it('handles LLM failure gracefully', async () => {
        Lead.findByPk.mockResolvedValue({id: '123', name: 'Test'});
        llmService.generate.mockRejectedValue(new Error('API limit exceeded'));

        await expect(
            service.generateSummary('123')
        ).rejects.toThrow('Failed to generate summary');
    });
});
```

**What unit tests validated:**

- ✅ Service calls LLM with correct data
- ✅ Error handling for missing lead
- ✅ Error handling for LLM failure

**What unit tests missed:**

- ❌ Database query returns correct types
- ❌ Summary persisted to database correctly
- ❌ createdAt field is Date vs string

**Tier 2: Integration Tests (NO mocks)**

```typescript
// test/integration/lead-summary.service.spec.ts
import {LeadSummaryService} from '@/services/lead-summary.service';
import {Lead} from '@/models/Lead';
import {setupTestDatabase, teardownTestDatabase} from '@/test/helpers/db';

describe('LeadSummaryService (integration)', () => {
    let service: LeadSummaryService;
    let testLead: Lead;

    beforeAll(async () => {
        await setupTestDatabase();
        service = new LeadSummaryService();

        // Create real test data
        testLead = await Lead.create({
            name: 'Integration Test Lead',
            email: 'integration@test.com',
            budget: 75000,
        });
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('persists to database', async () => {
        // NO MOCKS - real database, real LLM
        const summary = await service.generateSummary(testLead.id);

        // Verify summary generated
        expect(summary).toBeDefined();
        expect(summary.length).toBeGreaterThan(50);

        // Verify persisted to database
        const dbLead = await Lead.findByPk(testLead.id);

        expect(dbLead.summary).toBe(summary);
        expect(dbLead.summaryGeneratedAt).toBeInstanceOf(Date);  // ← Catches string vs Date bug
    });

    it('updates existing summary when regenerated', async () => {
        // Generate initial summary
        const firstSummary = await service.generateSummary(testLead.id);

        // Update lead data
        await testLead.update({budget: 150000});

        // Regenerate summary
        const secondSummary = await service.generateSummary(testLead.id);

        expect(secondSummary).not.toBe(firstSummary);

        // Verify database updated
        const dbLead = await Lead.findByPk(testLead.id);
        expect(dbLead.summary).toBe(secondSummary);
    });
});
```

**What integration tests validated:**

- ✅ Real database query works
- ✅ Summary persisted correctly
- ✅ createdAt field is correct type (Date)
- ✅ Real LLM integration works (or fails correctly)
- ✅ Update logic works end-to-end

**Result:** Integration test catches bugs unit tests missed.

---

## 5. NestJS Examples

### Unit Test Pattern (Sequelize Mocked)

**Testing NestJS service with mocked Sequelize:**

```typescript
// src/services/lead.service.spec.ts (unit test)
import {Test} from '@nestjs/testing';
import {getModelToken} from '@nestjs/sequelize';
import {LeadService} from './lead.service';
import {Lead} from '../models/lead.model';

describe('LeadService (unit)', () => {
    let service: LeadService;
    let leadModel: typeof Lead;

    const mockLeadModel = {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LeadService,
                {
                    provide: getModelToken(Lead),
                    useValue: mockLeadModel,
                },
            ],
        }).compile();

        service = module.get<LeadService>(LeadService);
        leadModel = module.get(getModelToken(Lead));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns lead when exists', async () => {
        const mockLead = {
            id: '123',
            name: 'Test Lead',
            email: 'test@example.com',
            createdAt: new Date('2024-01-01'),  // ← Mock returns Date
        };

        mockLeadModel.findByPk.mockResolvedValue(mockLead);

        const result = await service.findById('123');

        expect(result).toEqual(mockLead);
        expect(mockLeadModel.findByPk).toHaveBeenCalledWith('123');
    });

    it('throws when lead not found', async () => {
        mockLeadModel.findByPk.mockResolvedValue(null);

        await expect(
            service.findById('non-existent')
        ).rejects.toThrow('Lead not found');
    });

    it('validates positive budget values', async () => {
        await expect(
            service.updateBudget('123', -5000)
        ).rejects.toThrow('Budget must be positive');

        expect(mockLeadModel.update).not.toHaveBeenCalled();
    });
});
```

**What this validates:**

- ✅ Service logic (business rules)
- ✅ Error handling (validation, not found)
- ✅ Mock interactions (correct parameters)

**What this misses:**

- ❌ Real database behavior (string vs Date)
- ❌ Database constraints (UUID format, NOT NULL)
- ❌ Sequelize query correctness

### Integration Test Pattern (Real Database)

**Testing NestJS service with real Sequelize:**

```typescript
// src/services/lead.service.integration.spec.ts (integration test)
import {Test} from '@nestjs/testing';
import {SequelizeModule} from '@nestjs/sequelize';
import {LeadService} from './lead.service';
import {Lead} from '../models/lead.model';
import {setupTestDatabase, teardownTestDatabase} from '@test/helpers';

describe('LeadService (integration)', () => {
    let service: LeadService;

    beforeAll(async () => {
        await setupTestDatabase();

        const module = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    host: 'localhost',
                    port: 5433,
                    username: 'test',
                    password: 'test',
                    database: 'test_db',
                    autoLoadModels: true,
                    synchronize: true,
                }),
                SequelizeModule.forFeature([Lead]),
            ],
            providers: [LeadService],
        }).compile();

        service = module.get<LeadService>(LeadService);
    });

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('persists to database', async () => {
        // NO MOCKS - real database operation
        const leadData = {
            name: 'Integration Test Lead',
            email: 'integration@test.com',
            budget: 75000,
        };

        const created = await service.createLead(leadData);

        // Verify returned object
        expect(created.id).toBeDefined();
        expect(created.name).toBe(leadData.name);
        expect(created.createdAt).toBeInstanceOf(Date);  // ← Real type check

        // Verify database persistence
        const dbLead = await Lead.findByPk(created.id);
        expect(dbLead).toBeDefined();
        expect(dbLead.email).toBe(leadData.email);
    });

    it('persists budget updates', async () => {
        // Create real test data
        const lead = await Lead.create({
            name: 'Test Lead',
            email: 'test@example.com',
            budget: 50000,
        });

        // Update budget
        const updated = await service.updateBudget(lead.id, 100000);

        expect(updated.budget).toBe(100000);

        // Verify database updated
        const dbLead = await Lead.findByPk(lead.id);
        expect(dbLead.budget).toBe(100000);
    });

    it('handles case sensitivity in email search', async () => {
        await Lead.create({
            name: 'Test Lead',
            email: 'Test@Example.com',
            budget: 50000,
        });

        // Test real database case sensitivity behavior
        const found = await service.findByEmail('test@example.com');

        // This catches database collation issues
        expect(found).toBeDefined();
        expect(found.email.toLowerCase()).toBe('test@example.com');
    });

    it('enforces database constraints', async () => {
        // Test UUID constraint
        await expect(
            service.updateBudget('invalid-uuid', 50000)
        ).rejects.toThrow(/invalid input syntax for type uuid/);

        // Test NOT NULL constraint
        await expect(
            Lead.create({name: 'Test', email: null})
        ).rejects.toThrow(/null value in column "email"/);
    });
});
```

**What this validates:**

- ✅ Real database queries work
- ✅ Correct types returned (Date vs string)
- ✅ Database constraints enforced (UUID, NOT NULL)
- ✅ Case sensitivity behavior
- ✅ Persistence across queries

**What unit tests would have missed:**

- ❌ PostgreSQL returns strings for timestamps
- ❌ UUID constraint violations
- ❌ Email case sensitivity in database
- ❌ NOT NULL constraints

### REST Controller Integration Test

**Testing a REST controller with real database:**

```typescript
// src/leads/lead.controller.integration.spec.ts
import {Test} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../app.module';
import {setupTestDatabase, teardownTestDatabase} from '@test/helpers';

describe('LeadController (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        await setupTestDatabase();

        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await teardownTestDatabase();
    });

    it('returns correct types from POST /leads', async () => {
        const response = await request(app.getHttpServer())
            .post('/leads')
            .send({
                name: 'REST Test Lead',
                email: 'rest@test.com',
                budget: 75000,
            })
            .expect(201);

        const lead = response.body;

        expect(lead.id).toMatch(/^[0-9a-f-]{36}$/);  // UUID format
        expect(lead.name).toBe('REST Test Lead');
        expect(lead.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);  // ISO date string

        // This catches JSON serialization issues
        expect(typeof lead.createdAt).toBe('string');  // dates serialize to ISO strings
    });

    it('filters leads by budget', async () => {
        // Create test data
        await Lead.create({name: 'Lead 1', email: 'lead1@test.com', budget: 50000});
        await Lead.create({name: 'Lead 2', email: 'lead2@test.com', budget: 150000});

        const response = await request(app.getHttpServer())
            .get('/leads')
            .query({minBudget: 100000})
            .expect(200);

        const leads = response.body;

        expect(leads).toHaveLength(1);
        expect(leads[0].name).toBe('Lead 2');
        expect(leads[0].budget).toBe(150000);
    });
});
```

**Result:** Integration tests catch JSON serialization, database filtering, and full-stack type compatibility issues
that unit tests miss.

---

## Key Takeaways

- [ ] **Mock blindness problem:** Mocks hide type mismatches between layers (Date vs string, invalid UUIDs)
- [ ] **Unit tests (WITH mocks):** Fast, test logic, cover edge cases - but miss integration issues
- [ ] **Integration tests (NO mocks):** Slower, test real system - catch bugs unit tests hide
- [ ] **Both required:** Minimum 1 integration test per task (validates end-to-end flow)
- [ ] **AI-generated code gotcha:** Agents default to mock-heavy tests that pass but miss real bugs
- [ ] **"Tests passing" means:** Unit tests ✅ AND integration tests ✅ AND e2e tests ✅
- [ ] **Real examples matter:** Date string bug and invalid UUID bug both had passing unit tests
- [ ] **Integration tests catch:** Database constraints, type mismatches, case sensitivity, JSON serialization

---

**Next Chapter:** The 5 Validation Gates
