# Day 3: Advanced Backend Features (Auth + Real-Time)

**Session 03 of 5**

**Today's Goal:** Build authentication system + real-time notifications while learning git worktrees and advanced MCP's

**Learn worktrees with realistic features that have interdependencies - preparing you for professional development
patterns**

---

## Advanced MCP Servers (Install When Needed)

### When to Use Advanced Tools

**Days 1-2:** Essential MCP servers (Filesystem, Playwright, Context7)
**Day 2+:** Add advanced tools when complexity increases

**Rule of thumb:**

- **Simple features:** Essential MCP servers sufficient
- **Complex debugging:** Add Sequential Thinking MCP
- **Important decisions:** Add Zen MCP for multi-model consensus

### The "Shiny Tool" Trap: Why More MCPs ≠ Better

**Tempting mistake:** Install every interesting MCP server "just in case"

**Why this backfires:**

- **Context bloat** - Each MCP adds to Claude's system prompt, consuming valuable context tokens
- **Tool confusion** - Too many options → Claude spends time deciding which tool to use → slower responses
- **Cognitive overload** - You forget what tools are available and when to use them
- **Maintenance burden** - More dependencies to keep updated and working
- **Diminishing returns** - Most features need 3-5 core tools, not 20

**The 80/20 rule for MCPs:**

- **Essential 3** cover 80% of work: Filesystem, Playwright, Context7
- **Advanced 2-3** handle remaining 20%: Sequential Thinking, Zen, specialized domain tools
- **Beyond that** you're trading context for rarely-used functionality

**Best practice:** Start minimal. Add tools only when you hit a specific need that existing tools can't solve. Remove
tools you haven't used in weeks.

---

### [Sequential Thinking MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)

**What it does:**

**Structured problem decomposition for complex issues**

Instead of Claude Code guessing, Sequential Thinking:

- Breaks problem into logical steps
- Documents thinking at each step
- Identifies assumptions and validates them
- Provides systematic debugging path

**When to use it:**

**Good for:**

- "AI integration isn't working as expected" (multi-layer debugging)
- "Tests pass but feature broken" (systematic investigation)
- "Why is this query returning wrong data?" (trace through layers)

**NOT needed for:**

- Simple bugs (missing import, typo)
- Straightforward features with clear path
- Things you already understand

**Example usage:**

```
You: "Use Sequential Thinking to debug:
My GET /leads/:id response returns null for lead.tasks, but the database has tasks.
Walk through the entire data flow from database → REST API → frontend."
```

**What you'll see:**

- Step-by-step analysis of data flow
- Validation at each layer (database, controller, DTO, frontend)
- Identification of where null is introduced
- Systematic solution path

---

### [Zen MCP](https://github.com/BeehiveInnovations/zen-mcp-server)

**What it does:**

**Multi-model consensus for architectural decisions**

Ask multiple AI models (GPT-4, Claude, Gemini, etc.) the same question and get synthesized recommendations.

**When to use it:**

**Good for:**

- "Should I use LangFuse tracing for all LLM calls or just complex ones?"
- "What's the best prompt structure for LLM-based activity scoring?"
- "How should I handle LLM errors in scoring to ensure reliability?"

**NOT needed for:**

- Following established patterns (use what's already working)
- Questions with obvious answers
- Time-sensitive decisions (consensus takes longer)

**Example usage:**

```
You: "Use Zen MCP to get multi-model consensus:
What's the best prompt structure for an LLM to calculate a lead activity score (0-100)?
Consider: what lead data to include, how to handle missing data, ensuring consistent numeric output.
The LLM should analyze: recent contact date, interaction count, budget range, engagement level."
```

**What you'll see:**

- Multiple models analyze the question
- Different prompt structures suggested
- Trade-offs discussed (context length, accuracy, consistency)
- Synthesized recommendation for best prompt design

### [Serena MCP](https://github.com/oraios/serena) Introduction

**Your codebase is getting substantial:**

- Multiple models (Lead, Interaction, Task, User)
- REST endpoints (controllers + DTOs)
- Frontend components across multiple pages
- Services, utilities, hooks

**Finding code manually is getting harder.**

**What it does:**

**Semantic code navigation and search**

Instead of grep/find (text search), Serena understands:

- Code structure (classes, functions, imports)
- Relationships (what calls what)
- Symbols (find all uses of a function)

**When to Use It**

**Good for:**

- "Where is Lead schema defined?"
- "Find all authentication-related code"
- "What files import useAuth hook?"
- "Show me all write endpoints (POST/PATCH/DELETE)"

**Essential for brownfield**

- Navigate existing codebases
- Understand existing patterns before adding features
- Find integration points

**Example usage:**

**Try these queries:**

```
You: "Use Serena MCP to find:
1. All Sequelize models in our codebase
2. All write endpoints defined
3. Where the Lead type is used"
```

**Practice**

- Use Serena to navigate your own code
- Find something you built yesterday
- See how it's faster than manual search

---

## Git Worktrees: Managing Feature Work in Real-World Scenarios

### What Are Git Worktrees?

Git worktrees allow you to check out multiple branches from the same repository into different directories. Each
worktree operates as an independent working directory while sharing the repository's git history.

See the [/course/guidebook/appendices/git-worktrees](/course/guidebook/appendices/git-worktrees) chapter for even more
detail.

**Primary uses:**

- **Context switching** - Work on different features without constant branch switching
- **Feature isolation** - Keep each feature's changes in a dedicated workspace
- **Parallel development** - Build independent features simultaneously
- **Code review** - Check out a PR branch without disrupting your current work

**Examples of truly independent features** (ideal for parallel worktrees):

- Dashboard analytics widgets + CSV export functionality
- Email templates system + Calendar integration
- Admin reporting panel + User profile settings

### Today's Realistic Challenge: Features with Dependencies

**Authentication + WebSocket Notifications**

These features represent a common real-world scenario: features that have interdependencies.

**The dependencies:**

Authentication provides foundational infrastructure:

- User model and JWT validation service
- Auth context and token management
- Protected route framework

WebSocket notifications integrate with this infrastructure:

- Backend WebSocket gateway authenticates connections using JWT
- Frontend establishes connections using auth tokens
- Notifications associate with authenticated users

**This is intentionally realistic.** Most professional development involves features with some level of interdependency.
Learning to manage these dependencies is valuable.

### Managing Dependencies with Contract-First Development

When features have interdependencies, professional teams use **contract-first development** to enable parallel work
while managing the dependencies.

**The pattern:**

Define the interface contract before implementation:

- What will authentication export? (User type, JWT validation, auth hooks)
- What will WebSocket import? (same types and services)
- Agree on the contract upfront between both feature teams

**Using mocks to work in parallel:**

While authentication is being built, WebSocket development can proceed by:

- Mocking the expected authentication interfaces based on the contract
- Building and testing the WebSocket feature against mocked dependencies
- Validating that the feature works with the mocked interfaces

Once authentication completes and merges:

- WebSocket work integrates the real authentication imports
- Mocks are replaced with actual implementations
- Features are re-validated with true integration

**Why this matters:**

This teaches professional collaboration patterns:

- Interface-driven development
- Working despite dependencies
- Clear integration path (mocks → real)
- Reducing integration surprises

### Creating Worktrees

**Using the helper script:**

```bash
./worktree.js notifications
```

The script automates worktree setup: creates directory, copies environment files, installs dependencies, and opens your
editor.

**Using git commands directly:**

```bash
git worktree add ../ai-academy-<name>-notifications -b feature/notifications
cd ../ai-academy-<name>-notifications
# Manual setup: copy .env files, run npm install
```

**Managing worktrees:**

**Using the helper script:**

```bash
./worktree-cleanup.js    # Interactive cleanup interface
```

**Using git commands directly:**

```bash
git worktree list        # View all active worktrees
git worktree remove <path>   # Remove specific worktree
```

### Why Worktrees Are Valuable Here

Even with dependencies between authentication and WebSocket notifications, worktrees provide real benefits:

**Feature isolation:**

- Each feature has dedicated workspace
- Changes stay organized and separated
- Easier to review individual features

**Context switching:**

- Work on WebSocket while auth builds (with mocking)
- Jump between features without branch switching in same directory
- Maintain separate mental contexts per feature

**Learning the tool:**

- Practice worktree mechanics on realistic scenario
- Prepare for future truly independent features
- Understand dependency management patterns

**Professional workflow:**

- Contract-first development (define interfaces upfront)
- Mocking strategy (work despite dependencies)
- Integration patterns (mocks → real implementations)

## Feature 1: JWT Authentication (Required)

**What to build:**

A complete authentication system with user registration, login, and protected routes.

**Backend requirements:**

- User model with secure password storage (bcrypt hashing)
- JWT token generation and validation
- REST endpoints: `POST /auth/register` and `POST /auth/login`
- Returns: JWT token + user data

**Frontend requirements:**

- Auth context with `useAuth` hook
- Login page (email + password form)
- Register page (email, password, firstName, lastName)
- Protected route wrapper component
- Token storage in localStorage
- Auto-login on page load (read token, validate, restore session)
- Logout functionality (clear token and state)

**Integration:**

- Protected routes redirect to login when not authenticated
- All existing pages (`/leads`, `/leads/:id`) require authentication
- Login/register redirect to dashboard on success

**Validation checklist:**

- [ ] Can register new user (creates in database, returns JWT)
- [ ] Can login with existing user (validates password, returns JWT)
- [ ] Protected routes redirect unauthenticated users to `/login`
- [ ] Token persists after page refresh
- [ ] Logout clears authentication state
- [ ] All 5 validation gates pass

---

## Feature 2: Real-Time WebSocket Notifications (Required)

**What to build:**

A complete notification system with database persistence, real-time delivery, and user interface.

**⚠️ Dependencies on Authentication:**

This feature integrates with the authentication system:

- Backend WebSocket gateway authenticates connections using JWT validation
- Frontend WebSocket connection requires auth token
- Notifications associate with authenticated users via User model

**Backend requirements:**

- Notification database model with fields:
    - User association
    - Notification type (lead_created, task_completed, score_updated, comment_added)
    - Title and message
    - Read/unread status
    - Related lead ID (optional link)
    - Timestamp
- WebSocket gateway (Socket.io + NestJS)
- Notification service that BOTH saves to database AND emits via WebSocket
- REST reads: get notifications, get unread count
- REST writes: mark as read, mark all read, delete notification
- Integrate with existing services (lead creation sends notification)

**Frontend requirements:**

- WebSocket connection hook (connects when user authenticated)
- Live notification toasts (show when WebSocket event received, auto-hide after 5s)
- Notification bell icon in header
- Unread count badge on bell
- Notification center dropdown (persistent history)
- Mark as read/unread functionality
- Delete notification functionality
- Click notification → navigate to related lead (if applicable)

**Integration:**

- When lead created → notification saved to database + live toast appears
- Notification history persists across page refreshes
- Unread count updates in real-time
- Add notification bell to main layout header

**Validation checklist:**

- [ ] Creating a lead generates notification (database + live toast)
- [ ] Notification center shows persistent history
- [ ] Unread count badge displays correctly
- [ ] Mark as read updates database and UI
- [ ] Notifications persist after page refresh
- [ ] Multiple browser windows receive real-time updates
- [ ] All 5 validation gates pass

---

## By End of Day 3

### Minimum Completion

**Authentication (Feature 1):**

- [ ] User model with password hashing
- [ ] JWT token generation and validation
- [ ] REST endpoints: register, login
- [ ] Frontend auth context with useAuth hook
- [ ] Login and register pages
- [ ] Protected routes working
- [ ] Browser testing: Complete auth flow works

**WebSocket Notifications (Feature 2):**

- [ ] Notification database model
- [ ] WebSocket gateway with Socket.io
- [ ] Notification service publishes events
- [ ] REST endpoints for notification history
- [ ] Frontend WebSocket connection
- [ ] Live notification toasts
- [ ] Notification bell with unread count badge
- [ ] Notification center with persistent history
- [ ] Mark as read/unread functionality
- [ ] Browser testing: Real-time notifications work

**Validation:**

- [ ] All 5 gates passing for both features
- [ ] TypeScript: 0 errors
- [ ] Tests passing
- [ ] Browser testing: Both features work end-to-end

**If you used mocks during parallel development:**

- [ ] All mocked interfaces replaced with real authentication imports
- [ ] Re-ran all validation gates after integration
- [ ] Verified real authentication works (not just mocked version)

---

## Stretch Goals (If Both Required Features Complete)

### Option 1: Continue PM-Suggested Features

**If you built PM agent on Day 2:**

- Review PM roadmap from Day 2
- Pick next highest priority feature
- Implement with agent assistance
- Unlimited work available

---

### Option 2: Google OAuth

**What to build:**

Add Google OAuth as an alternative login method alongside email/password authentication.

**Requirements:**

- Passport.js Google OAuth strategy
- Google Cloud Console OAuth credentials
- Backend OAuth callback route
- "Sign in with Google" button on login page
- Find or create user from Google profile
- Link Google account to existing users
- Store Google profile data (email, firstName, lastName, googleId)

**Validation:**

- [ ] "Sign in with Google" redirects to Google OAuth
- [ ] Successful OAuth creates/finds user and logs them in
- [ ] Can link Google account to existing email/password account
- [ ] All 5 validation gates pass

**See full trail:** [Companion overview](README.md)
