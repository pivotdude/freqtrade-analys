import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { CliUsageError, resolveRuntimeConfig } from "./config";

describe("resolveRuntimeConfig", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    for (const key of [
      "DB_PATH",
      "INITIAL_CAPITAL",
      "REPORT_LANG",
    ]) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it("uses auto capital baseline by default", () => {
    const config = resolveRuntimeConfig([]);

    expect(config.capitalMode).toBe("auto");
    expect(config.initialCapital).toBeUndefined();
  });

  it("does not support --format option", () => {
    expect(() => resolveRuntimeConfig(["--format", "md"])).toThrow(
      new CliUsageError("Unknown option: --format"),
    );
  });

  it("treats --out as unknown option", () => {
    expect(() => resolveRuntimeConfig(["--out", "report.md"])).toThrow(
      new CliUsageError("Unknown option: --out"),
    );
  });

  it("parses manual capital baseline from CLI", () => {
    const config = resolveRuntimeConfig(["--capital", "12500"]);

    expect(config.capitalMode).toBe("manual");
    expect(config.initialCapital).toBe(12500);
  });

  it("parses auto capital baseline from CLI", () => {
    const config = resolveRuntimeConfig(["--capital", "auto"]);

    expect(config.capitalMode).toBe("auto");
    expect(config.initialCapital).toBeUndefined();
  });

  it("allows explicitly disabling capital metrics", () => {
    const config = resolveRuntimeConfig(["--capital", "12500", "--no-capital"]);

    expect(config.capitalMode).toBe("none");
    expect(config.initialCapital).toBeUndefined();
  });

  it("throws a CLI usage error for unknown arguments", () => {
    expect(() => resolveRuntimeConfig(["-р"])).toThrow(
      new CliUsageError("Unknown option: -р"),
    );
  });

  it("throws a CLI usage error for invalid --capital", () => {
    expect(() => resolveRuntimeConfig(["--capital", "0"])).toThrow(
      new CliUsageError(
        'Invalid value for --capital: 0. Use a positive number or "auto".',
      ),
    );
  });

  it("throws a CLI usage error for invalid --lang", () => {
    expect(() => resolveRuntimeConfig(["--lang", "de"])).toThrow(
      new CliUsageError("Invalid value for --lang: de. Use one of: en, ru."),
    );
  });

  it("accepts --lang values case-insensitively", () => {
    expect(resolveRuntimeConfig(["--lang", "EN"]).reportLanguage).toBe("en");
    expect(resolveRuntimeConfig(["--lang", "Ru"]).reportLanguage).toBe("ru");
  });

  it("throws a CLI usage error for empty string runtime values", () => {
    expect(() => resolveRuntimeConfig(["--db", "   "])).toThrow(
      new CliUsageError("Invalid value for --db: value must not be empty."),
    );
  });

  it("fails fast for invalid runtime environment values", () => {
    process.env.REPORT_LANG = "de";
    expect(() => resolveRuntimeConfig([])).toThrow(
      new CliUsageError("Invalid value for REPORT_LANG: de. Use one of: en, ru."),
    );

    delete process.env.REPORT_LANG;
    process.env.DB_PATH = "   ";
    expect(() => resolveRuntimeConfig([])).toThrow(
      new CliUsageError("Invalid value for DB_PATH: value must not be empty."),
    );
  });

  it("throws a CLI usage error when flag values are missing", () => {
    expect(() => resolveRuntimeConfig(["--db"])).toThrow(
      new CliUsageError("Missing value for --db"),
    );
    expect(() => resolveRuntimeConfig(["--capital"])).toThrow(
      new CliUsageError("Missing value for --capital"),
    );
  });
});
