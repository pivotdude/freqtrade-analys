# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project changelog.
- Added `CONTRIBUTING.md` with contribution workflow and PR checklist.
- Added `SECURITY.md` with vulnerability reporting guidance.
- Added `validate:local-release` script to run full pre-release local validation (typecheck, tests, build, executable build, and private artifact audit).
- Added npm global CLI entrypoint (`freqtrade-analysis`) via `bin/freqtrade-analysis.js`.
- Added GitHub Actions workflow `.github/workflows/npm-publish.yml` to publish npm package on release with `vX.Y.Z` vs `package.json.version` validation.

### Changed

- Updated `package.json` for public npm publication (`version`, `publishConfig.access=public`, `files`, `bin`, Bun engine requirement).
- Updated `.gitignore` to allow tracking npm CLI entrypoint `bin/freqtrade-analysis.js`.
- Updated CLI help usage to show global command form: `freqtrade-analysis [options]`.
- Updated README with npm global install and npm release automation notes.
