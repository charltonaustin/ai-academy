# Environment Variable Validation Protocol

**Purpose:** Ensure environment variables are correctly configured WITHOUT reading secret values

**Pattern:** Validate schema, detect missing variables, automatically update .env.example

---

## Core Principle: Schema Validation, Not Secret Reading

**DON'T read:** `.env`, `.env.local`, `.env.development` (contain secrets)

**DO read:** `.env.example` (template, no secrets), code files (to find required variables)

**DO validate:** Required variables exist, schema is complete, new variables documented

---

## Environment Variable Detection (Code Analysis)

### Finding Required Environment Variables

**Search codebase for environment variable usage:**

```bash
# Find all process.env usage
grep -r "process.env" src/ --include="*.ts" --include="*.js"

# Common patterns:
# process.env.DATABASE_URL
# process.env.JWT_SECRET
# process.env.PORT
# process.env.NODE_ENV
```

**Extract variable names from code:**

```typescript
// Found in src/config/database.ts
const dbUrl = process.env.DATABASE_URL;  // → Required: DATABASE_URL

// Found in src/auth/jwt.service.ts
const secret = process.env.JWT_SECRET;   // → Required: JWT_SECRET

// Found in src/main.ts
const port = process.env.PORT || 3000;   // → Optional: PORT (has default)
```

### Categorize Variables

**Required (no default value):**

- DATABASE_URL
- JWT_SECRET

**Optional (has default):**

- PORT (defaults to 3000)
- NODE_ENV (defaults to 'development')

**By service:**

- Database: DATABASE_URL, DB_POOL_SIZE
- Authentication: JWT_SECRET, JWT_EXPIRES_IN
- Server: PORT, HOST
- External services: REDIS_URL, STRIPE_API_KEY

---

## Validation Protocol (Run Before Creating Prompts)

### Step 1: Scan Code for Environment Variables

```bash
# Find all process.env usage
grep -r "process.env\." src/ -o | sort -u

# Example output:
# process.env.DATABASE_URL
# process.env.JWT_SECRET
# process.env.PORT
# process.env.REDIS_URL
```

### Step 2: Check .env.example Completeness

```bash
# Read .env.example (safe - no secrets)
cat .env.example

# Compare with variables found in code
# Missing from .env.example? → Flag for addition
```

### Step 3: Identify Missing Variables

**Variables used in code but NOT in .env.example:**

Example:

```
Code uses: DATABASE_URL, JWT_SECRET, PORT, REDIS_URL
.env.example has: DATABASE_URL, JWT_SECRET, PORT
Missing: REDIS_URL ← FLAG THIS
```

### Step 4: Alert Engineer + Auto-Update .env.example

**Orchestration partner should:**

```markdown
**ENVIRONMENT VALIDATION ALERT:**

I found environment variables used in code that are NOT in .env.example:

Missing variables:
- REDIS_URL (used in src/cache/redis.service.ts:12)

I will add these to .env.example with placeholder values.

**Action required from you:**
After I update .env.example, please:
1. Review the new variables
2. Add actual values to your .env.local (if needed)
3. Update team documentation if this is a new service dependency
```

**Then automatically update .env.example:**

```bash
# Add to .env.example
echo "\n# Redis Configuration" >> .env.example
echo "REDIS_URL=redis://localhost:6379" >> .env.example
```

---

## Environment Variable Validation in Agent Prompts

### Add to EVERY Agent Prompt

```markdown
## ENVIRONMENT VARIABLE VALIDATION (MANDATORY)

### Before Starting Implementation

**1. Check if your feature introduces NEW environment variables:**

```bash
# Search your implementation for process.env usage
grep -r "process.env" <files-you-will-create>
```

**2. If you introduce NEW variables, you MUST:**

- [ ] Add to .env.example with descriptive comment and placeholder value
- [ ] Alert engineer in session log: "NEW environment variable added: {VAR_NAME}"
- [ ] Document in README if it's a new service dependency
- [ ] Verify variable has safe default OR clear error message if missing

**Example:**

```typescript
// ❌ BAD - Silent failure if missing
const jwtSecret = process.env.JWT_SECRET;

// ✅ GOOD - Clear error if required variable missing
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required. Add to .env file.');
}

// ✅ GOOD - Safe default for optional variable
const port = process.env.PORT || 3000;
```

### Before Claiming "COMPLETE"

**3. Verify .env.example is up-to-date:**

```bash
# All variables your feature uses must be in .env.example
grep "JWT_SECRET" .env.example  # Should exist if you use it
grep "DATABASE_URL" .env.example  # Should exist if you use it
```

**4. Alert engineer about configuration:**

```markdown
## Session Log: Environment Variables

**New variables introduced:**
- JWT_SECRET (required) - Added to .env.example
- TOKEN_EXPIRY (optional, defaults to '24h') - Added to .env.example

**Engineer action required:**
1. Run: cp .env.example .env (if .env doesn't exist)
2. Update .env with actual JWT_SECRET value (generate random string)
3. Optionally create .env.local for machine-specific overrides
```

**IF YOU INTRODUCE NEW VARIABLES WITHOUT UPDATING .env.example:**

- ❌ Feature is INCOMPLETE
- ❌ Other engineers will get "undefined environment variable" errors
- ❌ Update .env.example first, then re-validate

```

---

## Pre-Execution Environment Validation (Orchestration Partner)

### Before Creating Prompts, Orchestration Partner Should:

**1. Scan codebase for current environment variables:**

```bash
# Find all variables currently used
grep -r "process\.env\.[A-Z_]" src/ -oh | sort -u > current-env-vars.txt

# Example output:
# process.env.DATABASE_URL
# process.env.JWT_SECRET
# process.env.PORT
```

**2. Read .env.example (safe - no secrets):**

```bash
cat .env.example
# Extract variable names
grep -E "^[A-Z_]+=" .env.example | cut -d'=' -f1 > documented-vars.txt
```

**3. Compare and identify gaps:**

```bash
# Variables in code but not in .env.example
comm -23 current-env-vars.txt documented-vars.txt
```

**4. Alert engineer BEFORE creating prompts:**

```markdown
**ENVIRONMENT VALIDATION BEFORE STARTING:**

I scanned the codebase and found these environment variables:

**Currently documented in .env.example:**
- DATABASE_URL ✅
- JWT_SECRET ✅
- PORT ✅

**Used in code but MISSING from .env.example:**
- REDIS_URL ❌ (used in src/cache/redis.service.ts)

**Recommended action:**
Before I create agent prompts, should I:
1. Add REDIS_URL to .env.example? (I can do this now)
2. Is this variable intentional or leftover from old code?

This ensures agents have complete environment schema when they start.
```

---

## Environment Variable Schema (Not Secret Values)

### What Orchestration Partner CAN Document

**Variable schema (SAFE):**

```markdown
## Required Environment Variables

**Database:**
- DATABASE_URL: PostgreSQL connection string
  - Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  - Docker default: postgresql://postgres:password@localhost:5433/new_crm
  - Local PostgreSQL: postgresql://postgres:password@localhost:5432/new_crm

**Authentication:**
- JWT_SECRET: Secret key for JWT token signing
  - Format: Random string (min 32 characters)
  - Generate: openssl rand -base64 32

**Server:**
- PORT: Backend server port (optional, defaults to 3000)
- NODE_ENV: Environment (development/production/test)
```

### What Orchestration Partner CANNOT Document

**Actual secret values (UNSAFE):**

```markdown
❌ DON'T: JWT_SECRET=abc123supersecret (actual value)
✅ DO: JWT_SECRET=<generate-with-openssl-rand-base64-32> (template)

❌ DON'T: DATABASE_URL=postgresql://user:MyP@ssw0rd@... (actual password)
✅ DO: DATABASE_URL=postgresql://postgres:password@localhost:5433/new_crm (placeholder)
```

---

## Developer .env.local Override Pattern

### Orchestration Partner Should Document

**In every prompt that involves environment variables:**

```markdown
## Environment Configuration

**Default configuration (.env.example):**
- DATABASE_URL: Points to Docker PostgreSQL on port 5433

**Developer override pattern (.env.local):**

If you need custom configuration (different port, local PostgreSQL, etc.):

1. Create .env.local (gitignored, never committed)
2. Override specific variables:
   ```

DATABASE_URL=postgresql://localhost:CUSTOM_PORT/new_crm

   ```

**Precedence:** .env.local > .env.development > .env

**Why .env.local:**
- Gitignored (your machine-specific config never committed)
- Overrides defaults without modifying .env.example
- Team shares .env.example, you keep .env.local private
```

---

## Automatic .env.example Updates

### When Agent Introduces New Environment Variable

**Agent MUST automatically:**

1. **Add to .env.example:**

```bash
# Agent adds new variable with descriptive comment
echo "\n# Redis Cache Configuration (added by <feature-name>)" >> .env.example
echo "REDIS_URL=redis://localhost:6379" >> .env.example
```

2. **Alert in session log:**

```markdown
## Session Log: Environment Variables

**NEW VARIABLE INTRODUCED:**
- REDIS_URL
  - Purpose: Redis cache connection
  - Default: redis://localhost:6379
  - Added to .env.example: ✅

**Engineer action required:**
1. If using Docker: Update docker-compose.yml to include Redis service
2. Copy REDIS_URL to your .env.local if you need custom Redis configuration
3. Default value works for Docker setup (no action needed for standard setup)
```

3. **Update README (if new service):**

```markdown
# Agent updates README.md

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection (required)
- `JWT_SECRET`: JWT signing key (required)
- `REDIS_URL`: Redis cache connection (required) ← NEW
```

4. **Include validation in agent prompt:**

```markdown
## Agent Prompt Instruction

**If you introduce NEW environment variables:**

1. Add to .env.example with comment and safe default
2. Alert engineer in session log
3. Update README environment variable documentation
4. Include clear error message if variable missing at runtime
5. Mark as INCOMPLETE if .env.example not updated
```

---

## Environment Validation Checklist (Orchestration Partner)

**Before creating prompts:**

- [ ] Scan code for all process.env usage
- [ ] Read .env.example to see documented variables
- [ ] Identify missing variables (code uses but not documented)
- [ ] Alert engineer about missing variables
- [ ] Offer to add missing variables to .env.example

**Include in every prompt:**

- [ ] Environment variable validation section
- [ ] Instruction to update .env.example if introducing new variables
- [ ] Alert requirement if new variables added
- [ ] .env.local override pattern documentation

**After agent completes:**

- [ ] Verify .env.example updated (if new variables introduced)
- [ ] Verify README updated (if new service dependencies)
- [ ] Verify clear error messages for missing required variables

---

## Example: Orchestration Partner Pre-Execution Validation

```
Engineer: "I need to add Redis caching"

Orchestration Partner:

**ENVIRONMENT VALIDATION:**

I scanned the codebase for environment variables:

Current variables in .env.example:
- DATABASE_URL ✅
- JWT_SECRET ✅
- PORT ✅

Your feature will likely need:
- REDIS_URL (for cache connection)

**Before creating prompts, I will:**
1. Include instruction for agent to add REDIS_URL to .env.example
2. Ensure agent alerts you when variable added
3. Document .env.local override pattern for custom Redis setup

**Agent prompt will include:**
"If you introduce REDIS_URL, add to .env.example with default redis://localhost:6379
and alert engineer to update their .env.local if they use custom Redis configuration"

Ready to create prompt with environment validation included.
```

---

## Port Conflict Resolution Pattern

**Document in prompts (don't read .env.local):**

```markdown
## Port Conflict Resolution

**If docker-compose up fails with "port already allocated":**

1. Check what's using the port:
   ```bash
   lsof -i :5433
   ```

2. Option A: Stop conflicting service
   ```bash
   # Stop local PostgreSQL if you don't need it
   brew services stop postgresql
   ```

3. Option B: Use different port for Docker
   ```bash
   # Create .env.local with custom port
   echo "DATABASE_URL=postgresql://postgres:password@localhost:5434/new_crm" > .env.local

   # Update docker-compose.yml port mapping to 5434:5432
   ```

**Engineer chooses resolution - agent documents both options**

```

---

## Success Criteria for Environment Configuration

**Infrastructure agent is complete when:**

- [ ] .env.example contains ALL variables used in code
- [ ] Each variable has descriptive comment
- [ ] Each variable has safe placeholder value (not actual secret)
- [ ] README documents all environment variables
- [ ] Code has clear error messages for missing required variables
- [ ] .env.local override pattern documented
- [ ] No secrets committed to git (.env files in .gitignore)

**Specific verification:**

```bash
# 1. All code variables documented
grep -r "process\.env\.[A-Z_]" src/ -oh | sort -u > code-vars.txt
grep -E "^[A-Z_]+=" .env.example | cut -d'=' -f1 > example-vars.txt
comm -23 code-vars.txt example-vars.txt  # Should be empty (no missing vars)

# 2. .env.example has no actual secrets
cat .env.example | grep -i "production\|actual\|real"  # Should be empty

# 3. Required variables have validation
grep -r "process.env.DATABASE_URL" src/ -A2 | grep "throw"  # Should show validation

# 4. .gitignore prevents .env commits
grep ".env" .gitignore  # Should show .env files ignored
```

---

**Status:** Canonical guide for environment validation without reading secrets
