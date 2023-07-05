import { ElementHandle, Page } from 'puppeteer'

export async function openPage(url: string): Promise<Page> {
  const page = await global.__BROWSER__.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle0',
  })

  return page
}

export async function waitForElementText(page: Page, selector: string): Promise<string> {
  await page.waitForSelector(selector)

  return await page.$eval(selector, (e) => e.innerHTML)
}

export function waitForElementTextByTestId(page: Page, id: string): Promise<string> {
  return waitForElementText(page, dataTestId(id))
}

export async function getElementBySelector(page: Page, selector: string): Promise<ElementHandle<Element>> {
  await page.waitForSelector(selector)
  const element = await page.$(selector)

  if (!element) throw new Error(`Element with selector ${selector} has been not found`)

  return element
}

export function dataTestId(id: string): string {
  return `[data-testid="${id}"]`
}

export function getElementByTestId(page: Page, id: string): Promise<ElementHandle<Element>> {
  return getElementBySelector(page, dataTestId(id))
}

export function getElementChildren(element: ElementHandle<Element>): Promise<ElementHandle<Element>[]> {
  return element.$$(':scope > *')
}

export async function isElementDisabled(page: Page, id: string): Promise<boolean> {
  return (await page.$(`${dataTestId(id)}[disabled]`)) !== null
}

export async function typeToInput(page: Page, inputTestId: string, text: string): Promise<void> {
  const inputElement = await getElementByTestId(page, inputTestId)
  await inputElement.click({ clickCount: 3 })
  await inputElement.type(text)
}

export async function getTextFromInput(page: Page, id: string): Promise<string> {
  const input = await getElementByTestId(page, id)

  return page.evaluate((e) => e.value, await input.$('input'))
}

export async function click(page: Page, id: string): Promise<void> {
  return (await getElementByTestId(page, id)).click()
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function getPageByTitle(title: string): Promise<Page> {
  const pages = await global.__BROWSER__.pages()

  const pageTitles = await Promise.all(pages.map((page) => page.title()))

  const blossomPageIndex = pageTitles.findIndex((pageTitle) => pageTitle === title)

  return pages[blossomPageIndex]
}

export async function getNetworkElementsFromSelect(page: Page): Promise<ElementHandle<Element>[]> {
  await (await (await getElementByTestId(page, 'network-select')).$('fieldset')).click()

  await wait(500)

  return getElementChildren(await (await getElementBySelector(page, '#menu-')).$('ul'))
}
