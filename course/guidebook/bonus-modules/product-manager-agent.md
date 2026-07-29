# Bonus Module: Product Manager Agent

## What You'll Build: Three Phases

**Goal:** Understand what YOU actually built

**Agent tasks:**

- Read all source files in `src/` directory
- Identify implemented features and capabilities
- Document database schema and models
- Map REST API endpoints available
- Analyze frontend components and pages
- Document AI features and integrations
- Note architectural patterns used

**Output:** `.claude/workspace/pm-analysis/codebase-analysis.md`

**Example output:**

```markdown
# Codebase Analysis: Your CRM Implementation

## Current Implementation

**Core Features:**

- ✅ CRUD operations: Complete (leads, interactions, tasks)
- ✅ AI summaries: Implemented with Sequelize persistence
- ✅ AI scoring: Implemented with persistence + caching
- ✅ AI recommendations: Implemented with task integration
- ✅ Authentication: JWT with protected routes
- ✅ Real-time: WebSocket notifications with persistence
- ✅ Mobile: Angular Native app with lead list + detail

**Architecture:**

- Backend: NestJS 11.x + Sequelize + PostgreSQL + REST
- Frontend: Angular + HttpClient + TypeScript
- PWA: Angular service worker + HttpClient
- AI: OpenAI GPT-4 via Anthropic Claude

**Database Schema:**

- User (id, email, passwordHash, createdAt)
- Lead (id, name, email, phone, budget, status, aiSummary, activityScore)
- Interaction (id, leadId, userId, type, notes, date)
- Task (id, leadId, title, description, priority, status, aiGenerated)
- Notification (id, userId, type, message, read, createdAt)

**API Operations:**

- Queries: leads, lead, interactions, tasks, users
- Mutations: createLead, updateLead, deleteLead, createInteraction, updateTask
- Subscriptions: notificationReceived

## Feature Gaps (To Research)

**What's NOT implemented:**

- Email integration (send/receive emails from CRM)
- Pipeline visualization (drag-and-drop stages)
- Bulk operations (select multiple leads)
- Advanced reporting (charts, analytics)
- Document storage (attach files to leads)
- Calendar integration (schedule meetings)
- Team collaboration (assign leads, share notes)
```

---

### Phase 2: Competitive Research Agent (2-3 hours)

**Goal:** Understand what leading CRMs offer

**Agent tasks:**

- Use Context7 MCP to research HubSpot CRM features
- Use Context7 MCP to research Salesforce CRM features
- Use Context7 MCP to research Pipedrive features
- Use Context7 MCP to research other modern CRMs
- Identify common features across all competitors
- Find unique features that differentiate leaders
- Analyze market trends (what users expect in 2025)

**Context7 MCP usage:**

```
/resolve-library-id hubspot
/get-library-docs /hubspot/crm topic:"core features"

/resolve-library-id salesforce
/get-library-docs /salesforce/crm topic:"feature overview"

/resolve-library-id pipedrive
/get-library-docs /pipedrive/api topic:"crm capabilities"
```

**Output:** `.claude/workspace/pm-analysis/competitive-research.md`

**Example output:**

```markdown
# Competitive Research: Modern CRM Features

## HubSpot CRM (Market Leader)

**Core Features:**

- Email integration (Gmail/Outlook sync)
- Deal pipeline with drag-and-drop stages
- Email sequences and templates
- Meeting scheduler
- Document storage and sharing
- Sales automation workflows
- Mobile app (full feature parity)
- Reporting dashboards
- Team collaboration tools

**Differentiators:**

- Free tier with robust features
- Easy onboarding and UX
- Marketing automation integration

## Salesforce CRM (Enterprise Leader)

**Core Features:**

- Customizable pipeline stages
- Advanced reporting and dashboards
- Email integration
- Territory management
- Forecasting and analytics
- Mobile app
- Third-party integrations (AppExchange)
- AI-powered insights (Einstein)

**Differentiators:**

- Highly customizable
- Enterprise-grade scalability
- Extensive ecosystem

## Pipedrive (Sales-Focused)

**Core Features:**

- Visual pipeline management
- Email integration and tracking
- Activity scheduling
- Sales reporting
- Mobile app
- Goal tracking
- Team performance metrics

**Differentiators:**

- Sales-centric design
- Simple, intuitive UI
- Activity-based selling methodology

## Feature Gaps Analysis

**You're missing (all competitors have):**

1. ❌ Email integration (send/receive/track emails)
2. ❌ Visual pipeline (drag-and-drop deal stages)
3. ❌ Document storage (attach files to leads)
4. ❌ Calendar integration (schedule meetings)
5. ❌ Advanced reporting (charts, dashboards)
6. ❌ Bulk operations (multi-select actions)
7. ❌ Email templates (reusable messages)

**You have (competitive advantage):**

1. ✅ AI summaries (auto-generate lead summaries)
2. ✅ AI scoring (automatic activity/lead scoring)
3. ✅ AI recommendations (task suggestions)
4. ✅ Real-time notifications (WebSocket updates)

**Market trends (2025):**

- AI-first features becoming standard
- Mobile app must have feature parity
- Real-time collaboration expected
- Integration with communication tools (email, Slack)
```

---

### Phase 3: Feature Roadmap Generation (1-2 hours)

**Goal:** Synthesize research into prioritized roadmap

**Agent tasks:**

- Combine codebase analysis + competitive research
- Identify highest-value features (competitive gaps + user demand)
- Estimate implementation complexity (based on YOUR codebase patterns)
- Prioritize features: high-value + reasonable complexity
- Generate roadmap with 5-10 features
- For each feature provide:
    - Feature description and user value
    - Implementation complexity (hours estimate)
    - Priority level (high/medium/low)
    - Technical approach suggestions
    - Dependencies and prerequisites

**Output:** `.claude/workspace/pm-analysis/feature-roadmap.md`

**Example output:**

```markdown
# CRM Feature Roadmap (Generated for Your Implementation)

**Generated:** 2025-01-15
**Based on:** Codebase analysis + competitive research
**Total features:** 8 prioritized

---

## High Priority (Competitive Gaps + High Value)

### 1. Email Integration (4-6 hours)

**User value:** Send emails directly from CRM, track opens/responses, eliminate context switching

**Competitive gap:** All competitors have this (HubSpot, Salesforce, Pipedrive)

**Implementation approach:**

- Backend: NestJS EmailService using Nodemailer
- Frontend: Email compose modal in lead detail page
- Schema: Add `Email` model (leadId, subject, body, sentAt, openedAt)
- Integration: Gmail API or SMTP configuration
- REST: `POST /emails` (send), `GET /emails` (list)

**Technical considerations:**

- Environment variables for SMTP config
- Email template system (optional)
- Track email opens (tracking pixel)
- Store sent emails in database

**Complexity:** Medium-High
**Estimated time:** 4-6 hours
**Priority:** HIGH (critical competitive gap)

---

### 2. Lead Pipeline Visualization (3-4 hours)

**User value:** Visual funnel showing lead stages, drag-and-drop to change stage, sales velocity insights

**Competitive gap:** HubSpot, Salesforce, Pipedrive all have visual pipelines

**Implementation approach:**

- Frontend: Angular CDK Drag and Drop
- Schema: Add `stage` field to Lead model (prospect, qualified, proposal, negotiation, closed)
- Backend: `updateLeadStage` mutation
- UI: Kanban board view with columns for each stage
- Analytics: Count leads per stage, conversion rates

**Technical considerations:**

- Use existing Lead model (add stage field)
- `PATCH /leads/:id` for stage updates
- Optimistic UI updates (immediate feedback)
- Real-time updates (WebSocket for multi-user)

**Complexity:** Medium
**Estimated time:** 3-4 hours
**Priority:** HIGH (strong user value + reasonable complexity)

---

### 3. Bulk Operations (2-3 hours)

**User value:** Select multiple leads, perform actions (delete, assign, update status), save time

**Competitive gap:** Standard CRM feature (all competitors)

**Implementation approach:**

- Frontend: Checkbox selection on lead list
- UI: Bulk action toolbar (appears when items selected)
- Backend: REST endpoints accepting arrays
- Actions: Bulk delete, bulk update status, bulk assign

**Technical considerations:**

- REST endpoints: `POST /leads/bulk-delete`, `POST /leads/bulk-update`
- Frontend state: Track selected lead IDs
- Confirmation dialogs (prevent accidents)
- Optimistic updates + refetch

**Complexity:** Low-Medium
**Estimated time:** 2-3 hours
**Priority:** HIGH (high value, low complexity)

---

## Medium Priority (Enhancement Features)

### 4. Advanced Reporting Dashboard (4-5 hours)

**User value:** Visualize lead pipeline, activity trends, conversion metrics

**Competitive gap:** Salesforce/HubSpot have advanced dashboards

**Implementation approach:**

- Frontend: Chart library (ngx-charts or Chart.js)
- Backend: Aggregation queries (Sequelize or raw SQL)
- Charts: Funnel chart (pipeline), line chart (activity trends), bar chart (conversions)
- Page: New `/dashboard` route with widgets

**Technical considerations:**

- Database aggregation queries (performance)
- Caching for expensive queries
- Date range filters (last 7/30/90 days)
- Real-time updates (optional)

**Complexity:** Medium-High
**Estimated time:** 4-5 hours
**Priority:** MEDIUM (nice-to-have, higher complexity)

---

### 5. Document Storage (3-4 hours)

**User value:** Attach files to leads (proposals, contracts, notes), centralized storage

**Competitive gap:** All CRMs support file attachments

**Implementation approach:**

- Backend: File upload service (NestJS + Multer)
- Storage: AWS S3 or local filesystem
- Schema: `Document` model (leadId, filename, url, uploadedAt)
- Frontend: File upload component on lead detail
- REST: `POST /documents` (upload), `GET /documents` (list)

**Technical considerations:**

- File size limits (5-10 MB)
- File type restrictions (PDF, DOCX, images)
- Storage location (S3 vs local for dev)
- Signed URLs (secure access)

**Complexity:** Medium
**Estimated time:** 3-4 hours
**Priority:** MEDIUM (useful but not critical)

---

## Lower Priority (Nice-to-Have Features)

### 6. Calendar Integration (4-6 hours)

**User value:** Schedule meetings with leads, sync to Google Calendar, set reminders

**Implementation approach:**

- Backend: Google Calendar API integration
- Schema: Add `Meeting` model (leadId, startTime, endTime, location)
- Frontend: Calendar picker on lead detail
- Integration: OAuth for user's Google account

**Complexity:** High
**Estimated time:** 4-6 hours
**Priority:** LOW (high complexity, optional feature)

---

### 7. Email Templates (2-3 hours)

**User value:** Reusable email templates for common scenarios (intro, follow-up, proposal)

**Implementation approach:**

- Schema: `EmailTemplate` model (name, subject, body, variables)
- Backend: Template rendering (replace {{leadName}} variables)
- Frontend: Template selector in email compose modal

**Complexity:** Medium
**Estimated time:** 2-3 hours
**Priority:** LOW (depends on email integration first)

---

### 8. Team Collaboration (5-6 hours)

**User value:** Assign leads to team members, share notes, see who's working on what

**Implementation approach:**

- Schema: Add `assignedTo` field to Lead model (foreign key to User)
- Backend: Assignment mutations
- Frontend: User selector, filter by assigned user
- Real-time: Presence tracking (who's viewing lead)

**Complexity:** High
**Estimated time:** 5-6 hours
**Priority:** LOW (multi-user coordination, higher complexity)

---

## Recommended Implementation Order

**If you have time for 2-3 features (realistic for Days 3-5):**

1. **Bulk Operations** (2-3h) - Quick win, high value
2. **Pipeline Visualization** (3-4h) - Core CRM feature
3. **Email Integration** (4-6h) - If time allows, critical gap

**If you have more time (ambitious):**

4. **Advanced Reporting** (4-5h)
5. **Document Storage** (3-4h)

**Total realistic:** 9-13 hours across Days 3-5 = 3 features

**Note:** Each feature requires full validation (5 gates) and browser testing. Budget time accordingly.

---

## Next Steps

1. ✅ Review this roadmap
2. Choose features based on interest + time available
3. Use orchestration partner to create agent prompts for chosen features
4. Implement each feature systematically (agent → validation → testing)
5. Document learnings in `.claude/experiments/feature-X.md`
```

---

## Building the PM Agent: Complete Implementation Guide

### Step 1: Create Agent Prompt File

**Location:** `.claude/workspace/pm-agent-prompt.md`

**Complete prompt structure:**

````markdown
# Product Manager Agent: CRM Feature Roadmap Generator

## Your Role

You are a senior product manager analyzing a CRM codebase and generating a competitive feature roadmap.

## Context

You are analyzing a CRM application built during a 5-day intensive course. The engineer has completed core curriculum (CRUD, AI features, auth, real-time, mobile) and wants to know: "What features should I build next?"

Your job: Analyze their codebase, research competitors, and generate a prioritized feature roadmap.

## Task Breakdown

### Phase 1: Codebase Analysis (Systematic Discovery)

**Objective:** Understand what the engineer actually built.

**Steps:**

1. Read all source files in the following directories:

   - `src/backend/` (NestJS services, controllers, entities)
   - `src/frontend/` (Angular components, pages)
   - `src/app/` (Angular PWA components)

2. Document implemented features:

   - CRUD operations (what entities exist?)
   - AI features (what AI capabilities are implemented?)
   - Authentication (what auth strategy?)
   - Real-time features (WebSocket? Polling?)
   - Mobile features (what's available on mobile?)

3. Document database schema:

   - What models/entities exist?
   - What fields does each model have?
   - What relationships exist?

4. Document API operations:

   - REST read endpoints available (GET)
   - REST write endpoints available (POST/PATCH/DELETE)
   - Real-time channels available (WebSocket/SSE)

5. Identify architectural patterns:
   - Backend framework and patterns
   - Frontend state management
   - Mobile architecture
   - Testing approach

**Output format:**
Create `.claude/workspace/pm-analysis/codebase-analysis.md` with:

- Current Implementation (features list with ✅)
- Architecture (tech stack details)
- Database Schema (models and fields)
- API Operations (queries, mutations, subscriptions)
- Feature Gaps (what's NOT implemented)

**Example:**

```markdown
## Current Implementation

**Core Features:**

- ✅ CRUD operations: Complete (leads, interactions, tasks)
- ✅ AI summaries: Implemented with Sequelize persistence
  ... (continue for all features)
```
````

---

### Phase 2: Competitive Research (Context7 MCP)

**Objective:** Understand what leading CRMs offer.

**Steps:**

1. Research HubSpot CRM using Context7 MCP:

   ```
   Use Context7 MCP resolve-library-id: "hubspot crm"
   Use Context7 MCP get-library-docs: Query HubSpot CRM features
   ```

   Focus on: core features, unique capabilities, market positioning

2. Research Salesforce CRM using Context7 MCP:

   ```
   Use Context7 MCP resolve-library-id: "salesforce crm"
   Use Context7 MCP get-library-docs: Query Salesforce CRM features
   ```

   Focus on: enterprise features, customization, integrations

3. Research Pipedrive using Context7 MCP:

   ```
   Use Context7 MCP resolve-library-id: "pipedrive"
   Use Context7 MCP get-library-docs: Query Pipedrive features
   ```

   Focus on: sales-focused features, pipeline management

4. Identify patterns:
    - Features ALL competitors have (table stakes)
    - Features that differentiate leaders
    - Market trends (2025 expectations)

**Output format:**
Create `.claude/workspace/pm-analysis/competitive-research.md` with:

- HubSpot analysis (core features, differentiators)
- Salesforce analysis (core features, differentiators)
- Pipedrive analysis (core features, differentiators)
- Feature Gaps Analysis (what you're missing vs competitors)
- Your Competitive Advantages (what you have that's unique)
- Market Trends (what users expect in 2025)

**Example:**

```markdown
## Feature Gaps Analysis

**You're missing (all competitors have):**

1. ❌ Email integration
2. ❌ Visual pipeline
   ... (continue)

**You have (competitive advantage):**

1. ✅ AI summaries
   ... (continue)
```

---

### Phase 3: Feature Roadmap Generation (Prioritization)

**Objective:** Synthesize research into actionable roadmap.

**Steps:**

1. Combine codebase analysis + competitive research
2. Identify feature opportunities:

    - Competitive gaps (features competitors have, you don't)
    - Natural extensions (features that build on what exists)
    - Market trends (emerging expectations)

3. For each potential feature, analyze:

    - **User value:** Why would users want this? (high/medium/low)
    - **Competitive gap:** Do competitors have this? (all/some/none)
    - **Implementation complexity:** Based on existing codebase (low/medium/high)
    - **Dependencies:** What must exist first?

4. Prioritize features:

    - HIGH priority: High user value + competitive gap + reasonable complexity
    - MEDIUM priority: Medium value or higher complexity
    - LOW priority: Nice-to-have or very high complexity

5. For each feature (aim for 5-10 total), provide:

    - Feature name and description
    - User value explanation
    - Competitive gap analysis
    - Implementation approach (specific to their codebase):
        - Backend changes needed
        - Frontend changes needed
        - Schema changes needed
        - New dependencies required
    - Technical considerations
    - Complexity rating (Low/Medium/High)
    - Time estimate (hours)
    - Priority (HIGH/MEDIUM/LOW)

6. Provide recommended implementation order:
    - If engineer has 6-9 hours: Which 2-3 features?
    - If engineer has 12-15 hours: Which 3-5 features?

**Output format:**
Create `.claude/workspace/pm-analysis/feature-roadmap.md` with:

- Roadmap metadata (date generated, total features)
- High Priority Features (3-4 features)
    - Each feature: full detail (description, value, approach, estimate)
- Medium Priority Features (2-3 features)
    - Each feature: full detail
- Lower Priority Features (2-3 features)
    - Each feature: full detail
- Recommended Implementation Order
    - Realistic path for 2-3 features (9-13 hours)
    - Ambitious path for 4-5 features (15-20 hours)

**Example:**

```markdown
### 1. Email Integration (4-6 hours)

**User value:** Send emails directly from CRM, track opens/responses

**Competitive gap:** All competitors have this

**Implementation approach:**

- Backend: NestJS EmailService using Nodemailer
- Schema: Add Email model (leadId, subject, body, sentAt)
  ... (full detail)

**Complexity:** Medium-High
**Estimated time:** 4-6 hours
**Priority:** HIGH
```

---

## Deliverables

By end of PM agent execution, you should have created 3 files:

1. `.claude/workspace/pm-analysis/codebase-analysis.md`
2. `.claude/workspace/pm-analysis/competitive-research.md`
3. `.claude/workspace/pm-analysis/feature-roadmap.md`

**The feature roadmap is the key deliverable** - this becomes the engineer's personalized curriculum for Days 3-5.

---

## Important Notes

- Be specific to THEIR codebase (use their tech stack, their patterns)
- Provide realistic time estimates (this is a learning environment, not production)
- Prioritize high-value, reasonable-complexity features (set them up for success)
- Include both "table stakes" features (competitive gaps) and innovative features (AI advantages)
- Remember: They have 9-15 hours to implement features (aim for 2-4 realistic features)

---

## Success Criteria

- ✅ Codebase analysis accurately reflects their implementation
- ✅ Competitive research covers 3+ major CRMs
- ✅ Feature roadmap has 5-10 prioritized features
- ✅ Each feature has specific implementation guidance
- ✅ Time estimates are realistic
- ✅ Recommended implementation order provided

````

---

### Step 2: Launch PM Agent

**In your Claude Code session:**

```bash
cd ~/ai-academy-<your-name>

# Make sure you're in the project root
# PM agent will need to read src/ directory

# Launch the agent (if using orchestration partner):
You: "I want to build the Product Manager agent. Use the prompt at .claude/workspace/pm-agent-prompt.md"

Orchestration Partner: [Launches PM agent with complete prompt]

# Or launch directly:
# Copy the PM agent prompt
# Create new Claude Code session or agent
# Execute the PM agent tasks
````

**Agent execution time:** 4-6 hours

**What the agent does:**

1. Reads your entire `src/` directory
2. Uses Context7 MCP to research HubSpot, Salesforce, Pipedrive
3. Generates 3 analysis files
4. Produces feature roadmap with 5-10 prioritized features

**Output location:** `.claude/workspace/pm-analysis/`

- `codebase-analysis.md`
- `competitive-research.md`
- `feature-roadmap.md` ← **This is what you'll use**

---

### Step 3: Review PM Roadmap

**After PM agent completes:**

1. **Read the feature roadmap:** `.claude/workspace/pm-analysis/feature-roadmap.md`

2. **Understand your options:** PM suggested 5-10 features, prioritized by value + complexity

3. **Choose features to implement:** Based on:
    - Interest (what sounds fun to build?)
    - Time available (how many hours left in course?)
    - Learning goals (what skills do you want to develop?)
    - Priority (PM marked HIGH/MEDIUM/LOW)

**Example decision:**

```
PM suggested 8 features. I have ~12 hours across Days 3-5.

Choosing:
1. Bulk Operations (2-3h) - Quick win, high value
2. Pipeline Visualization (3-4h) - Core CRM feature
3. Email Integration (4-6h) - Critical gap, good learning

Total: 9-13 hours (realistic)
```

---

### Step 4: Implement PM-Suggested Features

**For each chosen feature:**

1. **Use orchestration partner** to create agent prompt:

   ```
   You: "Create agent prompt for: Email Integration feature from PM roadmap"

   Orchestration Partner: [Reads PM roadmap, creates complete agent prompt following implementation approach from PM]
   ```

2. **Launch agent** to implement feature:

   ```
   Agent implements:
   - Backend EmailService (NestJS + Nodemailer)
   - Email model (Sequelize)
   - REST endpoints (POST /emails)
   - Frontend email compose modal
   - Unit + integration tests
   ```

3. **Run validation gates:**

   ```bash
   npm run type-check  # 0 errors
   npm run lint        # 0 warnings
   npm test            # All passing
   # Check processes
   # Browser test email sending
   ```

4. **Verify feature works** in browser

5. **Document learnings** (optional):

    - `.claude/experiments/email-integration.md`
    - What worked well?
    - What was challenging?
    - What would you do differently?

6. **Choose next PM feature** and repeat

**This provides work through Days 3-5** - implement as many PM features as time allows.

---

## Example Timeline: PM Agent Across 4 Days

**Day 2 Afternoon (4-6 hours):**

- Build PM agent
- Get codebase analysis
- Get competitive research
- Get feature roadmap (5-10 features)

**Day 3 (4-6 hours):**

- Review PM roadmap
- Choose first feature: "Email Integration" (4-6h)
- Implement with agent + validation
- Feature complete + tested

**Day 4 (4-6 hours):**

- Choose second feature: "Pipeline Visualization" (3-4h)
- Implement with agent + validation
- Feature complete + tested

**Day 5 Morning (2-3 hours):**

- Choose third feature: "Bulk Operations" (2-3h)
- Implement with agent + validation
- Feature complete + tested

**Day 5 Afternoon:**

- Demo your CRM (now has 10+ features!)
- Showcase PM-generated roadmap
- Share learnings from PM-driven development

**Total features built:** Core curriculum (7) + PM features (3) = 10 features

---

## Who Should Build PM Agent?

**Ideal for:**

- ✅ Finished all required Day 1-4 features quickly (ahead of schedule)
- ✅ Want to keep building features (not just polish existing work)
- ✅ Interested in market research and product thinking
- ✅ Want experience with PM-driven development workflow
- ✅ Have 4-6 hours to build PM agent (Days 2-3)
- ✅ Have additional time to implement PM features (Days 3-5)
- ✅ Comfortable with complex multi-phase agents

**Skip if:**

- ❌ Still working on required features (focus there first - core curriculum is success)
- ❌ Want to polish existing work (that's equally valuable)
- ❌ Interested in other stretch goals (OAuth, mobile, analytics are great choices)
- ❌ Prefer directed curriculum (PM agent is self-directed and open-ended)
- ❌ Don't have 4-6 hours for PM agent itself (consider other bonus modules)

**This is the most advanced stretch goal** - only for engineers who:

- Completed core curriculum early
- Want unlimited personalized work
- Enjoy self-directed learning

---

## Expected Outcomes

**After completing PM agent module:**

**Technical skills:**

- ✅ AI PM agent that analyzes CRM codebases
- ✅ Competitive research using Context7 MCP
- ✅ Feature roadmap for YOUR specific implementation
- ✅ 2-4 PM-suggested features implemented (based on time)

**Methodology skills:**

- ✅ Multi-phase agent orchestration (analysis → research → synthesis)
- ✅ Context7 MCP for market research
- ✅ PM-driven development workflow
- ✅ Feature prioritization (value vs complexity)

**Transferable to company work:**

- ✅ Competitive analysis workflows
- ✅ Product thinking with AI assistance
- ✅ Self-directed feature development
- ✅ Market-driven prioritization

**Unique outcome:**

- Your CRM has personalized feature roadmap (not generic curriculum)
- You built features specific to YOUR implementation gaps
- Experience real PM-driven development workflow

---

## Troubleshooting

**PM agent taking too long (>6 hours)?**

- Scope down competitive research (focus on 2-3 CRMs instead of 4-5)
- Limit roadmap to 5-7 features instead of 8-10
- Use Context7 MCP efficiently (targeted queries, not broad exploration)

**PM roadmap features too complex?**

- Ask PM agent to suggest "quick win" features (2-3 hours each)
- Focus on HIGH priority features marked as Low-Medium complexity
- Skip Low priority features (nice-to-have, not critical)

**Not sure which PM features to implement?**

- Start with highest priority feature marked as "quick win"
- Choose features that build on existing patterns (less learning curve)
- Pick features that interest you personally (motivation matters)

**PM agent analysis doesn't match my codebase?**

- Verify PM agent read all `src/` directories
- Check that codebase analysis is accurate before moving to research phase
- Re-run codebase analysis phase if needed

**Context7 MCP not returning good research?**

- Use more specific queries ("hubspot crm email integration features")
- Try different library IDs (resolve-library-id with variations)
- Research 2-3 CRMs deeply vs 5+ CRMs shallowly

---

**✅ Bonus Module: Product Manager Agent**

**This is the ultimate stretch goal - unlimited personalized work.**

**Back to:** [Bonus Modules Overview](README.md)
