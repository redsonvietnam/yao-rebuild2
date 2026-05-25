import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Click BẬT LƯỚI Ô
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

  // Get all key elements rects
  const rects = await page.evaluate(() => {
    const results = [];
    // Header
    const header = document.querySelector('header');
    if (header) {
      const r = header.getBoundingClientRect();
      results.push({ name: 'Header', x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom });
    }
    // EditorToolbar: shrink-0 h-12 with border-b
    const allDivs = document.querySelectorAll('div');
    for (const d of allDivs) {
      const cls = d.className || '';
      // Toolbar: has undo/redo buttons, shrink-0 h-12 border-b
      if (cls.includes('shrink-0') && cls.includes('h-12') && cls.includes('border-b')) {
        const r = d.getBoundingClientRect();
        results.push({ name: 'EditorToolbar', x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom });
      }
      // New RulerWrapper: absolute, has justify-center, overflow-x-auto, z-[95]
      if (cls.includes('absolute') && cls.includes('justify-center') && cls.includes('overflow-x-auto') && cls.includes('z-[95]')) {
        const r = d.getBoundingClientRect();
        const position = window.getComputedStyle(d).position;
        const zIndex = window.getComputedStyle(d).zIndex;
        results.push({ name: 'RulerWrapper', x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom, position, zIndex });
      }
      // Content area: flex-1 relative min-h-0
      if (cls.includes('flex-1') && cls.includes('relative') && cls.includes('min-h-0')) {
        const r = d.getBoundingClientRect();
        results.push({ name: 'ContentArea', x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom });
      }
    }
    // Ruler itself (210mm wide)
    const rulerEl = document.querySelector('[style*="210mm"]');
    if (rulerEl) {
      const r = rulerEl.getBoundingClientRect();
      results.push({ name: 'Ruler', x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom });
    }
    return results;
  });

  console.log('\n=== DOM Rect Results ===');
  for (const r of rects) {
    console.log(`${r.name}: y=${r.y.toFixed(1)}, bottom=${r.bottom.toFixed(1)}, height=${r.h.toFixed(1)}${r.zIndex ? ', zIndex=' + r.zIndex : ''}${r.visibility ? ', vis=' + r.visibility : ''}`);
  }

  // Check for any overlap between toolbar and ruler
  const toolbar = rects.find(r => r.name === 'EditorToolbar');
  const rulerWrap = rects.find(r => r.name === 'RulerWrapper');
  const ruler = rects.find(r => r.name === 'Ruler');
  
  console.log('\n=== Overlap Check ===');
  if (toolbar && rulerWrap) {
    console.log(`Toolbar bottom: ${toolbar.bottom.toFixed(1)}, RulerWrapper top: ${rulerWrap.y.toFixed(1)}`);
    const gap = rulerWrap.y - toolbar.bottom;
    if (gap >= 0) {
      console.log(`Gap: ${gap.toFixed(1)}px — NO OVERLAP ✅`);
    } else {
      console.log(`Overlap: ${Math.abs(gap).toFixed(1)}px — BAD ❌`);
    }
  }
  if (ruler && rulerWrap) {
    console.log(`Ruler y: ${ruler.y.toFixed(1)}, RulerWrapper y: ${rulerWrap.y.toFixed(1)}`);
  }

  // Check if ruler is visible (not clipped by overflow)
  if (ruler) {
    console.log(`Ruler dimensions: ${ruler.w.toFixed(1)} x ${ruler.h.toFixed(1)}`);
    const isHidden = ruler.w <= 0 || ruler.h <= 0;
    console.log(`Ruler visible: ${isHidden ? 'NO ❌' : 'YES ✅'}`);
  }

  await page.screenshot({ path: 'd:\\yao-rebuild-2\\ruler_verify.png' });
  console.log('\nScreenshot saved to ruler_verify.png');
  await browser.close();
})();