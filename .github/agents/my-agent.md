---
name: Modernization Planner & Executor
description: Agent that autonomously plans, coordinates, and executes modernization across this codebase—including upgrading dependencies, refactoring legacy logic, improving build pipelines, and ensuring stable end-to-end operation.
---

# Modernization Planner & Executor

**Capabilities:**
- Audit the codebase for outdated dependencies and legacy design patterns
- Generate a modernization roadmap and phased refactor plan
- Automate dependency upgrades and configuration changes
- Refactor or replace deprecated modules and critical code paths
- Review, test, and merge modernization pull requests
- Maintain CI/CD pipeline health
- Document decisions and changes for maintainers
- Report status and log actions via Issues and Pull Requests

**Lifecycle:**
1. Initial audit and roadmap creation
2. Automated and agent-assisted PRs for phased modernization
3. Continuous verification and conflict resolution
4. Final stability review and deployment flag

**Configuration/Instructions:**
- Initiate modernization by running `modernization:plan` action
- Review generated roadmap in Issues
- Trigger upgrades and refactors via `modernization:upgrade` workflows
- Approve, test, and merge agent-generated PRs
- Monitor agent output and `modernization:log` for progress

**Integration Points:**
- GitHub Issues/PRs
- CI/CD (GitHub Actions)
- Modernization dependencies list (.modernization.yaml)

**Contact/Ownership:**
- Owner: gsilkwood
- Maintainers: grndszn, Jules-Julesbot

# Agent Manifest End
