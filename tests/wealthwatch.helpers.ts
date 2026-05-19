import { expect } from '@playwright/test';
import type { Page, Request } from '@playwright/test';

export const CREDS = {
  email: 'aws@gmail.com',
  password: '1234',
};

export function attachConsoleAndErrors(page: Page, logs: { console: string[]; errors: string[] }) {
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    logs.console.push(text);
  });

  page.on('pageerror', (err) => {
    logs.errors.push(`[pageerror] ${err.message}\n${err.stack ?? ''}`);
  });
}

export function attachNetworkLogging(page: Page, logs: { failedRequests: string[] }) {
  page.on('requestfailed', (req) => {
    const failure = req.failure();
    const entry = `[requestfailed] ${req.method()} ${req.url()} - ${failure?.errorText ?? 'unknown error'}`;
    logs.failedRequests.push(entry);
  });

  page.on('response', async (res) => {
    try {
      if (!res.ok()) {
        const req = res.request();
        const entry = `[bad response] ${req.method()} ${req.url()} -> ${res.status()} ${res.statusText()}`;
        logs.failedRequests.push(entry);
      }
    } catch {
      // ignore
    }
  });

  // Useful during debugging: capture API failures for requests to /api
  page.on('request', (req: Request) => {
    // Intentionally no-op; we rely on requestfailed/response for detail.
    void req;
  });
}

export async function safeGoto(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
}

export async function loginIfNeeded(page: Page, email: string, password: string) {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });

  // If already authenticated, protected pages might be accessible and /login might redirect.
  if (/\/dashboard|\/transactions|\/assets|\/liabilities|\/ai-advisor|\/goals|\/reports|\/settings/.test(page.url())) {
    return;
  }

  // Wait for email/password inputs to actually be present (UI may be delayed)
  // Login page might render different input markup; use role-based first, then fall back to input[type]
  const emailRole = page.getByRole('textbox', { name: /email/i }).first();
  const passwordRole = page.getByRole('textbox', { name: /password/i }).first();

  const emailFallback = page.locator('input[type="email"], input[name="email"], input[autocomplete="email"]').first();
  const passwordFallback = page.locator('input[type="password"], input[name="password"], input[autocomplete="current-password"]').first();

  const emailLocator = (await emailRole.isVisible().catch(() => false)) ? emailRole : emailFallback;
  const passwordLocator = (await passwordRole.isVisible().catch(() => false)) ? passwordRole : passwordFallback;

  await emailLocator.waitFor({ state: 'visible', timeout: 30000 });
  await passwordLocator.waitFor({ state: 'visible', timeout: 30000 });

  await emailLocator.fill(email);
  await passwordLocator.fill(password);

  // Login button might be "Sign in" (login page) or submission button.
  const submitBtn = page.getByRole('button', { name: /sign in|continue/i }).first();
  await submitBtn.click();

  // Protected redirect (best-effort; UI may error and stay on login)
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForURL(/\/dashboard/, { timeout: 30000 }).catch(() => {});

  // If still not authenticated, throw with best-effort page URL
  if (!/\/dashboard|\/transactions|\/assets|\/liabilities|\/ai-advisor|\/goals|\/reports|\/settings/.test(page.url())) {
    throw new Error(`Login did not redirect to a protected route. Current URL: ${page.url()}`);
  }
}

export async function logoutViaUI(page: Page) {
  // Open profile dropdown
  const profileButton = page.getByRole('button', { name: /open profile menu/i }).first();
  await profileButton.click();

  await page.getByRole('button', { name: /logout/i }).click();
  await page.waitForURL(/\/login/, { timeout: 20000 });
}

export async function openMobileNav(page: Page) {
  // mobile hamburger has aria-label "Open menu"
  const btn = page.getByRole('button', { name: /open menu/i }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

export async function closeMobileNav(page: Page) {
  const closeOverlay = page.getByRole('button', { name: /close navigation overlay/i }).first();
  if (await closeOverlay.isVisible().catch(() => false)) {
    await closeOverlay.click();
    return;
  }

  const closeMenu = page.getByRole('button', { name: /close menu/i }).first();
  if (await closeMenu.isVisible().catch(() => false)) {
    await closeMenu.click();
  }
}

export type ProtectedRoute = {
  path: string;
  heading: RegExp;
};

export async function navigateProtected(page: Page, routes: ProtectedRoute[]) {
  for (const r of routes) {
    await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded' });

    // Best-effort URL assertion without relying on RegExp-typed overloads.
    await expect(page).toHaveURL(new RegExp(r.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.*'), {
      timeout: 20000,
    });

    // Wait for main heading to be visible (best-effort).
    await page
      .getByRole('heading', { name: r.heading })
      .first()
      .waitFor({ state: 'visible', timeout: 15000 })
      .catch(() => {});
  }
}

export async function openAddModalFromHeader(page: Page, modalTriggerName: string | RegExp) {
  // E.g., "Add New" button text OR a RegExp
  const name =
    typeof modalTriggerName === 'string'
      ? new RegExp(modalTriggerName, 'i')
      : modalTriggerName;
  await page.getByRole('button', { name }).click();
}
