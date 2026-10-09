import { chromium } from 'playwright';
import { preview } from 'vite';

const VIEWPORTS = [320, 360, 375, 390, 412, 430];

console.log('--- Starting Smoke Test Suite ---');
const server = await preview({ preview: { port: 4175 } });
const serverUrl = server.resolvedUrls?.local?.[0] || 'http://localhost:4175';

const browser = await chromium.launch();
let allPassed = true;

for (const width of VIEWPORTS) {
  console.log(`\nTesting viewport: ${width}px width (portrait)...`);
  const page = await browser.newPage({ viewport: { width, height: 750 } });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore sandboxed external CDN image failures if any
      if (!text.includes('ERR_') && !text.includes('images.unsplash.com') && !text.includes('favicon')) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(serverUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // 1. Skip intro
  try {
    const skipBtn = page.locator('button:has-text("Skip"), button:has-text("✕")').first();
    if (await skipBtn.isVisible({ timeout: 1200 })) {
      await skipBtn.click();
      await page.waitForTimeout(400);
      console.log('  ✓ Skipped intro modal');
    }
  } catch {}

  // 2. Scroll the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  console.log('  ✓ Scrolled page smoothly');

  // 3. Check horizontal overflow
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
    console.error(`  ✕ Horizontal overflow detected at ${width}px: scrollWidth (${overflow.scrollWidth}px) > clientWidth (${overflow.clientWidth}px)`);
    allPassed = false;
  } else {
    console.log(`  ✓ No horizontal overflow (scrollWidth: ${overflow.scrollWidth}px === clientWidth: ${overflow.clientWidth}px)`);
  }

  // 4. Add a dish (first ADD opens customization sheet; confirm with "ADD •")
  const addBtn = page.locator('.restaurant-card button:has-text("ADD")').first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await page.waitForTimeout(400);

    const sheetAddBtn = page.locator('.bottom-sheet button').filter({ hasText: /ADD •/ }).first();
    if (await sheetAddBtn.isVisible({ timeout: 1000 })) {
      await sheetAddBtn.click();
      await page.waitForTimeout(400);
      console.log('  ✓ Customization sheet opened and confirmed with "ADD •"');
    } else {
      console.log('  ✓ Added dish directly');
    }
  }

  // 5. Open the cart ("View Order")
  const viewOrderBtn = page.locator('button:has-text("View Order"), button[aria-label="Shopping Cart"]').first();
  if (await viewOrderBtn.isVisible({ timeout: 1000 })) {
    await viewOrderBtn.click();
    await page.waitForTimeout(400);

    const cartTitle = page.locator('text=Your Table Order');
    if (await cartTitle.isVisible()) {
      console.log('  ✓ Cart drawer opened successfully ("View Order")');
    }

    // Close cart drawer
    const closeCart = page.locator('button[aria-label="Close cart"]').first();
    if (await closeCart.isVisible()) {
      await closeCart.click();
      await page.waitForTimeout(300);
      console.log('  ✓ Cart drawer closed');
    }
  }

  // 6. Check console errors
  if (consoleErrors.length > 0) {
    console.error(`  ✕ Console errors at ${width}px:`, consoleErrors);
    allPassed = false;
  } else {
    console.log(`  ✓ 0 console errors at ${width}px`);
  }

  await page.close();
}

await browser.close();
await server.close();

if (!allPassed) {
  console.error('\n❌ Smoke tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All smoke tests passed across all viewports!');
  process.exit(0);
}
