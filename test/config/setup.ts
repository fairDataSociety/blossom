import puppeteer, { Browser } from 'puppeteer'
import path from 'path'
import { getExtensionId } from '../utils/extension.util'
import { createPostageBatch } from '../utils/bee'

const EXTENSION_ROOT = path.join(__dirname, '..', '..')
const EXTENSION_DIST = path.join(EXTENSION_ROOT, 'dist')
const SWARM_EXTENSION_PATH = path.join(EXTENSION_ROOT, 'swarm-extension/dist')

export default async () => {
  const [browser] = await Promise.all([
    puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container in github CI environment
      headless: false,
      args: [
        `--no-sandbox`, //Required for this to work in github CI environment
        `--disable-extensions-except=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_DIST},${SWARM_EXTENSION_PATH}`,
      ],
    }),
    process.env.CREATE_POSTAGE_BATCH === 'true'
      ? createPostageBatch(process.env.BEE_DEBUG_API_URL || 'http://localhost:1635')
      : Promise.resolve(),
  ])
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
