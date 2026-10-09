import { chromium } from 'playwright';
import { preview } from 'vite';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '320_portrait', width: 320, height: 640 },
  { name: '360_portrait', width: 360, height: 740 },
  { name: '375_portrait', width: 375, height: 667 },
  { name: '390_portrait', width: 390, height: 844 },
  { name: '412_portrait', width: 412, height: 915 },
  { name: '430_portrait', width: 430, height: 932 },
  { name: '667_landscape', width: 667, height: 375 },
  { name: '320_568_short', width: 320, height: 568 },
];

const screenshotsDir = path.resolve('audit_screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Starting Vite preview server programmatically...');
const server = await preview({
  preview: { port: 4173 },
});

const serverUrl = 'http://localhost:4173';
console.log(`Preview server running at ${serverUrl}`);

const browser = await chromium.launch();
const results = {};

for (const vp of VIEWPORTS) {
  console.log(`\n--- Auditing ${vp.name} (${vp.width}x${vp.height}) ---`);
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });

  await page.goto(serverUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Skip intro if open
  try {
    const skipBtn = page.locator('button:has-text("Skip")');
    if (await skipBtn.isVisible({ timeout: 1500 })) {
      await skipBtn.click();
      await page.waitForTimeout(500);
    }
  } catch {
    // intro might not be present
  }

  // Check horizontal overflow
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = doc.scrollWidth;
    const clientWidth = doc.clientWidth;
    const bodyScrollWidth = body.scrollWidth;
    const hasHorizontalScroll = scrollWidth > clientWidth || bodyScrollWidth > clientWidth;

    // Find overflowing elements
    const overflowing = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 1 || rect.left < -1) {
        if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden') {
          // Check if the element itself or any ancestor has overflowX auto/scroll/hidden
          let parent = el;
          let isInsideScrollable = false;
          while (parent && parent !== document.body && parent !== document.documentElement) {
            const ox = window.getComputedStyle(parent).overflowX;
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') {
              isInsideScrollable = true;
              break;
            }
            parent = parent.parentElement;
          }
          if (isInsideScrollable) continue;

          overflowing.push({
            tag: el.tagName,
            class: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
            id: el.id,
            width: Math.round(rect.width),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            clientWidth,
          });
        }
      }
    }

    // Check tap targets
    const smallTapTargets = [];
    const interactive = document.querySelectorAll('button, a, input, select, [role="button"]');
    for (const el of interactive) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden') {
        if (rect.width < 44 || rect.height < 44) {
          smallTapTargets.push({
            tag: el.tagName,
            text: el.innerText?.slice(0, 25).trim() || el.getAttribute('aria-label') || el.name || 'unnamed',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            class: typeof el.className === 'string' ? el.className.slice(0, 30) : '',
          });
        }
      }
    }

    return { scrollWidth, clientWidth, bodyScrollWidth, hasHorizontalScroll, overflowing, smallTapTargets };
  });

  results[vp.name] = metrics;
  console.log(`ScrollWidth: ${metrics.scrollWidth}px (Body: ${metrics.bodyScrollWidth}px), ClientWidth: ${metrics.clientWidth}px. Has Horizontal Scroll: ${metrics.hasHorizontalScroll}`);
  if (metrics.overflowing.length > 0) {
    console.log(`Found ${metrics.overflowing.length} overflowing elements:`, metrics.overflowing.slice(0, 6));
  } else {
    console.log(`No horizontal overflowing elements found.`);
  }
  console.log(`Found ${metrics.smallTapTargets.length} tap targets smaller than 44x44px:`, metrics.smallTapTargets.slice(0, 8));

  // Save screenshot
  await page.screenshot({ path: path.join(screenshotsDir, `page_${vp.name}.png`), fullPage: false });

  // If 320 or 390, also take modal screenshots (Dish detail, Cart drawer)
  if (vp.name === '320_portrait' || vp.name === '390_portrait') {
    // Open a dish card modal
    const foodCard = page.locator('.restaurant-card').first();
    if (await foodCard.isVisible()) {
      await foodCard.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `detail_modal_${vp.name}.png`) });
      // Close detail
      const closeBtn = page.locator('button[aria-label="Close modal"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Open Cart Drawer
    const cartIcon = page.locator('button[aria-label="Shopping Cart"]');
    if (await cartIcon.isVisible()) {
      await cartIcon.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(screenshotsDir, `cart_drawer_${vp.name}.png`) });
      const closeCart = page.locator('button[aria-label="Close cart"]').first();
      if (await closeCart.isVisible()) {
        await closeCart.click();
        await page.waitForTimeout(300);
      }
    }
  }

  await page.close();
}

await browser.close();
await server.close();

fs.writeFileSync(path.join(screenshotsDir, 'audit_results.json'), JSON.stringify(results, null, 2));
console.log('\nAudit complete! Results saved in audit_screenshots/');
