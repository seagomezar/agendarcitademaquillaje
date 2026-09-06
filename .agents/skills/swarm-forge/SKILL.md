---
name: swarm-forge
description: >-
  Coordinates multi-agent AI swarms using Uncle Bob's SwarmForge architecture.
  Triggers automatically when the user says "use swarm forge", "swarm forge",
  or asks to coordinate agents with SwarmForge. Presents an interactive questionnaire
  to select the workflow mode (two-pack, four-pack, six-pack, lieutenant, project-manager)
  and enforces TDD, clean architecture, CRAP <= 10, DRY, and durable git handoffs.
---

# SwarmForge: Multi-Agent Orchestration Skill

SwarmForge coordinates specialized AI agents collaborating in structured pipelines through git worktrees and durable handoffs, adhering to Uncle Bob's engineering constitution and clean architecture principles.

---

## 1. Activation & Interactive Questionnaire

When the user says **"use swarm forge"** (or indicates a desire to use SwarmForge), immediately activate this workflow and ask the following guided questions before starting execution:

### Question 1: Workflow Mode Selection
Ask the user to choose the operating mode:
- **1. `two-pack` (Rapid Delivery)**: `coder` → `cleaner`
  - *Best for*: Quick features, maintenance, small backend/frontend slices. No Gherkin overhead.
- **2. `four-pack` (Specification-Driven)**: `specifier` → `coder` → `refactorer` → `architect`
  - *Best for*: Features requiring formal Gherkin acceptance criteria, TDD, refactoring, and architectural boundary review.
- **3. `six-pack` (Enterprise Quality Pipeline)**: `specifier` → `coder` → `cleaner` → `architect` → `hardender` → `QA`
  - *Best for*: Critical, large-scale systems requiring mutation hardening and independent UI/E2E verification.
- **4. `lieutenant` (Concierge & Card Dispatcher)**:
  - *Best for*: Managing multiple parallel tasks using route-based cards:
    - `utility` route: `coder` → `cleaner` → Done
    - `component` route: `specifier` → `coder` → `cleaner` → `architect` → `hardender` → Done
    - `QA` route: `specifier` → `coder` → `cleaner` → `architect` → `hardender` → `QA` → Done
    - `review` route: `cleaner` → `architect` → `hardender` → `QA` → Done
- **5. `project-manager` (Multi-Project Forge)**:
  - *Best for*: Multi-repository or multi-project supervision with selectable pack templates.

### Question 2: Task Intent & Scope
- What is the primary problem, feature, or project to build?
- What are the core user stories and deliverables?

### Question 3: Technical Stack & UI Preferences
- Desired language, framework, or vanilla implementation?
- Any design system, styling requirements, or MCP integrations (e.g. Stitch MCP)?

### Question 4: Quality & Testing Gates
- Desired test strategy (Unit tests, Gherkin acceptance tests, property tests, E2E QA)?
- Deployment target (e.g., GitHub Pages, Vercel, Docker, staging)?

---

## 2. The SwarmForge Constitution & Engineering Law

Every role must adhere strictly to the shared SwarmForge constitution:

### Test-Driven Development (TDD)
1. Write focused tests first that express the requested observable behavior and fail for a plausible wrong implementation.
2. Write only enough production code to make the tests pass.
3. Keep tests close to behavior.

### Clean Architecture & UI/Core Separation
- High-level policy must never depend on IO, UI, database, or device details.
- Adapters depend inward on domain entities.
- The UI asks the domain for facts; the UI must never reimplement a domain business rule.

### CRAP Score $\le 10$ & DRY Compliance
- Cyclomatic complexity and test coverage must keep CRAP scores at or below 10 for all touched functions.
- Functions over 10 must split into single-responsibility helpers.
- Meaningful duplication must be eliminated across modules.

### Durable Git Handoffs
Every step transition between roles produces a committed state and a structured handoff:
```text
type: git_handoff
to: <next-role>
priority: <NN>
task: <short-stable-task-name>
commit: <git-sha>
```
