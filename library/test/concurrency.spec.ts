import { Page } from 'puppeteer'
import { waitForElementText } from './utils/assert'
import { getPageUrl } from './utils/url'

describe('Blossom authentication tests', () => {
  let page: Page
  let blossomId: string

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    blossomId = global.__BLOSSOM_ID__
  })

  afterAll(async () => {
    await page.close()
  })

  test("Multiple instances of the Blossom class shouldn't interfere with each other", async () => {
    await page.goto(getPageUrl('multiple-instances', blossomId))
    await page.click('#start')
    const placeHolderSelector = '#response'
    expect(await waitForElementText(page, `${placeHolderSelector}1-1`)).toBe('Received')
    expect(await waitForElementText(page, `${placeHolderSelector}1-2`)).toBe('Received')
    expect(await waitForElementText(page, `${placeHolderSelector}1-3`)).toBe('Received')
    expect(await waitForElementText(page, `${placeHolderSelector}2-1`)).toBe('Received')
    expect(await waitForElementText(page, `${placeHolderSelector}2-2`)).toBe('Empty')
    expect(await waitForElementText(page, `${placeHolderSelector}2-3`)).toBe('Received')
  })
})
