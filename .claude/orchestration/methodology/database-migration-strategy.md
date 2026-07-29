# Database Migration Strategy: Preventing Data Loss

## Critical Problem Identified

**What Happened:** Running `npm run db:migrate` during feature migration work deleted all production data because the main
schema file contains `DROP TABLE IF EXISTS` commands.

**Impact:** Fresh database required re-seeding, loss of any custom/test data, potential production disaster if this
pattern continues.

**Root Cause:** No distinction between "initial schema setup" vs "incremental migrations" in project structure.

---

## The Two-Track Migration Pattern (MANDATORY)

### Track 1: Initial Schema (Destructive)

**File:** `src/db/schema.sql`
**Purpose:** Create database from scratch for fresh setups
**Contains:** `DROP TABLE IF EXISTS` + `CREATE TABLE` statements
**Used For:**

- Fresh project setup (`npm run setup`)
- Development database resets (`npm run reset`)
- Test database initialization (`npm run test:db:setup`)
- CI/CD pipeline fresh environments

**Command:** `npm run db:migrate`
**⚠️ WARNING:** This DESTROYS all existing data

**Example:**

```sql
-- Drop existing tables for clean re-runs
DROP TABLE IF EXISTS interactions;
DROP TABLE IF EXISTS leads;

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ...
);
```

### Track 2: Incremental Migrations (Safe)

**Directory:** `scripts/migrations/`
**Purpose:** Add columns/indexes to existing tables WITHOUT data loss
**Contains:** `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements ONLY
**Used For:**

- Adding new feature columns to production
- Adding indexes for performance
- Modifying existing schemas incrementally

**Command:** `psql $DATABASE_URL -f scripts/migrations/XXX-description.sql`
**✅ SAFE:** Preserves all existing data

**Example:**

```sql
-- Migration: Add AI Summary columns to leads table
-- Feature: AI Summaries
-- Date: 2025-10-01

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS ai_summary_text TEXT,
ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ai_summary_metadata JSONB;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_leads_ai_summary_generated_at
ON leads(ai_summary_generated_at)
WHERE ai_summary_generated_at IS NOT NULL;
```

---

## File Organization Structure

```
src/db/
  schema.sql                    # Initial schema (includes DROP commands)

scripts/
  run-schema.js                 # Executes schema.sql (DESTRUCTIVE)
  migrations/                   # Incremental migrations (SAFE)
    001-add-summary-columns.sql
    002-add-notification-tables.sql
    003-add-auth-tables.sql
```

---

## Migration Naming Convention

**Pattern:** `XXX-feature-description.sql`

**Examples:**

- `001-add-summary-columns.sql`
- `002-add-notification-tables.sql`
- `003-add-auth-tables.sql`
- `004-add-user-preferences.sql`

**Rules:**

1. Sequential numbering (001, 002, 003...)
2. Descriptive name (feature or purpose)
3. Always use `IF NOT EXISTS` clauses
4. Include header comment with feature context

---

## Agent Guidelines: When to Use Which Track

### Infrastructure Agents (Initial Setup) → Update schema.sql

**Scenario:** Setting up initial database tables for the first time

**What to do:**

- Add table definitions to `src/db/schema.sql`
- Include DROP statements for clean re-runs
- Update both `schema.sql` AND create a migration file

**Example (Initial Infrastructure):**

```sql
-- In src/db/schema.sql:
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (...);

-- Also create scripts/migrations/001-initial-leads-table.sql:
CREATE TABLE IF NOT EXISTS leads (...);
```

### Feature Agents → Create Migration File

**Scenario:** Adding new columns/indexes to existing tables for a new feature

**What to do:**

- Create new file in `scripts/migrations/`
- Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Use `CREATE INDEX IF NOT EXISTS`
- **Never include DROP commands**
- Update `src/db/schema.sql` to reflect final state (for fresh setups)

**Example (AI Summaries Feature):**

```sql
-- scripts/migrations/003-add-summary-columns.sql
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS ai_summary_text TEXT;

-- Also update src/db/schema.sql to include these columns
-- (so fresh setups have them from the start)
```

---

## npm Scripts Strategy

### Current Scripts (Need Enhancement)

```json
{
  "db:migrate": "node scripts/run-schema.js", // DESTRUCTIVE
  "db:reset": "node scripts/reset-db.js", // DESTRUCTIVE
  "reset": "npm run db:reset && npm run seed" // DESTRUCTIVE
}
```

### Proposed Additional Scripts

```json
{
  "db:migrate:fresh": "node scripts/run-schema.js", // Explicit: DROPS tables
  "db:migrate:incremental": "node scripts/run-migrations.js", // NEW: Runs migration files
  "db:migrate": "npm run db:migrate:incremental" // SAFE default
}
```

**Rationale:**

- `db:migrate` should be SAFE by default (runs incremental migrations)
- `db:migrate:fresh` explicitly signals destructive behavior
- `db:reset` keeps current behavior (full reset + seed)

---

## Preventing Future Data Loss

### 1. Migration File Validation

**Checklist for all migration files:**

- [ ] No `DROP TABLE` commands (use `ALTER TABLE` instead)
- [ ] All changes use `IF NOT EXISTS` / `IF EXISTS` clauses
- [ ] Header comment documents feature and date
- [ ] File placed in `scripts/migrations/` directory
- [ ] Corresponding update to `src/db/schema.sql` for fresh setups

### 2. Agent Prompt Requirements

**All feature agents working with database changes MUST:**

1. Create migration file in `scripts/migrations/`
2. Use additive-only SQL commands
3. Update `src/db/schema.sql` to match final state
4. Document which command to run in session log
5. **Never suggest `npm run db:migrate` for feature changes**

### 3. Development Workflow

**Safe workflow for feature development:**

```bash
# 1. Agent creates scripts/migrations/005-new-feature.sql
# 2. Apply migration safely:
psql $DATABASE_URL -f scripts/migrations/005-new-feature.sql

# 3. Verify migration worked:
psql $DATABASE_URL -c "\d table_name"

# 4. Continue development with data intact
```

**Unsafe workflow (avoid):**

```bash
# ❌ DON'T DO THIS if you have data you want to keep:
npm run db:migrate  # This drops all tables!
```

---

## Migration File Template

Save this as `scripts/migrations/_TEMPLATE.sql`:

```sql
-- Migration: [Brief description of what this adds]
-- Feature: [Feature name, e.g., AI Summaries]
-- Date: [YYYY-MM-DD]
-- Author: [Agent name or human name]

-- [Detailed explanation of changes and why they're needed]

-- Add new columns
ALTER TABLE [table_name]
ADD COLUMN IF NOT EXISTS [column_name] [data_type] [constraints];

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS [index_name]
ON [table_name]([column_name])
WHERE [optional_condition];

-- Add comments for documentation
COMMENT ON COLUMN [table_name].[column_name] IS '[Description of purpose]';

-- Verify changes
-- Run: \d [table_name] to verify
```

---

## Testing Strategy

### Before Applying Any Migration

**Safe testing workflow:**

```bash
# 1. Create a test database with current data
pg_dump new_crm > backup.sql
createdb new_crm_test
psql new_crm_test < backup.sql

# 2. Test migration on test database
psql new_crm_test -f scripts/migrations/XXX-new-migration.sql

# 3. Verify it worked and data is intact
psql new_crm_test -c "SELECT COUNT(*) FROM leads;"
psql new_crm_test -c "\d leads"

# 4. If successful, apply to main database
psql new_crm -f scripts/migrations/XXX-new-migration.sql
```

---

## Implementation Requirements

**For all future features requiring database changes:**

1. ✅ Feature agent creates migration file in `scripts/migrations/`
2. ✅ Migration file uses additive-only commands (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`)
3. ✅ Agent updates `src/db/schema.sql` to reflect final state (for documentation)
4. ✅ Agent documents command to run: `psql $DATABASE_URL -f scripts/migrations/XXX.sql`
5. ✅ Session log includes: "Migration tested, data preserved"
6. ❌ Agent NEVER suggests `npm run db:migrate` for feature changes

---

## Methodology Learning: Infrastructure-First Pattern Gap

**Original Pattern (Initial Implementation):**

- Infrastructure-first: Setup database BEFORE parallel agents run ✅
- Single schema file with DROP commands ✅ (for fresh setups)

**Gap Discovered:**

- No incremental migration strategy ❌
- Feature changes triggered full schema rebuild ❌
- Data loss on feature additions ❌

**Enhanced Pattern:**

- Infrastructure-first: Setup database BEFORE parallel agents run ✅
- Initial schema file for fresh setups (`schema.sql` with DROP) ✅
- **Incremental migration directory for feature additions (`migrations/` without DROP)** ✅ NEW
- **Clear documentation of when to use which approach** ✅ NEW

---

## Status: Critical Gap Identified, Systematic Solution Designed

**Problem:** Feature database changes destroyed all data
**Solution:** Two-track migration pattern (initial schema vs incremental migrations)
**Evidence:** Feature migration required full database reseed due to DROP commands
**Prevention:** Migration directory structure + agent guidelines + validation checklist

**Ready for:** Future implementations with proper migration management preventing data loss
