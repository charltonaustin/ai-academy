# Chapter 03: The 5 Validation Gates

**Part 1: Strategic Orchestration Foundations**
**When to read:** Day 2 Morning

---

## Overview

How to know when a feature is actually "complete" (not just claimed).

---

## 1. Theory: What "Complete" Means

[Content: Professional definition of done vs premature completion claims]

---

## 2. Evidence: Validation Discovery

### The Problem

- Agents claimed "COMPLETE"
- 221 TypeScript errors existed
- Tests passed but compilation failed
- Production deployment blocked

### Why This Happened

- Runtime test success ≠ compilation success
- Agents saw "tests passing" → concluded "task complete"
- Never ran `npm run type-check`

---

## 3. Protocol: The 5 Mandatory Gates

### Gate 1: TypeScript (0 errors)

```bash
npm run type-check
```

**Required:** "✔ No TypeScript errors"

### Gate 2: ESLint (0 warnings)

```bash
npm run lint
```

**Required:** "✔ No ESLint warnings or errors"

### Gate 3: Tests (all passing)

```bash
npm test
```

**Required:** All tests passing (unit + integration)

### Gate 4: Resource Check (development environment clean)

```bash
# Check for any hanging test processes
pgrep -f jest || echo "No hanging processes ✅"
```

**Required:** Clean development environment, no resource leaks

### Gate 5: Browser/Device Testing (features actually work)

**Web:** Open browser, test features, check console for 0 errors
**Mobile:** Test on device/simulator, check console for 0 errors

---

## 4. Practice: Running All Gates

[Hands-on: Complete validation sequence for a feature]

---

## 5. NestJS Examples

### Pre-Completion Validation Script

```typescript
// Example: Validation sequence automation
```

---

## Key Takeaways

- [ ] ALL 5 gates required before "complete"
- [ ] Tests passing ≠ feature working (Gate 5 critical)
- [ ] TypeScript errors block deployment (Gate 1)
- [ ] Resource check ensures clean environment (Gate 4)
- [ ] Agent responsibility: Run gates, paste output in session log

---

**Next Chapter:** Shared Types as the Coordination Contract
