# Investigation-First Clarification Workflow

**Purpose:** Ensure agent investigates codebase reality before asking engineer questions they can answer themselves

**Pattern:** INVESTIGATE technical facts → ASK business requirements → DETERMINE strategy

---

## Core Principle

**Two-Phase Approach:**

1. **INVESTIGATE** - Search codebase to answer technical questions (what exists, current patterns, infrastructure)
2. **ASK** - Get requirements/preferences from engineer (what they want, where it goes, business priorities)

**Don't ask questions you can answer through codebase investigation.**

**Don't ask questions to hit a quota.**

---

## Phase 1: INVESTIGATE (Search Codebase - Don't Ask)

### Technical Reality to Discover

**Infrastructure:**

- Does infrastructure exist? (pages, components, services, database tables)
- What are current patterns? (how existing features integrate, naming conventions)
- What's the file structure? (where do similar features live)
- What dependencies exist? (imports, APIs, database relationships)
- What's the tech stack? (Angular? Vue? NestJS? REST?)

**Example Investigations:**

```bash
# Find if Dashboard exists
grep -r "Dashboard" src/app/pages/

# Understand Dashboard structure
# Read dashboard.component.ts to see current layout, existing widgets

# Check widget patterns
ls src/components/widgets/
# Read existing widget to understand integration pattern

# Find authentication service
grep -r "auth" src/services/

# Check the shared API types
# Read api-types.ts / the dto/ folders to see existing types

# Find database models
ls src/models/
# Read user.model.ts to see field names

# Check for JWT implementation
grep -r "jwt" src/
```

**What This Tells You:**

- What already exists (don't build duplicates)
- Current integration patterns (follow established conventions)
- Naming conventions (match existing codebase)
- Architecture decisions already made (reuse patterns)

---

## Phase 2: ASK (Requirements/Preferences - Can't Determine)

### Business Requirements

**What's the desired behavior?**

- "What happens when user clicks X?"
- "Should admin override user settings?"
- "What exactly constitutes a 'completed' order?"
- "What if user enters duplicate email?"

### UI/UX Placement & Priorities

**Where should component display?**

- "Top of dashboard? Sidebar? Modal?"
- "3-column grid? List view? Card layout?"
- "Show conversions? Engagement? Revenue?"
- "Which widget is most important?"

**Example questions:**

- "Where on /dashboard should widgets display?" → "Main content area, 3-column grid"
- "What data should each widget show?" → "Conversions, Engagement, Trends"
- "What's the priority/order?" → "Conversions first, then Engagement, then Trends"

### Feature Scope & Completeness

**What's included in MVP?**

- "Just read-only display? Or interactive filters?"
- "Don't worry about export functionality?"
- "User navigates how? What do they see?"

**How do we verify success?**

- Frontend: "What should I see in the browser to confirm it works?"
- Backend: "What API call should I make to verify the endpoint works?"
- Auth: "How should I test login/authentication flow?"

---

## Phase 3: DETERMINE (Implementation Strategy)

After investigating codebase and asking requirements, determine:

**Integration Approach:**

- How will this integrate? (follow existing patterns discovered in investigation)
- Who owns integration? (component agent? separate task?)
- What files need modification? (based on codebase investigation)

**Execution Strategy:**

- Sequential or parallel? (based on import dependencies)
- Coordination level? (low/medium/high based on schema dependencies)
- Timeline estimate? (based on complexity and dependencies)

---

## Complete Example: Dashboard Analytics Widgets

### Engineer Request

"I need analytics widgets"

### Phase 1: INVESTIGATE (You Do This)

```bash
# Check if Dashboard exists
grep -r "dashboard" src/app/pages/ → YES, dashboard.component.ts exists

# Read Dashboard structure
# Read dashboard.component.ts → Grid layout, imports components

# Check existing widget patterns
ls src/components/widgets/ → See 2 existing widgets
# Read existing widget → Each imported directly into Dashboard
```

**What you learned:**

- dashboard.component.ts exists ✅
- Uses grid layout
- Widgets imported individually
- Pattern: Each widget is separate component imported into Dashboard

### Phase 2: ASK (Requirements from Engineer)

**You ask:**

- "Where on /dashboard should widgets display?"
  → Engineer: "In the main content area, 3-column grid"
- "What data should each widget show?"
  → Engineer: "Conversions, Engagement, Trends"
- "What's the priority/order?"
  → Engineer: "Conversions first, then Engagement, then Trends"

### Phase 3: DETERMINE (Your Analysis)

**Integration approach:**

- Each widget agent imports into dashboard.component.ts (matches existing pattern)

**Execution strategy:**

- Parallel (widgets independent of each other)

**Coordination level:**

- Medium (all modify Dashboard imports, but independent widgets)

**Timeline:**

- 2-3 hours (parallel execution)

---

## Complete Example: Backend REST Authentication

### Engineer Request

"I need a REST login endpoint"

### Phase 1: INVESTIGATE (You Do This)

```bash
# Check the shared API types
# Read api-types.ts / the dto/ folders → YES, User type exists

# Check for auth service
ls src/services/ → YES, auth.service.ts exists
# Read auth.service.ts → bcrypt implementation exists

# Check database User model
# Read user.model.ts → email, passwordHash fields exist

# Find JWT implementation
grep -r "jwt" src/ → JWT service already configured
```

**What you learned:**

- User type in the shared API types ✅
- Auth service with bcrypt ✅
- Database model ready ✅
- JWT infrastructure exists ✅

### Phase 2: ASK (Requirements from Engineer)

**You ask:**

- "What should login return?"
  → Engineer: "JWT token + user profile"
- "Token expiration?"
  → Engineer: "24 hours"
- "Failed login handling?"
  → Engineer: "Return error after 3 attempts, log IP"

### Phase 3: DETERMINE (Your Analysis)

**Integration approach:**

- Adds a POST /auth/login route + shared DTO (HIGH coordination with frontend)
- Uses existing auth service (reuse pattern)

**Execution strategy:**

- Sequential: Backend mutation MUST complete before frontend can import types

**Manual testing:**

- curl POST with valid/invalid credentials
- Verify JWT token returned
- Test failed login after 3 attempts

---

## Why This Matters

✅ **Agent investigates technical reality** (what exists, current patterns)
✅ **Engineer provides requirements** (what they want, where it goes, priorities)
✅ **Prevents asking questions agent can answer** through codebase analysis
✅ **Ensures prompts based on actual codebase state** (not assumptions)
✅ **Applies to BOTH frontend and backend features**

---

## Anti-Pattern: Asking Before Investigating

❌ **DON'T:**

```
Engineer: "I need analytics widgets"
Agent: "Does Dashboard exist?"  ← Should investigate this yourself
Agent: "Where is Dashboard located?" ← Should grep for this
Agent: "What's the integration pattern?" ← Should read existing widgets
```

✅ **DO:**

```
Engineer: "I need analytics widgets"
Agent: [Investigates codebase]
Agent: "I found dashboard.component.ts exists with grid layout. Current pattern: widgets imported individually."
Agent: "Where on /dashboard should these widgets display?" ← Can't determine this yourself
```

---

**Status:** Canonical workflow for pre-prompt clarification and investigation
