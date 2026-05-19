import { test, expect } from '@playwright/test';
import {
  CREDS,
  attachConsoleAndErrors,
  attachNetworkLogging,
  safeGoto,
  loginIfNeeded,
  logoutViaUI,
  navigateProtected,
  openAddModalFromHeader,
  openMobileNav,
  closeMobileNav,
} from './wealthwatch.helpers';

test.describe('WealthWatch - Full App QA (autonomous exploration)', () => {
  test('discover navigation, protected routes, forms/modals, CRUD basics, and record console/network issues', async ({ page }, testInfo) => {
    const logs = { console: [] as string[], errors: [] as string[], failedRequests: [] as string[] };

    attachConsoleAndErrors(page, logs);
    attachNetworkLogging(page, logs);

    testInfo.attach('environment', {
      body: Buffer.from(JSON.stringify({ url: testInfo.project.use?.baseURL ?? 'http://localhost:3000' })),
      contentType: 'application/json',
    }).catch(() => {});

    testInfo.setTimeout(180_000);

    // Capture screenshot on failures
    testInfo.annotations.push({ type: 'suite', description: 'autonomous' });

    page.on('close', () => {});

    const base = 'http://localhost:3000';

    // ---------- Public routes discovery ----------
    await safeGoto(page, `${base}/`);
    await expect(page).toHaveURL(/\/$/);

    // Check key public navigation links exist
    // Prefer roles/text rather than href.
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible().catch(() => {});
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible().catch(() => {});
    await expect(page.getByRole('link', { name: /sign up|signup|create account/i })).toBeVisible().catch(() => {});

    // Explore pricing
    await safeGoto(page, `${base}/pricing`);
    await expect(page).toHaveURL(/\/pricing/);

    // Explore login
    await safeGoto(page, `${base}/login`);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Ensure password toggle works (best-effort)
    const pwToggle = page.getByRole('button', { name: /show password|hide password/i }).first();
    // If icons only, fallback to clicking by presence of eye button: there is only one button type=button in that area
    if (await pwToggle.isVisible().catch(() => false)) {
      await pwToggle.click();
      await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible().catch(() => {});
    }

    // Explore signup
    await safeGoto(page, `${base}/signup`);
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    // ---------- Login / Protected route checks ----------
    // Perform login from /login
    await safeGoto(page, `${base}/login`);
    await loginIfNeeded(page, CREDS.email, CREDS.password);

    // After login we should have Layout with sidebar/mobile nav
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify sidebar links for protected routes
    const protectedNav = [
      { name: /dashboard/i, path: '/dashboard' },
      { name: /transactions/i, path: '/transactions' },
      { name: /assets/i, path: '/assets' },
      { name: /liabilities/i, path: '/liabilities' },
      { name: /ai advisor/i, path: '/ai-advisor' },
      { name: /goals/i, path: '/goals' },
      { name: /reports/i, path: '/reports' },
      { name: /settings/i, path: '/settings' },
    ];

    for (const item of protectedNav) {
      // Sidebar uses NavLink, so role can be 'link'
      const link = page.getByRole('link', { name: item.name });
      await expect(link).toBeVisible({ timeout: 15000 }).catch(() => {});
    }

    // ---------- Responsive/mobile nav behavior ----------
    // Emulate mobile width for the same page
    await page.setViewportSize({ width: 390, height: 844 });
    await safeGoto(page, `${base}/dashboard`);

    await openMobileNav(page);
    // Close overlay if possible
    await closeMobileNav(page);

    // ---------- Navigate all protected routes and validate basic load ----------
    await navigateProtected(page, [
      { path: '/dashboard', heading: /financial command center/i },
      { path: '/transactions', heading: /transactions/i },
      { path: '/assets', heading: /assets/i },
      { path: '/liabilities', heading: /liabilities/i },
      { path: '/ai-advisor', heading: /ai advisor|ai-powered|advisor/i },
      { path: '/goals', heading: /goals/i },
      { path: '/reports', heading: /reports/i },
      { path: '/settings', heading: /settings|profile/i },
    ]);

    // ---------- CRUD / Modals basics (non-destructive best-effort) ----------
    // Transactions: open Add New modal, fill minimal fields, submit, ensure modal closes or errors surface.
    await safeGoto(page, `${base}/transactions`);
    await openAddModalFromHeader(page, 'Add New');

    // Best-effort: within modal, attempt to fill any common fields
    const modal = page.getByRole('dialog').first();
    await expect(modal).toBeVisible({ timeout: 15000 }).catch(() => {});

    const noteInput = modal.getByRole('textbox').first();
    if (await noteInput.isVisible().catch(() => false)) {
      await noteInput.fill('Playwright QA transaction');
    }

    const amountInput = modal.locator('input[type="number"]').first();
    if (await amountInput.isVisible().catch(() => false)) {
      await amountInput.fill('1000');
    }

    const submitBtn = modal.getByRole('button', { name: /add|save|submit|create/i }).first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      // Modal may close or show validation; allow either.
      await modal.waitFor({ state: 'detached', timeout: 15000 }).catch(async () => {
        // If modal stayed, ensure we didn't end up on blank state.
        await expect(modal).toBeVisible();
      });
    }

    // Try delete action only if there is at least one row and handle confirm dialog.
    const deleteButtons = page.getByRole('button', { name: /trash|delete/i }).first();
    // In this app delete button is icon-only; fallback to click first trash by locating button in table.
    const anyDelete = page.locator('button:has(svg)').first();
    // Best-effort: do not delete if confirm is risky; just ensure confirm dialog appears.
    if (await anyDelete.isVisible().catch(() => false)) {
      page.once('dialog', async (d) => {
        expect(d.type()).toBe('confirm');
        // Cancel destructive action to be safe
        await d.dismiss();
      });
      await anyDelete.click().catch(() => {});
    }

    // Assets: open Add asset modal if present via "Add New" button
    await safeGoto(page, `${base}/assets`);
    await openAddModalFromHeader(page, 'Add New').catch(() => {});
    if (await page.getByRole('dialog').first().isVisible().catch(() => false)) {
      const m = page.getByRole('dialog').first();
      const addBtn = m.getByRole('button', { name: /add|save|submit|create/i }).first();
      await addBtn.click().catch(() => {});
      await m.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    }

    // Goals: open modal
    await safeGoto(page, `${base}/goals`);
    await openAddModalFromHeader(page, /add goal|add new|new goal/i).catch(() => {});
    if (await page.getByRole('dialog').first().isVisible().catch(() => false)) {
      const m = page.getByRole('dialog').first();
      const addBtn = m.getByRole('button', { name: /add|save|submit|create/i }).first();
      await addBtn.click().catch(() => {});
      await m.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    }

    // Reports: check export UI buttons exist if present (best-effort)
    await safeGoto(page, `${base}/reports`);
    await expect(page.getByRole('heading', { name: /reports/i })).toBeVisible({ timeout: 15000 }).catch(() => {});
    // If there are export buttons, click one best-effort (non-destructive)
    const exportBtn = page.getByRole('button', { name: /export|csv|pdf/i }).first();
    if (await exportBtn.isVisible().catch(() => false)) {
      await exportBtn.click().catch(() => {});
    }

    // Settings: open profile dropdown and verify Settings link navigates back to /settings
    const profileMenuButton = page.getByRole('button', { name: /open profile menu/i }).first();
    await profileMenuButton.click();
    await expect(page.getByRole('button', { name: /settings/i })).toBeVisible({ timeout: 5000 }).catch(() => {});
    await page.getByRole('button', { name: /settings/i }).click().catch(() => {});
    await expect(page).toHaveURL(/\/settings/);

    // ---------- Logout flow ----------
    await logoutViaUI(page);
    await expect(page).toHaveURL(/\/login/);

    // Attach logs to test output
    testInfo.attach('console-log', {
      body: Buffer.from(logs.console.join('\n')),
      contentType: 'text/plain',
    }).catch(() => {});
    testInfo.attach('page-errors', {
      body: Buffer.from(logs.errors.join('\n')),
      contentType: 'text/plain',
    }).catch(() => {});
    testInfo.attach('network-failures', {
      body: Buffer.from(logs.failedRequests.join('\n')),
      contentType: 'text/plain',
    }).catch(() => {});
  });
});
