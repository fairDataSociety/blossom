import puppeteer, { Browser } from 'puppeteer'
import path from 'path'
import { getExtensionId } from '../test-utils/extension.util'
import testPrep from './test-prep'

const EXTENSION_ROOT = path.join(__dirname, '..', '..')
const EXTENSION_DIST = path.join(EXTENSION_ROOT, 'dist')
const SWARM_EXTENSION_PATH = path.join(EXTENSION_ROOT, 'swarm-extension/dist')

export default async () => {
  try {
    await testPrep()
  } catch (error) {
    console.error("Couldn't prepare test environment")
    throw error
  }

  const browser: Browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container in github CI environment
    headless: false,
    args: [
      `--no-sandbox`,
      `--disable-extensions-except=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
    ],
  })
  // This global is not available inside tests but only in global teardown
  global.__BROWSER__ = browser
  global.__BLOSSOM_ID__ = await getExtensionId('Blossom')
  global.__SWARM_ID__ = await getExtensionId('Swarm')

  if (!global.__BLOSSOM_ID__) {
    throw new Error('Cannot find the Blossom extension')
  }

  if (!global.__SWARM_ID__) {
    throw new Error('Cannot find the Swarm extension')
  }
}
