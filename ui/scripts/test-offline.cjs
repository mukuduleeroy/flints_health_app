const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const base = "http://127.0.0.1:4176";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "4176",
    "--strictPort",
  ],
  { stdio: "ignore" },
);
let browser;
(async () => {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null)
      throw new Error("Offline test server exited. Check port 4176.");
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const failures = [];
  const remote = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1") remote.push(url.origin);
  });
  await page.goto(base);
  const results = await page.evaluate(async () => {
    const { apiClient: api } = await import("/src/api/client.ts");
    const { LocalClient } = await import("/src/data/local-store.ts");
    const transport = new LocalClient();
    const checks = [];
    const check = (condition, label) => {
      if (!condition) throw new Error(label);
      checks.push(label);
    };
    const rejected = async (action, label) => {
      let failed = false;
      try {
        await action();
      } catch {
        failed = true;
      }
      check(failed, label);
    };
    await api.createAnonymousSession();
    const anonymous = api.getToken();
    check(
      (await api.getProfile()).total_mood_entries === 0,
      "new profiles have no fabricated history",
    );
    await api.logMood(4, [], [], "A real local journal note");
    check(
      (await api.getMoodHistory(7)).entries[0].notes ===
        "A real local journal note",
      "mood and journal saved",
    );
    await rejected(() => api.logMood(9, []), "invalid moods rejected");
    await api.updateSafetyPlan({
      internal_coping: ["Take a quiet walk"],
      safe_environment: "My own note",
    });
    check(
      (await api.getSafetyPlan()).internal_coping[0] === "Take a quiet walk",
      "safety plan saves with PUT",
    );
    const created = await api.createCircle(
      "My Topic",
      "personal",
      "Private notes",
    );
    await api.joinCircle(created.id);
    check(
      (await api.getCircle(created.id)).member_count === 1,
      "circle membership is local",
    );
    const post = await api.createPost(created.id, "A private local post");
    await api.replyToPost(post.id, "My private reply", true);
    check(
      (await api.getCirclePosts(created.id))[0].replies[0].author_name ===
        "Anonymous",
      "replies persist without fabricated authors",
    );
    await api.addReaction(post.id);
    check(
      (await api.getCirclePosts(created.id))[0].reaction_count === 1,
      "reaction saved",
    );
    await api.removeReaction(post.id);
    check(
      (await api.getCirclePosts(created.id))[0].reaction_count === 0,
      "reaction removed",
    );
    await api.flagPost(post.id, "My flag");
    check((await api.adminGetFlaggedPosts()).length === 1, "local flag queue");
    const paths = await api.getPaths();
    check(
      paths.length === 3 && paths[0].step_count === paths[0].steps.length,
      "real bundled path content",
    );
    await api.enrollInPath(paths[0].id);
    await api.updatePathProgress(paths[0].id, 1);
    check(
      (await api.getPathDetail(paths[0].id)).user_progress
        .current_step_index === 1,
      "journey progress persisted",
    );
    check(
      (await api.getDailyVerse("sad")).reference.length > 0,
      "verses work offline",
    );
    const profile = await api.getProfile();
    check(
      profile.total_mood_entries === 1 && profile.total_conversations === 0,
      "profile metrics use actual local data",
    );
    await api.logout();
    await api.register("FlintsLocal", "", "local-test-password");
    const registered = api.getToken();
    check(
      (await api.getMoodHistory()).entries.length === 0,
      "profiles have separate data",
    );
    const stored = localStorage.getItem("flints.device.v1");
    check(
      !stored.includes("local-test-password"),
      "password not stored in plaintext",
    );
    await api.logout();
    await rejected(
      () => api.login("FlintsLocal", "wrong-password"),
      "wrong device password rejected",
    );
    await api.login("FlintsLocal", "local-test-password");
    check(api.getToken() === registered, "local password login");
    await rejected(
      () => api.register("flintslocal", "", "different-password"),
      "case-insensitive duplicate profile rejected",
    );
    api.setToken(anonymous);
    check(
      (await api.getMoodHistory()).entries.length === 1,
      "original profile restored",
    );
    await api.adminDeleteCircle(String(created.id));
    await rejected(() => api.getCircle(created.id), "local circle deletion");
    const a = await api.adminGetAnalytics();
    check(a.users.total === 2, "on-device statistics count actual profiles");
    await rejected(
      () => api.adminUpdateEscalationStatus(profile.id, "escalated"),
      "remote escalation cannot report false success",
    );
    // Reload and app boot will reopen this same saved profile.
    return { checks, token: anonymous, registered };
  });
  await page.reload();
  await page.getByRole("button", { name: "Home", exact: true }).waitFor();
  await page.getByText("A real local journal note", { exact: true }).waitFor();
  await page
    .locator(".member-nav")
    .getByRole("button", { name: "Flints", exact: true })
    .click();
  await page.getByRole("heading", { name: "Your companion space" }).waitFor();
  assert.equal(
    await page
      .getByLabel("AI chat is disconnected", { exact: true })
      .isDisabled(),
    true,
  );
  await page.reload();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("flints_session")),
    results.token,
  );
  assert.deepEqual(remote, []);
  assert.deepEqual(failures, []);
  console.log(
    JSON.stringify({
      passed: true,
      dataChecks: results.checks.length,
      reload: true,
      aiDisconnected: true,
      remoteRequests: remote,
      errors: failures,
    }),
  );
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server.kill();
  });
