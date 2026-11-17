const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn, execSync } = require('child_process');

function checkServerReady(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs = 45000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const ready = await checkServerReady(url);
    if (ready) return true;
    await new Promise((r) => setTimeout(r, 1500));
    process.stdout.write('.');
  }
  return false;
}

async function main() {
  let chromium;
  try {
    const pw = require('@playwright/test');
    chromium = pw.chromium;
  } catch (e) {
    try {
      chromium = require('playwright').chromium;
    } catch (err) {
      console.error('Playwright not found:', err);
      console.error('Không tìm thấy Playwright trong node_modules.');
      process.exit(1);
    }
  }

  const rootDir = path.resolve(__dirname, '..');
  const outputPng = path.join(rootDir, 'kami-ely-fullpage.png');
  const artifactDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\46ee8cb7-d8b3-4501-b955-a5c88b58b0e8';
  const artifactPng = path.join(artifactDir, 'kami-ely-fullpage.png');
  const targetUrl = 'http://localhost:3000/projects/proj-kami-ely';

  console.log('Launching browser (channel: msedge)...');
  let spawnedServer = null;
  const isAlreadyRunning = await checkServerReady('http://localhost:3000');

  if (!isAlreadyRunning) {
    console.log('Phát hiện server localhost:3000 chưa chạy.');
    console.log('Đang tự động khởi động máy chủ Next.js (npm run dev)...');
    
    // Windows spawn npm.cmd
    const isWin = process.platform === 'win32';
    const npmCmd = isWin ? 'npm.cmd' : 'npm';
    
    spawnedServer = spawn(npmCmd, ['run', 'dev'], {
      cwd: rootDir,
      shell: true,
      stdio: 'pipe',
    });

    spawnedServer.stdout.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('Ready in') || msg.includes('compiled') || msg.includes('localhost:3000')) {
        // server ready notification
      }
    });

    process.stdout.write('Đang đợi server sẵn sàng');
    const ok = await waitForServer('http://localhost:3000', 45000);
    console.log('');
    if (!ok) {
      console.error('Không thể kết nối với server Next.js sau 45s.');
      if (spawnedServer) {
        try { execSync(`taskkill /pid ${spawnedServer.pid} /T /F`); } catch {}
      }
      process.exit(1);
    }
    console.log('Server đã sẵn sàng!');
  } else {
    console.log('Server localhost:3000 đang hoạt động.');
  }

  console.log('Đang mở trình duyệt (Microsoft Edge)...');
  let browser;
  try {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
    });
  } catch (err) {
    console.log('msedge channel failed, trying default chromium...');
    console.log('Kênh msedge lỗi, chuyển sang chromium mặc định...');
    browser = await chromium.launch({
      headless: true,
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();
  const targetUrl = 'http://localhost:3000/projects/proj-kami-ely';

  console.log(`Navigating to ${targetUrl}...`);
  try {
    await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
    // Wait for animations and charts to render
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error('Failed to load page. Is the dev server running at http://localhost:3000?', err.message);
    await browser.close();
    process.exit(1);
  }
  console.log(`Đang điều hướng đến: ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45000 });

  console.log('Capturing full-page screenshot...');
  console.log('Đang chờ biểu đồ và hình ảnh render hoàn chỉnh (3 giây)...');
  await page.waitForTimeout(3500);

  console.log('Đang chụp ảnh màn hình toàn bộ chiều dài trang (fullPage)...');
  await page.screenshot({ path: outputPng, fullPage: true });
  console.log(`Saved screenshot to: ${outputPng}`);
  console.log(`ĐÃ XUẤT ẢNH THÀNH CÔNG: ${outputPng}`);

  // Also copy to artifact dir if exists
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(outputPng, artifactPng);
    console.log(`Copied to artifact dir: ${artifactPng}`);
    try {
      fs.copyFileSync(outputPng, artifactPng);
      console.log(`Đã sao lưu ảnh vào artifact: ${artifactPng}`);
    } catch {}
  }

  await browser.close();
  console.log('Screenshot capture complete!');

  if (spawnedServer) {
    console.log('Đang đóng tiến trình dev server tạm thời...');
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${spawnedServer.pid} /T /F`);
      } else {
        spawnedServer.kill();
      }
    } catch {}
  }

  console.log('Hoàn thành 100%!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  console.error('Lỗi trong quá trình chụp:', err);
  process.exit(1);
});

