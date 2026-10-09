import { preview } from 'vite';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

async function runLighthouseAudit() {
  console.log('--- Starting Production Preview Server for Lighthouse ---');
  const server = await preview({
    preview: { port: 4192, host: '127.0.0.1' },
  });
  const url = server.resolvedUrls.local[0] || 'http://127.0.0.1:4192';
  console.log(`Preview server running at: ${url}`);

  console.log('Launching Playwright Chromium with remote debugging port 9222...');
  const browser = await chromium.launch({
    args: ['--remote-debugging-port=9222', '--no-sandbox'],
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: 9222,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    throttlingMethod: 'simulate',
  };

  try {
    console.log(`Running Lighthouse Mobile audit on ${url}...`);
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;

    const scores = {
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((report.categories.seo?.score || 0) * 100),
      cls: report.audits['cumulative-layout-shift']?.numericValue ?? 0,
      lcp: (report.audits['largest-contentful-paint']?.numericValue || 0) / 1000,
    };

    console.log('\n================ LIGHTHOUSE RESULTS ================');
    console.log(`Performance:    ${scores.performance} / 100 (Target >= 90)`);
    console.log(`Accessibility:  ${scores.accessibility} / 100 (Target >= 95)`);
    console.log(`Best Practices: ${scores.bestPractices} / 100 (Target >= 95)`);
    console.log(`SEO:            ${scores.seo} / 100 (Target >= 95)`);
    console.log(`CLS:            ${scores.cls.toFixed(3)} (Target < 0.1)`);
    console.log(`LCP:            ${scores.lcp.toFixed(2)}s (Target < 2.5s)`);
    const lcpAudit = report.audits['largest-contentful-paint-element'] || report.audits['largest-contentful-paint'];
    console.log('LCP Audit items:', JSON.stringify(lcpAudit?.details?.items?.[0] || {}));
    console.log(`FCP:            ${report.audits['first-contentful-paint']?.displayValue}`);
    console.log(`Speed Index:    ${report.audits['speed-index']?.displayValue}`);
    console.log(`TBT:            ${report.audits['total-blocking-time']?.displayValue}`);
    console.log(`LCP Element:    ${report.audits['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet || report.audits['largest-contentful-paint-element']?.details?.items?.[0]?.node?.selector}`);
    console.log('====================================================\n');

    console.log('--- Performance Diagnostics ---');
    for (const [key, audit] of Object.entries(report.audits)) {
      if (audit.score !== null && audit.score < 0.9 && audit.details?.type === 'opportunity') {
        console.log(`Opportunity [${key}]: ${audit.title} (Savings: ${audit.displayValue || ''})`);
      }
    }
    console.log('\n--- Failed/Warning Audits in SEO ---');
    for (const [key, audit] of Object.entries(report.audits)) {
      if (key.includes('robots') || key.includes('crawl') || key.includes('canonical') || key.includes('tap-targets') || key.includes('font-size')) {
        if (audit.score !== 1 && audit.score !== null) {
          console.log(`SEO audit [${key}]: score=${audit.score}, explanation=${audit.explanation || audit.title}`);
        }
      }
    }

    await browser.close();
    await server.close();

    return scores;
  } catch (err) {
    console.error('Lighthouse audit failed:', err);
    await browser.close();
    await server.close();
    process.exit(1);
  }
}

runLighthouseAudit();
