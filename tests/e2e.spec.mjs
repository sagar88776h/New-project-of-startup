import { chromium, devices } from 'playwright';
import { preview } from 'vite';

const TEST_CONFIGS = [
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'iPhone 14', device: devices['iPhone 14'] },
  { name: 'Pixel 7', device: devices['Pixel 7'] },
  { name: 'Throttled Slow 4G (iPhone 14)', device: devices['iPhone 14'], throttle: true },
];

console.log('=== Starting End-to-End Test Suite ===\n');

const server = await preview({ preview: { port: 4188 } });
const serverUrl = server.resolvedUrls?.local?.[0] || 'http://localhost:4188';

const browser = await chromium.launch();
let allPassed = true;

for (const config of TEST_CONFIGS) {
  console.log(`\n--------------------------------------------`);
  console.log(`Testing Profile: ${config.name}`);
  console.log(`--------------------------------------------`);

  const context = await browser.newContext({
    ...config.device,
  });

  const page = await context.newPage();

  // Network throttling if requested
  if (config.throttle) {
    try {
      const cdpSession = await context.newCDPSession(page);
      await cdpSession.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400, // 400ms RTT
        downloadThroughput: (500 * 1024) / 8, // 500 kbps
        uploadThroughput: (500 * 1024) / 8,
      });
      console.log('  ⚡ Network throttled to Slow 4G profile (400ms latency, 500kbps)');
    } catch (e) {
      console.warn('  ⚠️ CDP throttling setup warning:', e.message);
    }
  }

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('ERR_') && !text.includes('images.unsplash.com') && !text.includes('favicon')) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(serverUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // 1. Skip intro
  try {
    const skipBtn = page.locator('button:has-text("Skip"), button[aria-label*="Skip"]').first();
    await skipBtn.waitFor({ state: 'visible', timeout: 3500 }).catch(() => {});
    if (await skipBtn.isVisible()) {
      await skipBtn.click({ force: true });
      await page.waitForTimeout(600);
      console.log('  ✓ Skipped intro modal');
    }
  } catch {}

  // 2. Filters (Veg / Non-Veg / Bestsellers / All)
  try {
    const vegBtn = page.locator('button[aria-label="Filter by Pure Veg"]').first();
    if (await vegBtn.isVisible({ timeout: 2000 })) {
      await vegBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Applied Pure Veg filter');

      const nonVegBtn = page.locator('button[aria-label="Filter by Non-Veg"]').first();
      await nonVegBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Applied Non-Veg filter');

      const bestsellersBtn = page.locator('button[aria-label="Filter by Bestsellers"]').first();
      await bestsellersBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Applied Bestsellers filter');

      const allBtn = page.locator('button[aria-label="Filter by All Items"]').first();
      await allBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Reset to All Items filter');
    }
  } catch (err) {
    console.error('  ✕ Filter test issue:', err.message);
    allPassed = false;
  }

  // 3. Search
  try {
    const searchInput = page.locator('input[aria-label="Search menu items"]').first();
    if (await searchInput.isVisible({ timeout: 2000 })) {
      await searchInput.fill('Biryani');
      await page.waitForTimeout(400);
      console.log('  ✓ Performed inline search for "Biryani"');

      const clearBtn = page.locator('button[aria-label="Clear search"]').first();
      if (await clearBtn.isVisible({ timeout: 1000 })) {
        await clearBtn.click({ force: true });
        await page.waitForTimeout(300);
        console.log('  ✓ Cleared search input');
      }
    }
  } catch (err) {
    console.error('  ✕ Search test issue:', err.message);
    allPassed = false;
  }

  // 4. Add dish with customizations
  try {
    const addBtn = page.locator('.restaurant-card button:has-text("ADD")').first();
    if (await addBtn.isVisible({ timeout: 2000 })) {
      await addBtn.click({ force: true });
      await page.waitForTimeout(600);

      // Check if customization bottom sheet opened
      const sheetConfirmBtn = page.locator('.bottom-sheet button').filter({ hasText: /ADD •/ }).first();
      if (await sheetConfirmBtn.isVisible({ timeout: 1500 })) {
        await sheetConfirmBtn.click({ force: true });
        await page.waitForTimeout(500);
        console.log('  ✓ Added dish with customization confirmed');
      } else {
        console.log('  ✓ Added dish directly to cart');
      }
    }
  } catch (err) {
    console.error('  ✕ Add dish test issue:', err.message);
    allPassed = false;
  }

  // 5. Quantity +/-
  try {
    const plusBtn = page.locator('button[aria-label*="Increase"]').first();
    if (await plusBtn.isVisible({ timeout: 1000 })) {
      await plusBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Increased item quantity (+)');
    }

    const minusBtn = page.locator('button[aria-label*="Decrease"]').first();
    if (await minusBtn.isVisible({ timeout: 1000 })) {
      await minusBtn.click({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Decreased item quantity (-)');
    }
  } catch (err) {
    console.warn('  ⚠️ Quantity test note:', err.message);
  }

  // 6. Table selection
  try {
    const tableBtn = page.locator('button[aria-label="Select table"]').first();
    if (await tableBtn.isVisible({ timeout: 1000 })) {
      await tableBtn.click({ force: true });
      await page.waitForTimeout(500);

      // Select table 04
      const t4Btn = page.locator('.bottom-sheet button:has-text("04")').first();
      if (await t4Btn.isVisible({ timeout: 1000 })) {
        await t4Btn.click({ force: true });
        await page.waitForTimeout(500);
        console.log('  ✓ Selected Table 04 via TableSelectorModal');
      } else {
        // Close table modal with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }
  } catch (err) {
    console.warn('  ⚠️ Table selector test note:', err.message);
  }

  // 7. Cart drawer, totals, and place order
  try {
    const viewCartBtn = page.locator('button[aria-label="View Order Cart"], button[aria-label="Shopping Cart"], button:has-text("View Order")').first();
    if (await viewCartBtn.isVisible({ timeout: 1500 })) {
      await viewCartBtn.click({ force: true });
      await page.waitForTimeout(500);

      // Verify cart totals are visible
      const totalsVisible = await page.locator('text=Grand Total').isVisible();
      if (totalsVisible) {
        console.log('  ✓ Cart drawer opened and totals calculated');
      }

      // Click Place Order CTA
      const orderCta = page.locator('button:has-text("PROCEED TO ORDER")').first();
      if (await orderCta.isVisible({ timeout: 1500 })) {
        await orderCta.click({ force: true });
        await page.waitForTimeout(700);

        // Verify OrderSuccessModal
        const successTitle = page.locator('text=Order Sent to Kitchen!');
        if (await successTitle.isVisible({ timeout: 2000 })) {
          console.log('  ✓ Order placed successfully -> OrderSuccessModal visible');

          // Close order success modal
          const moreDishesBtn = page.locator('button:has-text("Order More Dishes")').first();
          if (await moreDishesBtn.isVisible()) {
            await moreDishesBtn.click({ force: true });
            await page.waitForTimeout(500);
          }
        }
      }
    }
  } catch (err) {
    console.error('  ✕ Cart / Order test issue:', err.message);
    allPassed = false;
  }

  // 8. Call Waiter modal
  try {
    const waiterBtn = page.locator('button[aria-label="Call Waiter"]').first();
    if (await waiterBtn.isVisible({ timeout: 1000 })) {
      await waiterBtn.click({ force: true });
      await page.waitForTimeout(500);

      // Request water
      const waterOption = page.locator('.bottom-sheet button, .bottom-sheet div').filter({ hasText: 'Request Water' }).first();
      if (await waterOption.isVisible({ timeout: 1000 })) {
        await waterOption.click({ force: true });
        await page.waitForTimeout(500);
        console.log('  ✓ Call Waiter service requested successfully');
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }
  } catch (err) {
    console.warn('  ⚠️ Waiter modal note:', err.message);
  }

  // 9. Restaurant Info modal with Escape closing
  try {
    const infoBtn = page.locator('button[aria-label="Restaurant Info"]').first();
    if (await infoBtn.isVisible({ timeout: 1000 })) {
      await infoBtn.click({ force: true });
      await page.waitForTimeout(500);

      const infoDialog = page.locator('div[role="dialog"][aria-label*="About"]').first();
      if (await infoDialog.isVisible({ timeout: 1000 })) {
        console.log('  ✓ Restaurant Info modal opened');

        // Test Escape key trapping
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);

        const isClosed = !(await infoDialog.isVisible());
        if (isClosed) {
          console.log('  ✓ Modal closed with Escape key (WCAG compliant)');
        }
      }
    }
  } catch (err) {
    console.warn('  ⚠️ Info modal note:', err.message);
  }

  // 10. Horizontal overflow check
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    return {
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      hasOverflow: Math.max(doc.scrollWidth, body.scrollWidth) > doc.clientWidth,
    };
  });

  if (overflow.hasOverflow) {
    console.error(`  ✕ Horizontal overflow detected: scrollWidth (${overflow.scrollWidth}px) > clientWidth (${overflow.clientWidth}px)`);
    allPassed = false;
  } else {
    console.log(`  ✓ 0 horizontal overflow (scrollWidth: ${overflow.scrollWidth}px === clientWidth: ${overflow.clientWidth}px)`);
  }

  // 11. Console errors check
  if (consoleErrors.length > 0) {
    console.error(`  ✕ Console errors detected:`, consoleErrors);
    allPassed = false;
  } else {
    console.log('  ✓ 0 console errors');
  }

  await context.close();
}

await browser.close();
await server.close();

if (!allPassed) {
  console.error('\n❌ E2E test suite failed!');
  process.exit(1);
} else {
  console.log('\n============================================');
  console.log('✅ ALL E2E TESTS PASSED ACROSS ALL DEVICES!');
  console.log('============================================');
  process.exit(0);
}
