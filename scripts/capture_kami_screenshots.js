const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const HOST = '127.0.0.1';
const PORT = 3009;
const ROOT_URL = `http://${HOST}:${PORT}/`;
const TARGET_URL = `http://${HOST}:${PORT}/projects/proj-kami-ely`;
const ARTIFACT_DIR = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\96a528fc-eb59-4b4c-ad62-0dc5b8f2a4d7';
const PUBLIC_DIR = path.resolve(__dirname, '../public/screenshots/kami-ely');

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout waiting for server at ${url}`));
        } else {
          setTimeout(check, 1000);
        }
      });
    };
    check();
  });
}

async function main() {
  console.log(`Starting Next.js dev server on http://${HOST}:${PORT}...`);
  const server = spawn('cmd.exe', ['/c', 'npx', 'next', 'dev', '-H', HOST, '-p', String(PORT)], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    console.log(`[Next.js] ${d.toString().trim()}`);
  });

  server.stderr.on('data', (d) => {
    console.error(`[Next.js err] ${d.toString().trim()}`);
  });

  try {
    console.log(`Waiting for server to respond at ${ROOT_URL}...`);
    await waitForServer(ROOT_URL, 60000);
    console.log(`Server responded! Launching Playwright Chromium...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2, // 2x crisp retina resolution
    });

    const page = await context.newPage();
    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for animations and recharts to render
    await page.waitForTimeout(4000);

    async function snap(selector, filename) {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      
      const artifactPath = path.join(ARTIFACT_DIR, filename);
      const publicPath = path.join(PUBLIC_DIR, filename);

      await el.screenshot({ path: artifactPath });
      fs.copyFileSync(artifactPath, publicPath);
      console.log(`✔ Captured: ${filename}`);
    }

    // 1. Hero & KPI Cards (Top of page)
    console.log('Capturing Hero & KPIs...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '00_kami_ely_hero_header.png'),
      clip: { x: 0, y: 0, width: 1440, height: 860 },
    });
    fs.copyFileSync(path.join(ARTIFACT_DIR, '00_kami_ely_hero_header.png'), path.join(PUBLIC_DIR, '00_kami_ely_hero_header.png'));
    console.log('✔ Captured: 00_kami_ely_hero_header.png');

    // 2. Chapter 0: Executive summary
    console.log('Capturing Chapter 0...');
    await snap('#sec-exec-summary', '01_kami_ely_ch0_executive_summary.png');

    // 3. Chapter 1: Problem & Data architecture
    console.log('Capturing Chapter 1...');
    await snap('#sec-ch1-data', '02_kami_ely_ch1_context_data.png');

    // 4. Chapter 2: Revenue channels & SKU Pareto
    console.log('Capturing Chapter 2...');
    await snap('#sec-ch2-sku', '03_kami_ely_ch2_revenue_and_sku.png');

    // 5. Chapter 3: Seasonality, 4 phases & panel regression
    console.log('Capturing Chapter 3...');
    await snap('#sec-ch3-season', '04_kami_ely_ch3_seasonality_and_phases.png');

    // 6. Chapter 4: KOC Retention Cohort & Survival
    console.log('Capturing Chapter 4...');
    await snap('#sec-ch4-koc', '05_kami_ely_ch4_koc_network_retention.png');

    // 7. Chapter 5: Live vs Video vs Ads
    console.log('Capturing Chapter 5...');
    await snap('#sec-ch5-ads', '06_kami_ely_ch5_live_video_ads.png');

    // 8. Chapter 6: Early Warning Signals & Lollipop Lead-Time
    console.log('Capturing Chapter 6...');
    await snap('#sec-ch6-conclusion', '07_kami_ely_ch6_early_warning_and_playbook.png');

    // Open More Section in Chapter 6 to capture Traffic lights & Action Playbook
    try {
      const moreBtn = page.locator('#sec-ch6-conclusion button:has-text("6.3.")').first();
      if (await moreBtn.isVisible()) {
        await moreBtn.click();
        await page.waitForTimeout(1000);
        await snap('#sec-ch6-conclusion', '08_kami_ely_ch6_expanded_playbook.png');
      }
    } catch (e) {
      console.log('Could not expand 6.3:', e.message);
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } finally {
    console.log('Terminating Next.js dev server...');
    try {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' });
    } catch {
      server.kill();
    }
  }
}

main().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
