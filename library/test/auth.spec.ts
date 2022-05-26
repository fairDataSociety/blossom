import { Page } from 'puppeteer'
import { getPageUrl } from './utils/url'

describe('Blossom authentication tests', () => {
  let page: Page
  let blossomId: string

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    blossomId = global.__BLOSSOM_ID__
  })

  test('Registration should be successfull', async () => {
    await page.goto(getPageUrl('registration', blossomId))
    await page.click('#register-btn')
    const placeHolderSelector = '#registration'
    await page.waitForSelector(placeHolderSelector)
    const value = await page.$eval(placeHolderSelector, e => e.innerHTML)
    expect(value).toBe('success')
  })
})
