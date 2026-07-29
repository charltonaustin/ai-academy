# Bug Fix Prompt Template

**Purpose:** Standard template for all bug fix agent prompts to ensure bugs are fixed WITHOUT introducing new bugs.

**Usage:** Copy this template when creating bug fix prompts. All sections marked MANDATORY must be included.

**Evidence Base:** Created after authentication bugfix agent introduced new bugs while fixing old ones (lacked
validation requirements).

---

## Template Structure

```markdown
# {Feature ID} Bug Fix: {Brief Description}

**Context:** {Why this bug fix is needed - what broke, when discovered}

**Estimated Time:** {realistic estimate}

**CRITICAL:** This is a bug fix. You MUST NOT introduce new bugs while fixing existing ones.

---

## Current State (BEFORE FIX)

**TypeScript:** {✅/❌} {X errors}
**ESLint:** {✅/❌} {X warnings}
**Tests:** {✅/❌} {X failing / Y passing}
**Resource Cleanup:** {✅/❌} {status}

**Your job:** Fix {specific bugs} AND maintain or improve all validation metrics.

---

## Bug #1: {Description}

**File:** \`path/to/file.ts\`
**Line:** {line number if applicable}

**Symptom:**
\`\`\`
{Exact error message or behavior}
\`\`\`

**Root Cause:**
{Why this bug exists - what assumption was wrong, what was missed}

**Current Code:**
\`\`\`typescript
{Show problematic code}
\`\`\`

**Fix Required:**
\`\`\`typescript
{Show corrected code or approach}
\`\`\`

**Validation:**
\`\`\`bash
{How to verify this specific bug is fixed}
\`\`\`

---

## Bug #2: {Description}

{Same structure as Bug #1}

---

## PRE-TESTING SETUP (MANDATORY)

**CRITICAL:** Before you can test your fix in browser, you MUST ensure development environment is ready.

### 1. Verify Development Database Schema

**If your fix involves database operations or user-facing features:**

**Check if schema applied to development database:**
\`\`\`bash

# Try starting dev server:

npm run dev

# Check for database connection errors

\`\`\`

**If database errors or features don't work in browser:**
\`\`\`bash

# Apply migrations to development database:

npm run db:migrate

# Seed with test data:

npm run db:seed
\`\`\`

**Why:** Integration tests use separate test database (\`new_crm_test\`). Your browser testing uses development database (\`new_crm\`). They can be out of sync.

**Example:** Tests passed with test database, but registration failed in browser because development database had no schema.

**Verify schema applied:**

- Development database should have all required tables
- Browser testing should work without database errors
- Don't skip this step - it catches issues tests miss

### 2. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

**Verify:**

- Server starts without errors
- Database connection successful
- No schema/migration errors

**Wait for "Ready" message** before browser testing.

---

## PRE-COMPLETION VALIDATION (MANDATORY)

**CRITICAL:** Bug fixes must NOT introduce new bugs.

Before claiming "COMPLETE", run ALL validation steps:

### 1. TypeScript Compilation (BLOCKING)

\`\`\`bash
npm run type-check
\`\`\`
**REQUIRED:** \`✔ No TypeScript errors\` (0 errors)
**BEFORE FIX:** {X errors}
**AFTER FIX:** Must be ≤ BEFORE (ideally 0)

**IF ERRORS INCREASED:** Your fix introduced new type issues. Revert and try different approach.

---

### 2. ESLint (BLOCKING)

\`\`\`bash
npm run lint
\`\`\`
**REQUIRED:** \`✔ No ESLint warnings or errors\` (0 warnings)
**BEFORE FIX:** {X warnings}
**AFTER FIX:** Must be ≤ BEFORE (ideally 0)

**IF WARNINGS INCREASED:** Your fix introduced code quality issues. Revert and try different approach.

---

### 3. Full Test Suite (BLOCKING)

\`\`\`bash
npm test
\`\`\`
**REQUIRED:** All tests passing
**BEFORE FIX:** {X failing / Y passing}
**AFTER FIX:** Must be ≤ BEFORE failing (ideally 0 failing)

**CRITICAL:** Run FULL test suite, not just affected tests.

**IF MORE FAILURES:** Your fix broke other tests. Revert and try different approach.

**IF SAME FAILURES:** Your fix didn't work. Try different approach.

**ONLY if all passing:** Fix successful.

---

### 4. Resource Cleanup Check

\`\`\`bash
# Check for any lingering node processes if dev server was killed improperly
lsof -i :3000 | grep LISTEN || echo "Port 3000 available ✅"
\`\`\`
**REQUIRED:** "Port 3000 available ✅"

**If port is still in use:**
\`\`\`bash
# Find and kill the process using the port
lsof -t -i:3000 | xargs kill -9
echo "Cleaned up lingering dev server process"

# Re-run check to verify cleanup
lsof -i :3000 | grep LISTEN || echo "Cleanup successful ✅"
\`\`\`

---

### 5. Session Log Documentation (BLOCKING)

**In your session log, create section:**
\`\`\`markdown

## Pre-Completion Validation Results

### Baseline (Before Fix)

- TypeScript: {X errors}
- ESLint: {X warnings}
- Tests: {X failing / Y passing}
- Resources: {status}

### After Fix

[Paste npm run type-check output]
✔ No TypeScript errors (0 errors) ← MUST show this

[Paste npm run lint output]
✔ No ESLint warnings or errors

[Paste npm test summary]
✔ Tests: {Y+X}/{Y+X} passing ← ALL must pass

[Paste lsof -i :3000 output]
Port 3000 available ✅

### Comparison

- TypeScript: {X} → 0 ✅
- ESLint: {X} → 0 ✅
- Tests: {X failing} → 0 failing ✅
- Resources: Clean ✅

**ALL VALIDATIONS PASSED**
\`\`\`

---

## IF ANY VALIDATION FAILS

**DO NOT claim "COMPLETE"**

### If TypeScript Errors Remain or Increase:

- ❌ Your fix introduced new type issues
- ❌ REVERT your changes
- ✅ Try different approach (e.g., type guards vs type assertions)
- ✅ Re-validate until 0 errors

### If ESLint Warnings Appear:

- ❌ Your fix violated code quality standards
- ❌ REVERT or fix ESLint issues
- ✅ Re-validate until 0 warnings

### If Tests Still Fail or New Failures:

- ❌ Your fix didn't work OR broke other code
- ❌ REVERT if more failures than before
- ✅ Investigate root cause more deeply
- ✅ Try different fix approach
- ✅ Re-validate until all passing

### If You Introduce New Bugs:

- ❌ STOP and REVERT changes immediately
- ❌ Analyze what went wrong
- ✅ Document issue in session log
- ✅ Try different approach
- ✅ Validate again from clean state

**You are NOT COMPLETE until:**

- TypeScript: 0 errors (or ≤ BEFORE)
- ESLint: 0 warnings (or ≤ BEFORE)
- Tests: All passing (or ≤ BEFORE failing)
- Resources: All ports available
- Validation output pasted in session log

---

## Success Criteria

### Fix is Complete When ALL Pass:

**TypeScript:**
\`\`\`bash
$ npm run type-check
✔ No TypeScript errors
\`\`\`

**ESLint:**
\`\`\`bash
$ npm run lint
✔ No ESLint warnings or errors
\`\`\`

**Tests:**
\`\`\`bash
$ npm test
Test Files {N} passed ({N})
Tests {M} passed ({M})
\`\`\`

**Resources:**
\`\`\`bash
$ lsof -i :3000 | grep LISTEN
Port 3000 available ✅
\`\`\`

**Session Log:**

- All validation output pasted
- Before/after comparison shown
- Confirmation all validations passed

---

## Time Breakdown Example

- Fix Bug #1: {X minutes}
- Fix Bug #2: {X minutes}
- Fix Bug #3: {X minutes}
- Run validation (all steps): 10 minutes
- **Total: {X} minutes**

**Important:** If you introduce new bugs, add 30+ minutes for rework.

**AVOID REWORK:** Validate thoroughly before claiming complete.

---

## Warning Signs Your Fix Has Issues

### Red Flags (STOP and Reconsider):

**During Implementation:**

- [ ] TypeScript errors increase instead of decrease
- [ ] Need to modify many unrelated files
- [ ] Multiple approaches tried without success
- [ ] Tempted to skip validation steps
- [ ] Scope expanding beyond original bug

**During Validation:**

- [ ] \`npm run type-check\` shows MORE errors than before
- [ ] \`npm test\` shows MORE failures than before
- [ ] Different tests now failing (broke something else)
- [ ] Need to modify production code extensively for a "bug fix"

**If ANY red flag:** Your approach may be wrong. Document issue and ask for guidance.

---

## Notes for Bug Fix Agent

**What Bug Fixes Are:**

- Targeted corrections to specific identified issues
- Minimal changes to achieve fix
- Preserve all existing functionality
- Maintain or improve code quality

**What Bug Fixes Are NOT:**

- Refactoring entire modules
- Adding new features
- Rewriting working code
- Changing architecture

**Stay focused on:** Fixing the specific bugs listed. Nothing more.

**Validate completely:** All 4 validation steps MUST pass before claiming complete.

---

**Status:** Standard template ready for use
**Applies to:** ALL bug fix prompts
**Mandatory Sections:** Pre-completion validation, session log documentation
**Purpose:** Prevent bug fixes from introducing new bugs
```

---

## How to Use This Template

### When Creating Bug Fix Prompts:

1. **Copy template structure** above
2. **Fill in all {placeholders}** with specific bug details
3. **Ensure validation section included** (copy verbatim, adjust metrics)
4. **Add "CRITICAL: Do not introduce new bugs" warning** at top
5. **Document baseline state** (TypeScript/ESLint/Tests before fix)
6. **Require before/after comparison** in session log

### What Makes a Good Bug Fix Prompt:

**✅ Clear bug descriptions** with file/line references
**✅ Root cause analysis** (why bug exists)
**✅ Specific fix instructions** (what code to change)
**✅ Complete validation requirements** (TypeScript, ESLint, tests, processes)
**✅ Before/after metrics** (so agent knows success criteria)
**✅ "Do not introduce new bugs" warning** (explicit constraint)

### What Makes a Bad Bug Fix Prompt:

**❌ Vague instructions** ("fix the auth tests")
**❌ No validation requirements** (agent decides when "done")
**❌ No baseline metrics** (agent doesn't know if they made things worse)
**❌ Only validates specific bug** (doesn't check for new bugs introduced)
**❌ No session log requirements** (no audit trail)

---

## Integration with Methodology

### This Template Enforces:

- **TypeScript Pre-Completion Validation Gate** (proven pattern)
- **Process Cleanup Requirements** (proven pattern)
- **Session Logging Standards** (all features)
- **Quality Standards Maintenance** (all features)

### When to Use:

- ANY bug discovered during validation
- ANY regression found after feature completion
- ANY technical debt fix
- ANY refactoring prompted by code review

### Where to Save Bug Fix Prompts:

**Always in feature's agent-prompts directory:**

```
.claude/workspace/{feature-id}/agent-prompts/
  ├── task-0-{name}.md
  ├── task-a-{name}.md
  ├── bugfix-1-{description}.md  ← Bug fixes here
  ├── bugfix-2-{description}.md
  └── bugfix-3-{description}.md
```

**NOT in feature root directory.**

---

**Status:** Template created and ready for use
**Mandatory:** Use for ALL bug fix prompts
**Purpose:** Prevent bug fixes from introducing new bugs
**Evidence:** Created after bugfix agent introduced new bugs due to missing validation
