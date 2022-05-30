import path from 'path'
import puppeteer, { Browser } from 'puppeteer'
import { getExtensionId } from '../utils/extension'

const EXTENSION_ROOT = path.join(__dirname, '..', '..', '..')
const EXTENSION_PATH = path.join(EXTENSION_ROOT, 'dist')
const SWARM_EXTENSION_PATH = path.join(EXTENSION_ROOT, 'node_modules/@ethersphere/swarm-extension/dist')

export default async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH},${SWARM_EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH},${SWARM_EXTENSION_PATH}`,
      `--window-size=800,600`,
    ],
  })

  // This global is not available inside tests but only in global teardown
  global.__BROWSER__ = browser
  global.__BLOSSOM_ID__ = await getExtensionId(browser)
}
