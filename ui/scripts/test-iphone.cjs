const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { mkdtempSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const screenshots = mkdtempSync(join(tmpdir(), "flints-iphone-check-"));
const baseURL = "http://127.0.0.1:4175";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4175",
    "--strictPort",
  ],
  { stdio: "ignore" },
);
let serverError;
server.on("error", (error) => {
  serverError = error;
});
let browser;
async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null)
      throw new Error(
        "The preview server exited; check whether port 4175 is already in use.",
      );
    try {
      if ((await fetch(baseURL)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("The iPhone test preview server did not start.");
}
(async () => {
  await waitForServer();
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    headless: true,
  });
  const errors = [];
  const checks = [];
  for (const width of [320, 375, 390, 430, 844]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 844 ? 390 : 844 },
      isMobile: true,
      hasTouch: true,
    });
    page.on("pageerror", (e) => errors.push(e.message));
    const networkCalls = [];
    page.on("request", (request) => {
      if (/\/api\/v1\//.test(request.url())) networkCalls.push(request.url());
    });
    const check = async (name) => {
      await page.waitForTimeout(450);
      const info = await page.evaluate(() => ({
        w: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      assert.ok(
        info.scroll <= info.w,
        `${width} ${name} overflows: ${JSON.stringify(info)}`,
      );
      checks.push(`${width}:${name}`);
      console.log(`${width}:${name}`);
    };
    await page.goto("http://127.0.0.1:4175/");
    await page.getByRole("heading", { name: "Welcome to Flints" }).waitFor();
    await check("welcome");
    await page
      .getByRole("button", { name: "Create Profile", exact: true })
      .click();
    await check("signup");
    await page.goto("http://127.0.0.1:4175/");
    await page
      .getByRole("button", { name: "Open Profile", exact: true })
      .click();
    await check("login");
    await page.goto(baseURL);
    await page
      .getByRole("button", { name: "Continue Anonymously", exact: true })
      .click();
    await page.getByRole("button", { name: "Home", exact: true }).waitFor();
    for (const [label, name] of [
      ["Home", "home"],
      ["Flints", "companion"],
      ["Paths", "paths"],
      ["Circles", "circles"],
      ["Profile", "profile"],
    ]) {
      await page
        .locator(".member-nav")
        .getByRole("button", { name: label, exact: true })
        .click();
      await check(name);
      if (name === "paths") {
        await page
          .getByRole("button", { name: "Start Journey", exact: true })
          .first()
          .click();
        await page
          .getByRole("heading", { name: "Managing Anxiety", exact: true })
          .waitFor();
        await check("path-detail");
        await page.locator(".app-main button").first().click();
      }
      if (name === "circles") {
        await page.getByRole("button", { name: /Anxiety Support/ }).click();
        await page
          .getByRole("heading", { name: "Anxiety Support", exact: true })
          .waitFor();
        await check("circle-detail");
        await page.locator(".app-main button").first().click();
      }
      if (name === "companion") {
        await page.evaluate(() => {
          document.documentElement.style.setProperty("--safe-top", "59px");
          document.documentElement.style.setProperty("--safe-bottom", "34px");
        });
        const safeNav = await page.locator(".member-nav").boundingBox();
        assert.ok(safeNav.height >= 106, "home indicator inset missing");
        await page.evaluate(() => {
          document.documentElement.style.removeProperty("--safe-top");
          document.documentElement.style.removeProperty("--safe-bottom");
        });
        const originalSize = page.viewportSize();
        await page.setViewportSize({
          width,
          height: Math.min(430, originalSize.height),
        });
        await page.waitForTimeout(100);
        const reducedComposer = await page
          .locator(".companion-composer")
          .boundingBox();
        const reducedNav = await page.locator(".member-nav").boundingBox();
        assert.ok(
          reducedComposer.y >= 0 &&
            reducedComposer.y + reducedComposer.height <= reducedNav.y + 2,
          "composer overlaps navigation in reduced keyboard viewport",
        );
        await page.setViewportSize(originalSize);
        await page.waitForTimeout(100);
        const input = page.getByPlaceholder("AI chat is disconnected");
        assert.equal(await input.isDisabled(), true);
        const composer = await page
          .locator(".companion-composer")
          .boundingBox();
        const nav = await page.locator(".member-nav").boundingBox();
        assert.ok(
          composer.y + composer.height <= nav.y + 2,
          "composer overlaps tabs",
        );
      }
      if (name === "profile") {
        await page
          .getByRole("button", { name: "View Plan", exact: true })
          .click();
        await check("safety");
        await page
          .locator(".safety-overlay")
          .click({ position: { x: 2, y: 2 } });
      }
      if (width === 390)
        await page.screenshot({ path: join(screenshots, `${name}.png`) });
    }
    await page
      .getByRole("button", { name: "Device Tools", exact: true })
      .click();
    await check("admin-dashboard");
    for (const label of [
      "User Management",
      "Content Moderation",
      "System Monitoring",
      "Circle Management",
      "Path Management",
      "Safety & Crisis",
      "Analytics",
    ]) {
      await page.locator(".admin-mobile-header button").click();
      await page
        .locator(".admin-mobile-menu")
        .getByRole("button", { name: label, exact: true })
        .click();
      await check(label);
      if (["Circle Management", "Path Management"].includes(label)) {
        const action =
          label === "Circle Management"
            ? "Create New Circle"
            : "Create New Path";
        await page.getByRole("button", { name: action, exact: true }).click();
        const originalSize = page.viewportSize();
        await page.setViewportSize({ width, height: 430 });
        await page.evaluate(() => {
          document.documentElement.style.setProperty("--safe-top", "59px");
          document.documentElement.style.setProperty("--safe-bottom", "34px");
        });
        await check(action);
        const panel = await page
          .locator(".admin-dialog-overlay > div")
          .boundingBox();
        assert.ok(
          panel.y >= 59 && panel.y + panel.height <= 397,
          "admin dialog intrudes into safe area",
        );
        await page
          .locator(".admin-dialog-overlay > div > div")
          .first()
          .getByRole("button")
          .first()
          .click();
        await page.evaluate(() => {
          document.documentElement.style.removeProperty("--safe-top");
          document.documentElement.style.removeProperty("--safe-bottom");
        });
        await page.setViewportSize(originalSize);
      }
    }
    assert.deepEqual(networkCalls, []);
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      passed: true,
      checks: checks.length,
      widths: [320, 375, 390, 430, 844],
      errors,
      screenshots,
    }),
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server.kill();
  });
