# Testing Standards — operational checklist

Fast lookup while working. The full specification, including stack detection, Task 0
deliverables, per-code-type guidance and the infrastructure agent task, is in
[`methodology/testing-as-infrastructure.md`](../methodology/testing-as-infrastructure.md).
When the two disagree, the methodology file wins.

## Before parallel work starts

- [ ] A test framework exists and runs. One command, no undocumented setup.
- [ ] At least one example test passes, proving the framework actually works.
- [ ] The test database (or equivalent fixture) is prepared and separate from development.
- [ ] The run command is recorded where agents will look for it, not just in your head.

If any of these is missing, it is Task 0 work. An agent handed a project with no working
test command defers testing and says so — reasonably. The framework is infrastructure, not
a feature deliverable.

See: *Updated Task 0 Responsibilities* and *Technology Stack Detection* in the methodology file.

## Writing tests alongside a feature

- [ ] **Unit tests** — cover the edge cases and error paths. Doubles are fine here.
- [ ] **At least one integration test** — happy path, real database, real collaborators,
      **no doubles for the thing under test**.

Both tiers, every feature. A double encodes your belief about a collaborator; the
integration test checks the collaborator. Bugs live in that gap — a null where an empty
string was assumed, a decimal arriving as a string, a timezone shifting a date.

See: *Agent Responsibilities: Testing is Part of "Done"*.

## Coverage is a guideline, not a gate

Every percentage in the methodology file is a **default starting point to adjust**, not a
universal rule. Coverage is a contested metric, and chasing a fixed number produces
low-value tests written to move the number — worse than having no target.

- [ ] Set the level to the project's actual risk. A prototype and a payments service do not
      warrant the same rigor.
- [ ] If the project enforces a floor in CI, that number wins over any default here.
- [ ] Do not add tests solely to raise a percentage.

See: *Coverage Numbers Are a Guideline, Not a Mandate* and *Coverage Guideline by Code Type*.

## Before claiming a task complete

- [ ] The full suite passes — not just the tests you wrote.
- [ ] The new integration test genuinely exercises the real collaborator.
- [ ] No test was modified to make a failure disappear. A failing test is a finding; report
      it rather than editing it.
- [ ] Coverage has not silently dropped, if the project tracks it.

See: *Pre-Completion Validation* in the methodology file, and
[`methodology/validation-gates.md`](../methodology/validation-gates.md) for the gates
themselves — this file does not restate them.

## In the session log

- [ ] What you tested and what you deliberately did not.
- [ ] Which tier caught which bug, if any.
- [ ] Anything you could not test, and why.

See: *Session Logging: Testing Strategy Section*.
