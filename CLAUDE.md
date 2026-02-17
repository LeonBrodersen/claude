# CLAUDE.md — Project Guide for AI Assistants

## Project Overview

**YouTube Shorts Dashboard** — A browser-based analytics dashboard for comparing YouTube Shorts performance across two channels. Built with vanilla HTML, CSS, and JavaScript (no build tools or frameworks). Uses Chart.js for data visualization.

**Status:** MVP with demo data. Ready for YouTube Data API v3 integration.

## Repository Structure

```
/
├── CLAUDE.md              # This file — AI assistant guide
├── index.html             # Main SPA entry point
├── css/
│   └── style.css          # Dark-themed dashboard styles
└── js/
    ├── data.js            # Data layer: demo data generation, formatting helpers, localStorage
    ├── charts.js          # Chart.js configuration and rendering (line, bar, doughnut)
    └── app.js             # Main app logic: navigation, view rendering, settings
```

## Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Any static file server for local development (optional — `index.html` can be opened directly)

### Running Locally

```sh
# Option 1: Open directly in browser
open index.html

# Option 2: Use any static server
python3 -m http.server 8000
# then visit http://localhost:8000
```

No install step, no build step — all dependencies (Chart.js) are loaded via CDN.

## Architecture

### Single-Page Application

The app is a client-side SPA with four views, switched via JS without page reloads:

| View | Purpose |
|------|---------|
| **Gesamtübersicht** | Combined stats and comparison charts for both channels |
| **Kanal 1** | Individual Shorts analytics for channel 1 |
| **Kanal 2** | Individual Shorts analytics for channel 2 |
| **Einstellungen** | Channel name, ID, and API key configuration |

### Module Responsibilities

- **`data.js` (`DashboardData`)** — IIFE module exposing: `generateDemoData()`, format helpers (`formatNumber`, `formatPercent`, `formatDate`), and localStorage settings persistence (`loadSettings`, `saveSettings`, `clearSettings`)
- **`charts.js` (`DashboardCharts`)** — IIFE module that manages Chart.js instances. Exposes `renderOverview()`, `renderChannel()`, and `destroyAll()`. Handles lifecycle (create/destroy) to prevent canvas leaks
- **`app.js`** — Self-executing IIFE that wires up DOM events, navigation, and view rendering. Coordinates `DashboardData` and `DashboardCharts`

### Data Flow

1. `app.js` calls `DashboardData.generateDemoData(days)` on load and on date-range/refresh
2. Demo data is passed to view renderers which populate DOM elements and call chart renderers
3. Settings are persisted in `localStorage` under key `yt-shorts-settings`
4. Channel names from settings override demo defaults

### External Dependencies

| Dependency | Version | Loaded via |
|-----------|---------|-----------|
| Chart.js | 4.4.7 | CDN (`cdn.jsdelivr.net`) |

## Code Conventions

- **Language:** Vanilla JavaScript (ES6+), no TypeScript, no framework
- **Module pattern:** IIFE with revealing module pattern (`const Module = (() => { ... return { ... }; })()`)
- **Naming:** camelCase for variables/functions, PascalCase for module names (`DashboardData`, `DashboardCharts`)
- **CSS:** BEM-like class naming, CSS custom properties in `:root` for theming
- **HTML IDs:** kebab-case with channel prefix pattern (`ch1-views`, `ch2-likes`, `total-views`)
- **No build tools** — plain files, CDN imports, no bundler

## Key Files Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guide (this file) |
| `index.html` | SPA entry point — all HTML structure and views |
| `css/style.css` | Complete styling with dark theme, responsive layout |
| `js/data.js` | Data generation, formatting, settings persistence |
| `js/charts.js` | Chart.js wrapper — all chart creation and lifecycle |
| `js/app.js` | App controller — navigation, rendering, event wiring |

## Git Workflow

- **Branch naming:** Feature branches use the pattern `claude/<description>-<id>`
- **Commits:** Use clear, descriptive commit messages
- **PR process:** _To be defined_
- **CI/CD:** _No pipelines configured yet_

## Future Work

- **YouTube Data API v3 integration** — Replace `generateDemoData()` with real API calls using the configured API key and channel IDs
- **Testing** — No test framework configured yet
- **Linting** — No linter configured yet

## AI Assistant Guidelines

When working in this repository, AI assistants should:

1. **Read before writing** — Always read existing files before proposing changes
2. **Follow existing patterns** — Use the IIFE module pattern, match naming conventions
3. **Keep changes minimal** — Only modify what is necessary for the task at hand
4. **Update this file** — When adding new modules or conventions, update CLAUDE.md
5. **Preserve the dark theme** — Use CSS custom properties from `:root` for new UI elements
6. **No build tools** — Keep the project dependency-free (CDN-only for libraries)
7. **Don't over-engineer** — Prefer simple, direct solutions over abstractions
