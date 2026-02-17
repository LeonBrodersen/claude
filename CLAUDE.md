# CLAUDE.md — Project Guide for AI Assistants

## Project Overview

This repository (`LeonBrodersen/claude`) is currently in its initial setup phase. No application code, build configuration, or test infrastructure has been added yet.

**Status:** Bootstrapping — the project structure and tooling are yet to be established.

## Repository Structure

```
/
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git version control
```

> As the project grows, update this section to reflect the full directory layout, key modules, and entry points.

## Development Setup

### Prerequisites

_To be defined._ Common prerequisites for new projects include:

- A language runtime (e.g., Node.js, Python, Go, Rust)
- A package manager (e.g., npm, yarn, pnpm, pip, cargo)
- Any system-level dependencies

### Installation

```sh
# Clone the repository
git clone <repo-url>
cd claude

# Install dependencies (update once a package manager is chosen)
# npm install / pip install -r requirements.txt / cargo build
```

## Build & Run

_No build system is configured yet._ Update this section once tooling is in place.

```sh
# Build (example placeholder)
# npm run build

# Run (example placeholder)
# npm start

# Lint (example placeholder)
# npm run lint

# Test (example placeholder)
# npm test
```

## Testing

_No test framework is configured yet._ When tests are added, document:

- Test framework and runner (e.g., Jest, pytest, cargo test)
- How to run all tests: `<command>`
- How to run a single test file: `<command> <path>`
- Test file naming conventions (e.g., `*.test.ts`, `test_*.py`)
- Test directory structure

## Code Conventions

_To be defined as the project takes shape._ When establishing conventions, document:

- **Language & style:** Coding style, formatter config (Prettier, Black, rustfmt)
- **Linting:** Linter and rule set (ESLint, Ruff, Clippy)
- **Naming:** File naming, variable/function naming (camelCase, snake_case)
- **Imports:** Import ordering and grouping rules
- **Types:** Type strictness level (strict TypeScript, type hints in Python)
- **Error handling:** Preferred patterns (Result types, exceptions, error codes)

## Git Workflow

- **Branch naming:** Feature branches use the pattern `claude/<description>-<id>`
- **Commits:** Use clear, descriptive commit messages
- **PR process:** _To be defined_
- **CI/CD:** _No pipelines configured yet_

## Architecture

_To be documented once the project architecture is established._ Sections to include:

- High-level system design
- Key modules and their responsibilities
- Data flow and state management
- External service integrations
- Database schema (if applicable)

## Key Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guide (this file) |

> Expand this table as the project grows to include config files, entry points, and key modules.

## AI Assistant Guidelines

When working in this repository, AI assistants should:

1. **Read before writing** — Always read existing files before proposing changes
2. **Follow existing patterns** — Match the style and conventions already in use
3. **Keep changes minimal** — Only modify what is necessary for the task at hand
4. **Update this file** — When adding new tooling, modules, or conventions, update CLAUDE.md to reflect the current state
5. **Run checks before committing** — Once linting and testing are configured, always run them before committing
6. **Don't over-engineer** — Prefer simple, direct solutions over abstractions for hypothetical future needs
