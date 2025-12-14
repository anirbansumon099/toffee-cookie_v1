const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class BrowserCookieEngine {
  constructor(profileDir = 'user_data', storeFile = 'cookie_store.json') {
    this.profileDir = path.resolve(profileDir);
    this.storeFile = path.resolve(storeFile);
  }

  async collect(url, waitMs = 5000, headless = true) {
    const context = await chromium.launchPersistentContext(
      this.profileDir,
      { headless }
    );

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForTimeout(waitMs);

    const cookies = await context.cookies();
    const storage = await context.storageState();

    fs.writeFileSync(
      this.storeFile,
      JSON.stringify(storage, null, 2)
    );

    await context.close();
    return cookies;
  }

  loadCookies() {
    if (!fs.existsSync(this.storeFile)) return [];
    const data = JSON.parse(fs.readFileSync(this.storeFile));
    return data.cookies || [];
  }

  exportCookieHeader() {
    const cookies = this.loadCookies();
    return cookies.map(c => `${c.name}=${c.value}`).join('; ');
  }
}

module.exports = BrowserCookieEngine;
