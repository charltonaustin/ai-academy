# 5 Validation Gates (Mandatory for All Features)

**Purpose:** Define when a feature is truly "complete" vs "compiles but broken"

**Status:** MANDATORY - All 5 gates must pass before claiming "COMPLETE"

---

## Gate 1: TypeScript Compilation

```bash
npm run type-check
```

**Required:** 0 errors

**Why:** Code that doesn't compile definitely doesn't work. But code that compiles might still be broken (that's what
the other gates catch).

**Common issues caught:**

- Type mismatches between layers
- Missing type definitions
- Incorrect import paths
- Schema/code type inconsistencies

---

## Gate 2: ESLint

```bash
npm run lint
```

**Required:** 0 warnings, 0 errors

**Why:** Consistent code quality, catches common mistakes, enforces team conventions

**Common issues caught:**

- Unused variables/imports
- Inconsistent formatting
- Code smell patterns
- Best practice violations

---

## Gate 3: Tests Passing

```bash
npm test
```

**Required:** All tests passing

**Two-Tier Testing Strategy (BOTH required):**

**Unit Tests (WITH mocks):**

- Test logic in isolation
- Fast execution (<1s per test)
- Example: "User validation rejects invalid email"

**Integration Tests (WITHOUT mocks):**

- Test cross-layer integration
- Real database operations
- Example: "Create lead → verify in database → retrieve via GET /leads/:id"

**Why both:**

- Unit tests validate logic correctness
- Integration tests catch cross-layer bugs (mocks can hide these)

**Evidence:** Integration tests found critical bugs that mocked tests missed (PostgreSQL returns strings not Dates, UUID
format issues)

---

## Gate 4: Process Cleanup (Resource Check)

```bash
# Check what's running on common dev ports
lsof -i :3000  # Backend server
lsof -i :3001  # Frontend server
```

**Required:** Clean development environment, no hanging processes

**Why:** Multiple Claude sessions may start dev servers that don't shut down cleanly, causing port conflicts and
resource exhaustion

**Common issues caught:**

- Backend server still running from earlier session
- Frontend dev server from previous session
- Multiple servers competing for same port

**Fix if needed:**

```bash
# See what's using a port
lsof -i :3000

# Kill specific process by PID
kill <PID>

# Or kill by process name
pkill -f "nest start"
```

---

## Gate 5: Manual Testing

**CRITICAL:** Automated tests passing ≠ feature actually working

**Two types based on feature:**

### Frontend Manual Testing (use Playwright MCP for browser verification)

```bash
npm run dev
# Open http://localhost:3000
```

**Test in actual browser:**

1. Open browser to {SPECIFIC_URL}
2. Navigate through all UI you created
3. Test all forms (submit, validation, error states)
4. Verify data displays correctly
5. Test all user interactions
6. Check browser console: 0 errors (Cmd+Option+J or F12)

**Playwright systematic testing:**

- Navigate to all pages you created
- Fill and submit all forms
- Verify redirects and navigation work
- Check data displays correctly
- Screenshot key states
- Document any errors found

**Common issues caught:**

- Database schema not applied to development database (tests use test DB, browser uses dev DB)
- Client state management broken
- REST API integration failing
- UI rendering issues

### Backend Manual Testing (use curl/API testing)

**Test with actual API calls:**

```bash
# Example: REST login endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

**Verify:**

1. Response status: {EXPECTED_STATUS} (e.g., 200)
2. Response body contains: {EXPECTED_FIELDS} (e.g., token, user.email)
3. Authentication: login returns valid token/session
4. Authorization: protected endpoints reject unauthorized requests
5. Error handling: invalid requests return proper error responses

**Common issues caught:**

- API returns wrong status codes
- Missing fields in response
- Authentication/authorization not working
- Database queries failing
- Error handling broken

---

## Session Log Documentation (MANDATORY)

**Agent must paste ALL validation output in session log:**

```markdown
## Pre-Completion Validation Results

### Gate 1: TypeScript
[paste npm run type-check output]
✔ No TypeScript errors

### Gate 2: ESLint
[paste npm run lint output]
✔ No ESLint warnings or errors

### Gate 3: Tests
[paste npm test summary]
✔ Tests: X/X passing

### Gate 4: Process Cleanup
[paste lsof output or "no hanging processes"]
✔ Clean development environment

### Gate 5: Manual Testing

FRONTEND (if applicable):
- Browser testing: ✅ All features work
- Console errors: None
- Playwright results: [details]

BACKEND (if applicable):
- curl testing: ✅ API returns expected responses
- Authentication: ✅ Works correctly
- Error handling: ✅ Proper responses

**All 5 gates passed: YES**
```

---

## Failure Handling

**IF ANY GATE FAILS:**

❌ Do NOT claim "COMPLETE"
❌ Fix errors first
❌ Re-run ALL validation steps
✅ Only claim "COMPLETE" after ALL validations pass

**Claiming "COMPLETE" without passing all 5 gates = INCOMPLETE TASK**

---

## Why All 5 Gates Matter

**Evidence from building real features:**

- ✅ TypeScript: 0 errors ≠ tests pass (test-related TypeScript errors exist)
- ✅ Tests: All passing ≠ browser works (database setup issues only caught in browser)
- ✅ Browser: Works ≠ clean environment (resource exhaustion from hanging processes)

**All 5 gates = truly complete**

---

## Quick Reference

**Feature is complete when:**

- [ ] Gate 1: TypeScript - 0 errors
- [ ] Gate 2: ESLint - 0 warnings
- [ ] Gate 3: Tests - All passing (unit + integration)
- [ ] Gate 4: Process cleanup - No hanging servers
- [ ] Gate 5: Manual testing - Feature works in browser (frontend) OR API responds correctly (backend)

**All 5 MANDATORY. No exceptions.**
