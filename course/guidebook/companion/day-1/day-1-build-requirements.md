# Day 1: Foundation & Core CRM - Build Requirements

**Session 01 of 5**

**Prerequisites:** Complete [Tools & Setup](tools-setup.md) before starting this section.

---

## Build Your CRM (After Tools Working)

Now that your tools are set up, it's time to build. You'll be working at your own pace for the rest of the day.

---

### What You're Building Today

#### Required (by end of day):

- [ ] **Infrastructure:** NestJS + Sequelize + REST + PostgreSQL
- [ ] **Data Model:** Lead and Interaction models
- [ ] **CSV Import:** Script that imports 50-100+ leads with interactions
- [ ] **Display:** Lead list page
- [ ] **CRUD Operations:**
    - Create new lead (form with validation)
    - Edit existing lead
    - Delete lead (with confirmation)
    - Log interaction for a lead
- [ ] **Detail Page:** Lead detail showing all information + interaction history
- [ ] **Testing:** Unit tests for core business logic (services, utilities)

#### Stretch Goals (in order, if time remains):

1. **AI Lead Summaries**

    - LLM generates 2-3 sentence summary of lead
    - Input: Lead data + all interactions
    - **Persistent storage:** Add `summary` field to Lead model
    - Save LLM output to database (don't recalculate on every page load)
    - Display on lead detail page
    - "Regenerate Summary" button to update when interactions change

2. **AI Activity Scoring**

    - 0-100 score based on engagement, recency, budget
    - **Persistent storage:** Add `activityScore` field to Lead model (INTEGER type)
    - Save score to database (cache for performance)
    - Color-coded badges (red 0-30, yellow 31-70, green 71-100)
    - Sort dashboard by score (highest first)
    - "Recalculate Score" button to update

3. **Polish Frontend**
    - Better styling and UX
    - Loading states
    - Error handling
    - Responsive design

---

### Your Approach: Figure It Out

**You're free to:**

- Build features in any order
- Use one Claude Code instance or multiple (backend/frontend/etc.)
- Organize the project however makes sense to you
- Decide your own quality standards
- Choose when to test and how much

**This is intentionally open-ended.** We want to see how you naturally approach building with AI agents.

---

### Required Tech Stack

**Package Manager:**

- npm

**Backend:**

- NestJS
- PostgreSQL
- Sequelize
- REST controllers (`@nestjs/platform-express`)

**Frontend:**

- Angular
- TypeScript
- UI framework (your choice)

**Testing:**

- Jest for unit tests
- Focus on core business logic (services, utilities)
- Goal: Catch basic bugs, not comprehensive coverage yet

**Why testing now?** Day 2 covers testing strategies in depth, but starting with unit tests on Day 1 builds good habits.

**Examples:**

- Lead import logic: Test that CSV parsing works
- Database operations: Test that lead creation works
- REST controllers: Test that endpoints return expected data

**Don't worry about:** Integration tests, E2E tests, coverage thresholds (Day 2 material)

**You decide:**

- Project structure
- Field naming conventions
- How layers communicate
- Quality standards
- Testing approach

---

### Feature Details

#### Task 0: Infrastructure Setup

**What you need:**

- NestJS project initialized
- PostgreSQL database connected via Sequelize
- REST API server running
- Basic project structure

**How you get there:** Up to you

---

#### Feature 1: CSV Lead Import

**What you need:**

- Script that reads CSV file
- Creates leads in database
- Generates 2-5 interactions per lead (call logs, emails, etc.)
- 50-100 leads total

**📊 Seed Data:** You should generate your own data using an LLM.

**Sample lead structure (suggestions, not requirements):**

- Contact info (name, email, phone)
- Property details (budget, location preferences)
- Status (active, contacted, closed, etc.)

**Sample interaction structure:**

- Type (call, email, meeting, etc.)
- Date/time
- Notes
- Related to which lead

---

#### Feature 2A: Dashboard Display

**What you need:**

- Table showing all leads
- Click lead → detail page
- Detail page shows lead info + interactions

**UI decisions:** Up to you (styling, layout, etc.)

---

#### Feature 2B: CRUD Operations

**What you need:**

- Add new lead (form)
- Edit existing lead
- Log new interaction for a lead
- All changes persist to database

---

### Things to Watch For

**As you build, pay attention to:**

- How you're coordinating between different parts of the codebase
- Any friction between backend and frontend (types, field names, etc.)
- Moments where you're unsure if something is "done"
- Times when you have to backtrack or fix integration issues
- Whether another engineer could easily run your code

**Take mental notes (or real notes!):**

- What's working smoothly?
- Where are you hitting friction?
- What decisions are you making on the fly?
- What would you do differently if starting over?

---

### Getting Unstuck

**If you hit a wall:**

- Ask Claude Code to explain what's wrong
- Start smaller - Instead of large open ended prompts, try more targeted prompts for much smaller slices of work
- Ask Claude Code -
    - "What is the state of my code now?"
    - Do I have working REST API infra? NestJS? Angular frontend?
- Try a different approach - be creative. If something isn't working, don't be afraid to try something TOTALLY
  different. Try and note what works and what doesn't
- Ask for guidance!!!

---

## By End of Day

**Minimum completion:**

- [ ] Infrastructure working (can run: `npm run dev`)
- [ ] CRUD operations functional in browser
- [ ] Unit tests for core logic (Jest)
- [ ] Another engineer could: `git clone → npm install → npm run setup → npm run dev`

**If you finish early:**

- [ ] AI summaries with persistent storage
- [ ] AI scoring with persistent storage
- [ ] Polished UI

**Tomorrow:** Methodology introduction + AI intelligence focus

---

**✅ Day 1 complete**

**See full trail:** [Companion overview](../README.md)
 