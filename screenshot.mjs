import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const SCREENS = [
  'lock', 'splash', 'onboarding', 'home',
  'voice_chat', 'conv_diary', 'dashboard', 'archive', 'voice_settings'
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 820 });

// 서버가 5175에서 실행 중
const BASE = 'http://localhost:5175';

for (const screen of SCREENS) {
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.waitForTimeout(800);

  // dev nav 버튼 클릭으로 화면 전환
  await page.evaluate((s) => {
    const btns = Array.from(document.querySelectorAll('div'));
    const btn = btns.find(el => el.textContent.trim() === s && el.style.cursor === 'pointer');
    if (btn) btn.click();
  }, screen);

  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, `${screen}.png`), fullPage: false });
  console.log(`✓ ${screen}`);
}

await browser.close();
console.log('Done → screenshots/');
