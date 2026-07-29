# Quick Reference: Coordination Decision Tree

**Purpose:** Rapid decision-making for feature coordination requirements

---

## Decision Flowchart

### Question 1: Do tasks share schema/types?

**YES** → High Coordination (Continue to Q2)
**NO** → Low Coordination (Skip to Protocol Selection)

### Question 2: Do tasks import from each other?

**YES** → Sequential Execution Required (Import Chain Analysis)
**NO** → Parallel Possible (Continue to Q3)

### Question 3: Do tasks modify same files?

**YES** → Sequential Execution Required (Merge Conflict Prevention)
**NO** → Parallel Confirmed (Apply High Coordination Protocol)

---

## Protocol Selection

### Low Coordination

**Applies to:**

- Infrastructure-independent tasks
- Different concerns (database, API, UI scaffolding)
- No shared types/contracts

**Requirements:**

- Basic naming conventions
- Minimal validation overhead
- Focus on individual quality

### High Coordination

**Applies to:**

- Schema-code integration
- Shared types across agents
- Shared API types → controllers → UI

**Requirements:**

- Field naming convention locks
- Technology stack specifications
- Cross-agent validation
- Integration validation layer

---

## Pattern Validation

- **Low coordination:** Proven successful with minimal overhead
- **High coordination:** Requires systematic coordination mechanisms
- **Import chains:** Sequential execution required when dependencies exist

---

**See Also:**

- Chapter 6: Field Naming Locks
- Chapter 8: Import Dependency Analysis
