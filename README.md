# freqtrade-analysis

`freqtrade-analysis` is a Bun + TypeScript CLI that reads a Freqtrade SQLite database and prints a trading performance report to `stdout`.

It is designed for human-readable Markdown reporting while staying scriptable and CI-friendly.

## Why this project

- Analyze closed trades quickly without launching a full dashboard.
- Keep report generation scriptable and CI-friendly.
- Export results in presentation-friendly Markdown.

## Features

- Closed-trade analysis from Freqtrade SQLite data.
- Output format: `md` (Markdown).
- Core metrics: win rate, realized profit, pair-level performance.
- Risk/return metrics: drawdown, Sharpe, Sortino, slippage (when data is available).
- English and Russian report localization.

## Requirements

- [Bun](https://bun.com) 1.3+
- [npm](https://www.npmjs.com/) (for global install from registry)
- A Freqtrade SQLite database (`tradesv3.sqlite` by default)

## Quick start

```bash
# 1) Install dependencies
bun install

# 2) Prepare env config
cp .env.example .env

# 3) Run analyzer (Markdown output by default)
bun run start
```

## Global install (npm)

```bash
npm i -g freqtrade-analysis
freqtrade-analysis --help
```

This package uses Bun at runtime, so Bun must be installed on the machine where you run the CLI.

## CLI usage

```bash
freqtrade-analysis [options]
```

```bash
# local development run
bun run start -- [options]
```

### Options

- `--db <path>`: path to SQLite database (default: `tradesv3.sqlite`)
- `--capital <number|auto>`: capital baseline for percent/risk metrics (default: `auto`)
- `--no-capital`: disable capital-based metrics
- `--lang <en|ru>`: report language (default: `en`)
- `--help`, `-h`: print help

Configuration priority: **CLI > `.env` > defaults**.

## Configuration (`.env`)

`.env.example`:

```env
DB_PATH=tradesv3.sqlite
INITIAL_CAPITAL=9900
REPORT_LANG=en
```

Variables:

- `DB_PATH`: path to SQLite database file
- `INITIAL_CAPITAL`: positive number or `auto`
- `REPORT_LANG`: `en` or `ru`

## Examples

```bash
# Markdown report (default output)
bun run start

# Russian Markdown report
bun run start -- --lang ru
```

## Output contract

The tool prints only the final report to `stdout`.
Diagnostics and errors are written to `stderr`, making `stdout` safe for piping/parsing.

## Project structure

```text
src/
├── analyzers/          # Trade + metric analysis
├── formatters/         # Date/number formatting helpers
├── generators/         # Report generation orchestration
├── renderers/          # Markdown renderer
├── services/           # Database access
└── types/              # Shared TypeScript types
```

For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development

Core commands:

```bash
bun run start
bun run dev:hot
bun run test
bunx tsc --noEmit
bun run build
bun run build:exe
```

Suggested local validation before opening a PR:

```bash
bun install
bunx tsc --noEmit
bun run test
bun run build
bun run build:exe
```

Before publishing a public release/tag, run the full local validation cycle:

```bash
bun run validate:local-release
```

## Metrics limitations

- `--capital auto` estimates capital from max observed concurrent stake exposure.
- Drawdown is based on **closed trades**, not a full account equity time series.
- Sharpe/Sortino are calculated from per-trade returns, not time-normalized returns.
- Slippage requires sufficiently complete order fields in source data.

## Public release & data hygiene

Before publishing a release/tag, run:

```bash
bun run validate:local-release
```

This command runs type checks, tests, build targets, and private artifact audit in one pass.
The audit stage checks tracked files, git history paths, and required `.gitignore` rules.

Never commit private trading artifacts such as:

- `*.sqlite`
- `*.sqlite-shm`
- `*.sqlite-wal`

If they were committed previously, untrack them while keeping local copies:

```bash
git rm --cached tradesv3.sqlite tradesv3.sqlite-shm tradesv3.sqlite-wal
```

## CI / release notes

- CI workflow: `.github/workflows/ci.yml`
- CI runs on pull requests, pushes to `main`, and version tags (`v*`)
- CI can be started manually via `workflow_dispatch` for an existing ref (for example `v1.0.0`)
- Release workflow publishes standalone binaries for major OS targets
- npm publish workflow: `.github/workflows/npm-publish.yml`
- npm publish is triggered by GitHub Release `published` event and validates `release.tag_name == v<package.json.version>`
- npm publish uses `npm publish --tag latest --access public` (set `NPM_TOKEN` in GitHub repository secrets)

### npm release flow

1. Bump `package.json.version` (for example, `1.0.1`).
2. Commit and push changes to GitHub.
3. Create and push Git tag `v<version>` (for example, `v1.0.1`).
4. Publish a GitHub Release from that tag.
5. GitHub Actions publishes the package to npm with `latest` tag.

## License

[MIT](./LICENSE)
