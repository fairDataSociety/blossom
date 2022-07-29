import puppeteer from 'puppeteer'
import path from 'path'
import { getExtensionId } from '../utils/extension.util'

const EXTENSION_ROOT = path.join(__dirname, '..', '..')
const EXTENSION_DIST = path.join(EXTENSION_ROOT, 'dist')
const SWARM_EXTENSION_PATH = path.join(EXTENSION_ROOT, 'swarm-extension/dist')

export default async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container in github CI environment
    headless: false,
    dumpio: true,
    args: [
      `--no-sandbox`, //Required for this to work in github CI environment
      `--disable-extensions-except=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
    ],
  })

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
