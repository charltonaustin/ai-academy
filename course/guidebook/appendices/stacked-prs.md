# Appendix B: Stacked PRs with git-town

**Purpose:** Advanced git pattern for breaking complex features into reviewable chunks

**When introduced:** Day 5 bonus session

---

## Overview

Stacked PRs allow submitting interdependent PRs for parallel review, maintaining clean single-responsibility commits.

---

## When to Use Stacked PRs

### Scenario 1: Complex Multi-Week Features

Break into logical, reviewable pieces for incremental approval

### Scenario 2: Interdependent Changes

Submit dependent PRs that build on each other

### Scenario 3: Clean History

Maintain single-responsibility commits for better review

---

## Complete Workflows with git-town

### Installation

```bash
brew install git-town
```

### Workflow 1: Create Stack

```bash
# [Content: Complete stacked PR creation example]
```

### Workflow 2: Update Stack

```bash
# [Content: Sync and update existing stacks]
```

### Workflow 3: Merge Stack

```bash
# [Content: Ship approved PRs in order]
```

---

## Key git-town Commands

- `git town hack <branch>`: Create feature branch from main
- `git town append <branch>`: Create dependent branch
- `git town sync`: Keep stack synchronized
- `git town ship`: Merge and update dependents

---

## When NOT to Use

- ❌ Simple features (single PR sufficient)
- ❌ Truly independent features (parallel, not stacked)
- ✅ Multi-week complex features
- ✅ Team review bottlenecks
- ✅ Incremental approval desired

---

**Related:** Chapter 8 (Import Dependency Analysis)
