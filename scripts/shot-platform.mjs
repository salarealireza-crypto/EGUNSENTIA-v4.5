import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const session = {
  session: {
    id: "sess-shot",
    expiresAt: "2027-01-01T00:00:00.000Z",
    token: "shot-token",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    userId: "shot-user",
    ipAddress: "127.0.0.1",
    userAgent: "playwright",
  },
  user: {
    id: "shot-user",
    name: "Christian Red",
    email: "red@dome.test",
    emailVerified: true,
    image: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
};

mkdirSync("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
await page.route("**/api/auth/**", async (route) => {
  const url = route.request().url();
  if (url.includes("get-session")) {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(session) });
    return;
  }
  await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
});

async function shoot(name, width, height, wing) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  const begin = page.getByRole("button", { name: /Begin Ironday|Continue/ });
  if (await begin.count()) {
    await begin.first().click();
    await page.waitForTimeout(600);
  }
  const platform = page.getByRole("button", { name: "Platform" });
  if (await platform.count()) {
    await platform.first().click();
    await page.waitForTimeout(400);
  }
  await page.getByRole("heading", { name: "The Cutaway" }).waitFor({ timeout: 15000 });
  if (wing) {
    await page.getByRole("button", { name: /The Works/ }).click();
    await page.getByRole("heading", { name: "The Works" }).waitFor({ timeout: 8000 });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  await page.screenshot({ path: `/workspace/screenshots/${name}.png`, fullPage: false });
  console.log(name, "overflow", overflow, "url", page.url());
}

try {
  await shoot("home-1280", 1280, 800, false);
  await shoot("wing-1280", 1280, 800, true);
  await shoot("home-390", 390, 844, false);
  await shoot("wing-390", 390, 844, true);
} catch (err) {
  await page.screenshot({ path: "/workspace/screenshots/debug.png", fullPage: true }).catch(() => {});
  console.error("SHOT FAIL", err);
  console.log("BODY", (await page.locator("body").innerText().catch(() => "")).slice(0, 800));
  process.exitCode = 1;
}
console.log("console errors", errors.slice(0, 12));
await browser.close();
