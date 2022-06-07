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

  test('Registration should be successfull', async () => {
    await page.goto(getPageUrl('registration', blossomId))
    await page.click('#register-btn')
    expect(await waitForElementText(page, '#registration')).toBe('success')
  })
})
