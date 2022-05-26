import { Browser } from 'puppeteer'

export async function getExtensionId(browser: Browser, extensionName: string): Promise<string> {
  const page = await browser.newPage()
  const targets = await browser.targets()
  const extensionTarget = targets.find(target => target.type() === 'service_worker')
  const partialExtensionUrl = (extensionTarget as any)._targetInfo.url || ''
  const [, , extensionId] = partialExtensionUrl.split('/')
  await page.close()
  return extensionId
}
