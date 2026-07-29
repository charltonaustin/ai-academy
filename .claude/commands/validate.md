---
description: Comprehensive validation of completed agent work - verify functionality, find bugs, create fix prompts, and document learnings.
argument-hint: '[feature-id (e.g., dashboard-widgets)]'
---

# /validate - Systematic Agent Work Validation

## Command Expansion

When executed, this slash command expands to:

````text
You are the Orchestration Partner performing systematic validation of completed agent work. Tactical agents have reported their work complete. Your job is to verify everything works, identify bugs, create fix prompts if needed, and document findings for the retrospective.

REQUIRED ARGUMENT:
- Feature ID (e.g., "dashboard-widgets", "user-auth") - identifies which feature to validate

VALIDATION MISSION:
Do NOT trust tactical agent claims of completion. Verify everything systematically. Agents can be overconfident and miss critical bugs, especially integration issues hidden by mocking strategies.

YOUR ROLE:
- Strategic validator (orchestration partner reviewing tactical work)
- Quality assurance (systematic bug finding)
- Fix prompt creator (actionable bug fix instructions)
- Retrospective contributor (findings feed into feature retrospective)

---

## PHASE 1: SYSTEMATIC VALIDATION (MANDATORY)

### Step 1: Identify What Was Built

**Locate Feature Documentation:**
```bash
# Find all relevant files
ls .claude/workspace/{feature-id}/
ls .claude/workspace/{feature-id}/agent-logs/
````

**Read to understand scope:**

1. `.claude/workspace/{feature-id}/FEATURE-OVERVIEW.md` - What should have been built
2. `.claude/workspace/{feature-id}/TECH-PLAN.md` - Technical approach
3. `.claude/workspace/{feature-id}/EXECUTION-GUIDE.md` - Task breakdown
4. All agent session logs in `agent-logs/` directory

**Document:**

```markdown
## Feature: {Name}

**Tasks Completed:**

- Task 0: {what was built}
- Task A: {what was built}
- Task B: {what was built}
- Task C: {what was built}
```

---

### Step 2: Check Basic Compilation & Linting

**Run in parallel:**

```bash
npm run type-check 2>&1
npm run lint 2>&1
git status --short
```

**Verify:**

- [ ] TypeScript: 0 errors (MANDATORY)
- [ ] ESLint: 0 warnings (MANDATORY)
- [ ] Modified files list matches expectations

**If failures found:**

- Document each error with file:line
- Create fix section in validation report

---

### Step 3: Run Full Test Suite

**Execute tests:**

```bash
npm test 2>&1
```

**Analyze results:**

- [ ] All tests passing? (Check count: X/X)
- [ ] Any stderr output? (warnings, errors logged but not failing tests)
- [ ] Any "MOCK" or "vi.mock" in failing test output? (indicates mock issues)

**Critical Analysis:**
Look for these red flags in test output:

- `[Service] Failed to create...` - Silent failures logged
- `TypeError: Cannot read properties of undefined` - Type mismatches
- `invalid input syntax for type uuid` - Constraint violations
- `error: ...` in stderr while tests pass - Caught errors not failing tests

**If tests pass but stderr has errors:**
🚨 CRITICAL: Tests are hiding bugs! Proceed to deep validation.

---

### Step 4: Code Review (Find What Tests Missed)

**Search for problematic patterns:**

**Pattern 1: Type Assumptions**

```bash
# Find database queries with RETURNING clause
grep -r "RETURNING" lib/ --include="*.ts"

# Check if code assumes Date objects from DB
grep -r "\.toISOString()" lib/ --include="*.ts"

# PostgreSQL returns ISO strings, not Date objects!
```

**Pattern 2: Silent Failures**

```bash
# Find try-catch blocks that only log
grep -A 5 "catch" lib/ --include="*.ts" | grep -B 5 "console.error"

# Check if errors are surfaced or just logged
# Silent failures hide bugs in production
```

**Pattern 3: Invalid UUIDs**

```bash
# Find userId assignments
grep -r "userId:" lib/ --include="*.ts"

# Check for string literals that aren't valid UUIDs
# Example: userId: 'system' or userId: 'admin'
```

**Pattern 4: Mock-Heavy Tests**

```bash
# Count mocks in test files
grep -r "vi.mock" tests/ --include="*.ts" | wc -l

# Count integration tests (should NOT have mocks)
find tests/integration -name "*.test.ts" 2>/dev/null | wc -l

# If mocks > integration tests * 10, RED FLAG
```

**Document findings:**

```markdown
## Code Review Findings

### Potential Bug #1: {Description}

- **File:** `path/to/file.ts:line`
- **Pattern:** {Which pattern matched}
- **Issue:** {What's wrong}
- **Evidence:** {Code snippet or grep output}
- **Impact:** {How it affects functionality}

### Potential Bug #2: ...
```

---

### Step 5: Integration Testing (Real Validation)

**Test real flows (NO MOCKS):**

**For database-dependent features:**

```bash
# Start servers
npm run dev &
DEVPID=$!
sleep 10

# Check both servers running
lsof -i :3000 -i :3001 2>/dev/null

# Kill after verification
kill $DEVPID 2>/dev/null
```

**Verify:**

- [ ] Servers start without errors
- [ ] No error logs during startup
- [ ] All expected ports listening

**For features with database writes:**

```bash
# Check if records actually created
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM {new_table};"

# Check constraint names match code expectations
psql "$DATABASE_URL" -c "\d {table_name}"
```

**Document:**

```markdown
## Integration Testing Results

**Server Startup:** {Pass/Fail with details}
**Database Validation:** {Pass/Fail with evidence}
**Error Logs:** {Any errors found in server output}
```

---

### Step 6: Verify Agent Session Logs

**Check log quality:**

```bash
# Count lines per log
wc -l .claude/workspace/{feature-id}/agent-logs/*.md

# Check for required sections
grep -r "## Coordination" .claude/workspace/{feature-id}/agent-logs/
grep -r "## Testing" .claude/workspace/{feature-id}/agent-logs/
grep -r "## Decisions" .claude/workspace/{feature-id}/agent-logs/
```

**Quality checklist:**

- [ ] Each agent has session log
- [ ] Logs document design decisions
- [ ] Logs include testing approach
- [ ] Logs mention coordination assumptions
- [ ] Logs are >300 lines (comprehensive)

---

## PHASE 2: BUG ANALYSIS (IF BUGS FOUND)

### For Each Bug Discovered:

**1. Root Cause Analysis**

```markdown
### Bug #{number}: {Short Description}

**Symptom:** {How bug manifests}
**Root Cause:** {Why it happened}
**Why Tests Passed:** {Why testing didn't catch it}
**Production Impact:** {What breaks in real usage}
**Agent Assumption:** {What agent incorrectly assumed}
**Reality:** {What actually happens}
```

**2. Evidence Collection**

- Error logs (exact messages)
- Code snippets showing bug
- Test output showing hidden errors
- Database constraint violations

**3. Fix Strategy**

- Exact file:line to fix
- Code to add/change
- New tests to prevent regression

---

## PHASE 3: CREATE BUG FIX PROMPT (IF NEEDED)

**If bugs found, create:**
`.claude/workspace/{feature-id}/BUG-FIX-PROMPT.md`

**Template:**

```markdown
# {Feature ID} Bug Fix: {Brief Description}

**Context:** Post-validation review found {number} critical bugs

---

## Bug #1: {Description}

**File:** `path/to/file.ts`
**Line:** {line number}

**Current Code:**
\`\`\`typescript
{current broken code}
\`\`\`

**Problem:**
{Explain what's wrong and why}

**Fix Required:**
\`\`\`typescript
{exact code to replace with}
\`\`\`

**Validation:**

1. Run tests: `npm test path/to/test.ts`
2. Verify: {specific check}

---

## Bug #2: ...

---

## New Integration Test Required

**File:** `tests/integration/{feature}-integration.test.ts` (NEW)

\`\`\`typescript
{full test code that would have caught the bug}
\`\`\`

---

## Success Criteria

- [ ] Bug #1 fixed
- [ ] Bug #2 fixed
- [ ] Integration test added
- [ ] All tests passing
- [ ] TypeScript: 0 errors
- [ ] Manual validation: {specific steps}

**Estimated Time:** {realistic estimate}
```

---

## PHASE 4: DOCUMENT FINDINGS FOR RETROSPECTIVE

**Update feature retrospective with validation findings:**
`.claude/workspace/{feature-id}/retrospective.md`

**If retrospective doesn't exist yet, create it using template:**
`.claude/orchestration/templates/retrospective-template.md`

**Add validation findings to retrospective sections:**

### What Went Well ✅ (Validation Confirmed)

- {Patterns that worked effectively}
- {Quality code delivered}
- {Coordination that prevented issues}

### What Didn't Go Well ❌ (Bugs Found)

- Bug #{number}: {Description with file:line}
- Testing gap: {What mocks hid}
- Integration issue: {What manual testing revealed}

### Key Learnings 💡 (Prevention)

```markdown
**Why Bug #{number} Happened:**

- Agent assumed: {assumption}
- Reality: {what actually happens}
- Why tests passed: {mocking hid it}
- Prevention: {pattern for future}
```

### Action Items 🎯 (Immediate Fixes)

- [ ] Fix Bug #1: {specific fix needed}
- [ ] Fix Bug #2: {specific fix needed}
- [ ] Add integration test: {to prevent regression}
- [ ] Update agent prompts: {prevent similar bugs}

---

## PHASE 5: CREATE VALIDATION REPORT

**Create:**
`.claude/workspace/{feature-id}/{FEATURE-ID}-VALIDATION-REPORT.md`

**Structure:**

```markdown
# {Feature ID}: Comprehensive Validation Report

**Date:** {date}
**Validator:** Orchestration Partner
**Status:** {PRODUCTION READY / BUGS FOUND / BLOCKED}

---

## Executive Summary

{2-3 paragraph summary of findings}

---

## Validation Results

### TypeScript Compilation: {✅/❌}

{Details}

### ESLint: {✅/❌}

{Details}

### Test Suite: {✅/❌}

- Tests passing: {X/X}
- Coverage: {percentage}
- Hidden errors: {list if any}

### Code Review: {✅/⚠️/❌}

{Findings from pattern search}

### Integration Testing: {✅/❌}

{Server startup, database validation results}

---

## Bugs Found: {count}

{Detailed bug descriptions with evidence}

---

## Agent Performance Assessment

**Task 0:** {Grade with justification}
**Task A:** {Grade with justification}
**Task B:** {Grade with justification}
**Task C:** {Grade with justification}

**Overall:** {Grade with reasoning}

---

## Methodology Learnings

{Key insights for future features}

---

## Recommendations

**Immediate Actions:**

1. {Highest priority}
2. {Second priority}

**For Future Features:**

1. {Pattern to apply}
2. {Requirement to add}

---

## Time to Fix: {estimate}

**Status:** {Ready for fixes / Needs design review / etc}
```

---

## REPORTING VALIDATION RESULTS

**After validation complete, provide summary:**

```markdown
## {Feature ID} Validation Complete

**Overall Status:** {PRODUCTION READY / BUGS FOUND / ISSUES}

### Summary

{Brief 2-3 sentence summary}

### What Works ✅

- {Major functionality 1}
- {Major functionality 2}
- {Major functionality 3}

### Bugs Found 🚨

{If any:}

- **Bug #1:** {One-line description} - {file:line}
- **Bug #2:** {One-line description} - {file:line}

### Time to Fix: {estimate}

### Key Learnings

- {Most important insight 1}
- {Most important insight 2}

### Documentation Created

- ✅ Validation Report: `.claude/workspace/{feature-id}/validation-report.md`
- ✅ Bug Fix Prompt: `.claude/workspace/{feature-id}/bugfix-prompt.md` (if bugs found)
- ✅ Retrospective Updated: `.claude/workspace/{feature-id}/retrospective.md` (with validation findings)

### Next Steps

1. {Immediate action}
2. {Second priority}
3. {Third priority}
```

---

## QUALITY CHECKLIST

Before completing validation:

**Validation Completeness:**

- [ ] All 6 validation phases completed
- [ ] Every agent's work reviewed
- [ ] All modified files examined
- [ ] Test output fully analyzed
- [ ] Integration testing performed

**Bug Analysis:**

- [ ] Root cause identified for each bug
- [ ] "Why tests passed" explained for each bug
- [ ] Fix strategy documented with exact code
- [ ] Integration test to prevent regression included

**Documentation:**

- [ ] Validation report comprehensive (>100 lines)
- [ ] Bug fix prompt actionable (if needed)
- [ ] Retrospective updated with findings

**Retrospective Update:**

- [ ] What worked documented (validation confirmed successes)
- [ ] What failed analyzed (bugs found with root causes)
- [ ] Prevention strategies defined (avoid in next feature)
- [ ] Action items created (fix bugs, improve prompts)

---

## CRITICAL VALIDATION PRINCIPLES

### 1. Don't Trust Agent Claims

- Agents say "tests pass" but tests may hide bugs
- Agents say "works correctly" but may not have tested integration
- Agents say "complete" but may have deferred critical work

### 2. Look for Integration Gaps

- Mock-heavy tests hide type mismatches
- Try-catch blocks hide constraint violations
- Silent failures look like success

### 3. Validate Against Reality

- Run real database queries
- Start real servers
- Check real constraints
- Test real error paths

### 4. Document Everything

- Evidence for every bug
- Reasoning for every grade
- Prevention for every pattern
- Metrics for every learning

---

## SUCCESS METRICS

**Validation Quality Indicators:**

- Bugs found: {count} (good to find them now!)
- Time to fix: {estimate} (shows validation effectiveness)
- Learnings captured: {count} (builds methodology)
- Documentation complete: {5/5 files} (enables future work)

**Ideal Outcome:**

- Feature functional (possibly with known fixes needed)
- All bugs documented with fix prompts
- Clear time estimate for any fixes
- Retrospective updated with validation findings
- Engineer can fix bugs and proceed to next feature

---

**This validation process should take 2-4 hours for comprehensive review.**
**The time investment prevents production bugs and builds systematic knowledge.**

````

## Arguments

**Required:**
- `feature-id` - The feature to validate (e.g., "f04", "f05-auth")
  - Locates agent logs and documentation
  - Determines where to save validation reports

**Optional:**
None - command is comprehensive by default

## Expected Output

**Documentation Created:**
1. `validation-report.md` - Comprehensive findings with bug analysis
2. `bugfix-prompt.md` - Step-by-step fix instructions (if bugs found)
3. `retrospective.md` - Updated with validation findings and learnings

**Summary Report:**
Status, bugs found, time to fix, key learnings, next steps

---

## Why This Command Exists

**Problem:** Agents claim completion but tests hide integration bugs
**Solution:** Systematic validation with real testing, not just mocks
**Benefit:** Find bugs before production deployment

**Strategic Value:**
- Captures what worked/failed for retrospective
- Finds bugs tests missed (integration validation)
- Creates actionable fix prompts
- Validates coordination protocols
- Enables compound learning (retrospectives improve over time)

---

## Example Usage

```bash
# After tactical agents report feature complete
/validate dashboard-widgets

# Result:
# - Found 2 critical bugs (type mismatch, invalid UUID)
# - Created bugfix-prompt.md (~30 min to fix)
# - Updated retrospective.md with validation findings
# - Documented prevention strategies for next feature
# - Engineer can fix bugs and proceed
````

---

**Status:** Ready for use
**Purpose:** Systematic validation by orchestration partner (strategic review of tactical work)
**Outcome:** Production-ready features + bug-free delivery + retrospective insights
