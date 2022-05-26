import puppeteer from 'puppeteer'
import fs from 'fs'
import os from 'os'
import path from 'path'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

const EXTENSION_ROOT = path.join(__dirname, '..', '..')
const EXTENSION_DIST = path.join(EXTENSION_ROOT, 'dist')
const SWARM_EXTENSION_PATH = path.join(EXTENSION_ROOT, 'node_modules/@ethersphere/swarm-extension/dist')

export default async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
    ],
  })
  // This global is not available inside tests but only in global teardown
  global.__BROWSER__ = browser
  // Instead, we expose the connection details via file system to be used in tests
  fs.rmSync(DIR, { recursive: true, force: true })
  fs.mkdirSync(DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
