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
    await page.goto(getPageUrl('echo', blossomId))
    await page.click('#echo-btn')
    expect(await waitForElementText(page, '#echo')).toBe('Echo message')
  })
})
