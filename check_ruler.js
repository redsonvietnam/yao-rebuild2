import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('BẬT LƯỚI Ô')) {
      await btn.click();
      console.log('Clicked BẬT LƯỚI Ô');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\brain\\5d8f8112-cbaf-4f70-bdcf-2c0ba5811f0f\\ruler_final.png' });
  console.log('Saved screenshot');
  await browser.close();
})();
