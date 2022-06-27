import { Page } from 'puppeteer'

export async function waitForElementText(page: Page, elementId: string): Promise<string> {
  await page.waitForSelector(elementId)

  return await page.$eval(elementId, e => e.innerHTML)
}
