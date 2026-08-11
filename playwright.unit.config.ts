import { defineConfig } from "@playwright/test";

/**
 * Unit-test config for Seam 2 — direct tests over the fact base
 * (provenance: each series traces to its public source with the correct
 * value and year coverage). These are pure data tests: no browser, no
 * web server. Kept separate from the E2E config so the E2E suite boots
 * the production server only for browser tests.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
});
