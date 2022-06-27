import { Browser } from 'puppeteer'
import { TEST_SERVER_URL } from '../config/constants'

export async function getExtensionId(browser: Browser): Promise<string> {
  const page = await browser.newPage()
  await page.goto(TEST_SERVER_URL, { waitUntil: 'load' })
  const targets = await browser.targets()
  const extensionTarget = targets.find(target => target.type() === 'service_worker')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partialExtensionUrl = (extensionTarget as any)._targetInfo.url || ''
  const [, , extensionId] = partialExtensionUrl.split('/')
  await page.close()

  return extensionId
}
