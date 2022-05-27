import path from 'path'
import puppeteer, { Browser } from 'puppeteer'
import { getExtensionId } from '../utils/extension'

const EXTENSION_PATH = path.join(__dirname, '..', '..', '..', 'dist')

export default async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      `--window-size=800,600`,
    ],
  })

  // This global is not available inside tests but only in global teardown
  global.__BROWSER__ = browser
  global.__BLOSSOM_ID__ = await getExtensionId(browser)
}
