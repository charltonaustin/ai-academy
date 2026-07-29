# Appendix A: Git Worktrees for Parallel Work

**Purpose:** Advanced git pattern for experimental approaches and brownfield safety

**When introduced:** Day 5 bonus session

---

## Overview

Git worktrees create separate working directories for different branches, enabling safe experimentation and parallel
work.

---

## When to Use Worktrees

### Scenario 1: Experimental Approaches

Try multiple solutions in parallel, keep best, discard rest

### Scenario 2: Brownfield Safety

Keep main worktree stable for reference while experimenting

### Scenario 3: Review While Developing

Review PR in one worktree, continue development in another

---

## Complete Workflows

### Workflow 1: Experimental Feature

```bash
# [Content: Complete example of experimental workflow]
```

### Workflow 2: Brownfield Exploration

```bash
# [Content: Safe brownfield experimentation pattern]
```

### Workflow 3: Parallel Review

```bash
# [Content: Review without blocking development]
```

---

## Gotchas and Solutions

### Gotcha: Uncommitted Files Invisible Across Worktrees

**Problem:** Files in main worktree not visible in feature worktree unless committed
**Solution:** Commit docs before creating worktree OR create docs in worktree
**Evidence:** Web Forms workflow error

---

## When NOT to Use

- ❌ Short features with file isolation
- ❌ Simple parallel execution (current patterns work)
- ✅ Long-running experiments (days/weeks)
- ✅ High-risk changes requiring stable reference

---

**Related:** Day 3 (Git Worktrees with Dependencies) and Day 5 (Brownfield Hackathon)
