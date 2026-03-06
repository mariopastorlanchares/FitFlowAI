import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:8081/login');

  // Wait for React to mount and some content to appear
  await page.waitForTimeout(3000);

  // Save screenshot
  await page.screenshot({ path: 'login_screen_test.png' });

  const content = await page.content();
  console.log("HTML CONTENT:", content);

  await browser.close();
})();
