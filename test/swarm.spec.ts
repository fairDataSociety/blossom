import path from 'path';
import puppeteer from 'puppeteer';

const EXTENSION_PATH = path.join(__dirname, '..', 'dist');
const SWARM_EXTENSION_PATH = path.join(
  process.env.SWARM_EXTENSION_PATH,
  'dist'
);

describe('Swarm extension API tests', () => {
  it('Test extension', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH},${SWARM_EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH},${SWARM_EXTENSION_PATH}`
      ]
    });

    const page = await browser.newPage();

    await page.goto('chrome://extensions');

    // TODO Add test
    await page.evaluate(() => {
      debugger;
    });
  });
});
