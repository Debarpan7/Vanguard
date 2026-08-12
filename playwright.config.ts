import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // CI: two retries. Local: one — the first navigation against a freshly
  // started `next start` occasionally aborts with ERR_ABORTED (cold-start);
  // the retry runs against the warm server and passes.
  retries: process.env.CI ? 2 : 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      // Use the system-installed Chrome (channel) rather than downloading
      // Playwright's own Chromium build.
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    // Serve a production build: stable, no per-route dev compile, matches
    // what the site behaves like when deployed.
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
