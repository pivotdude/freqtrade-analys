---
name: freqtrade-analysis
description: Analyze Freqtrade trading performance from a SQLite database using the freqtrade-analysis CLI. Use for strategy evaluation, result debugging, performance review, and strategy comparison.
argument-hint: [--db <path>] [--lang en|ru] [--capital <number|auto>] [--no-capital]
allowed-tools: Bash(freqtrade-analysis:*) Read
---

# freqtrad

Use this skill when working with Freqtrade trade-result analysis.

## Core rule

Do **not** read raw trades and do **not** compute trading metrics manually when this CLI can provide them.

Always use the analyzer:

```bash
freqtrade-analysis [options]
```

## Database discovery

Assume the default Freqtrade database path is:

```bash
user_data/tradesv3.sqlite
```

If it is not present, try in this order:

1. `./user_data/tradesv3.sqlite`
2. `./tradesv3.sqlite`

If still not found, ask the user for the path.

If the database path is known, always pass it explicitly with `--db`.

## Supported options

### Database

```bash
--db <path>
```

### Capital

```bash
--capital <number|auto>
--no-capital
```

- `auto` estimates capital from trade data
- `--no-capital` disables capital-based metrics

### Language

```bash
--lang <en|ru>
```

Default:

```bash
en
```

### Help

```bash
--help
-h
```

## Preferred execution

Preferred form when the DB path is known:

```bash
freqtrade-analysis --db user_data/tradesv3.sqlite
```

If invoked with arguments, respect them:

$ARGUMENTS

## Output contract

The tool returns a Markdown report on stdout. Interpret the report instead of repeating it verbatim.

Example output shape:

```md
# Summary
- Profit: 12%
- Win rate: 54%

# Risk
- Drawdown: 8%
```

## Interpretation rules

When summarizing results:

- High win rate does not automatically mean the strategy is good
- Profit factor below `1.2` is weak
- Drawdown above `20%` is dangerous
- Low exposure can indicate underused capital
- Prefer discussing profit, drawdown, exposure, consistency, and pair concentration together

## Execution flow

1. Locate the database
2. Run the CLI with an explicit `--db` when possible
3. Read the Markdown output
4. Interpret the result
5. For comparisons, run the CLI separately for each database or option set

## Strategy comparison

Run multiple analyses when comparing strategies:

```bash
freqtrade-analysis --db A.sqlite
freqtrade-analysis --db B.sqlite
```

## Safety

- Read-only workflow
- Does not execute trades
- Does not modify the database

## Architecture role

```text
SQLite -> CLI -> Markdown -> reasoning
```

The CLI is the analytics layer that compresses raw trades into reasoning-ready metrics.
