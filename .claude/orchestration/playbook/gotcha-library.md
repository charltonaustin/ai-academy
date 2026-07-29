# Gotcha Library: Known Issues & Solutions

**Purpose:** Complete catalog of documented issues with proven solutions

---

## Frontend Gotchas

### Field Naming Mismatches

**Problem:** Backend uses lead_id, frontend expects leadId
**Symptoms:** the API returns null/undefined for fields
**Solution:** Use camelCase throughout, import schema types
**Evidence:** High-coordination challenge
**See:** Chapter 6: Field Naming Locks

---

## Backend Gotchas

### Database Type Mismatches

**Problem:** PostgreSQL returns strings, code expects Date objects
**Symptoms:** Tests pass (mocked), production crashes (real DB)
**Solution:** Integration tests WITHOUT mocks catch this
**Evidence:** Integration testing discovery
**See:** Chapter 3: Two-Tier Testing Strategy

### External Dependency Validation

**Problem:** Tests pass (mocked API), feature broken (real API)
**Symptoms:** Missing environment variables, API calls fail
**Solution:** Mandatory external dependency disclosure
**Evidence:** External dependency issue
**See:** Pattern Library external dependency validation

---

## Testing Gotchas

### Long-Running Test Processes

**Problem:** Test workers accumulate after timeout (2+ min tests)
**Symptoms:** RAM exhaustion (10GB+), development machine unusable
**Solution:** Configure proper test timeouts and use --runInBand for resource-intensive tests
**Evidence:** Validation gate discovery
**See:** Chapter 4: Validation Gate 4

### TypeScript Errors While Tests Pass

**Problem:** Runtime test success ≠ compilation success
**Symptoms:** Tests pass, TypeScript fails, deployment blocked
**Solution:** Run npm run type-check before claiming complete
**Evidence:** 221 errors undetected by tests alone
**See:** Chapter 4: Validation Gate 1

---

## Coordination Gotchas

### Import Chain Parallelization

**Problem:** Claiming parallel execution when import dependencies exist
**Symptoms:** Agents refuse to proceed (correctly!)
**Solution:** Map imports before claiming parallel possible
**Evidence:** Authentication import dependency
**See:** Chapter 8: Import Dependency Analysis

### Integration Without Validation

**Problem:** Individual agents complete, system integration fails
**Symptoms:** TypeScript errors, field mismatches after parallel work
**Solution:** Integration validation layer (5 gates mandatory)
**Evidence:** ~60 coordination errors after parallel completion
**See:** Chapter 4: The 5 Validation Gates

---

## PWA Gotchas

### Service Worker Doesn't Register in Dev

**Problem:** `ng serve` never registers the Angular service worker
**Symptoms:** Offline/install features "don't work" during development
**Solution:** Test against a production build (`ng build`) served by a static server
**Evidence:** PWA development discovery
**See:** Chapter 12: Progressive Web App Patterns

### HTTPS Required on Real Devices

**Problem:** Service workers only register over HTTPS (localhost is exempt)
**Symptoms:** Install/offline works on desktop localhost but not on a phone via `http://192.168.X.X`
**Solution:** Serve over HTTPS (deployed host or an `ngrok`/`cloudflared` tunnel) to test on device
**Evidence:** PWA setup issue
**See:** Chapter 12: Progressive Web App Patterns

---

**Status:** Growing library - add new gotchas as discovered
