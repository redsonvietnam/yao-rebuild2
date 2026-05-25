import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

const btns = await page.$$('button');
for (const btn of btns) {
  const t = await page.evaluate(el => el.textContent, btn);
  if (t && t.includes('BẬT LƯỚI')) { await btn.click(); break; }
}
await new Promise(r => setTimeout(r, 1000));

const html = await page.evaluate(() => {
  const toolbar = document.querySelector('.h-12.border-b.border-gray-800');
  const rulerWrapper = document.querySelector('.py-2.flex.justify-center.overflow-x-auto');
  return {
    toolbar: toolbar ? toolbar.outerHTML : null,
    rulerWrapper: rulerWrapper ? rulerWrapper.outerHTML : null
  };
});

fs.writeFileSync('overlap_dump.json', JSON.stringify(html, null, 2));
console.log('Saved overlap_dump.json');
await browser.close();
