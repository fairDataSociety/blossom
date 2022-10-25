import { Page } from 'puppeteer'
import { BEE_URL } from './config/constants'
import { login, logout, register } from './test-utils/account'
import { click, openPage, wait, waitForElementText } from './test-utils/page'

const FDP_STORAGE_PAGE_URL = `${BEE_URL}/bzz/${global.FDP_STORAGE_PAGE_REFERENCE}/`

describe('Dapp interaction with Blossom, using the library', () => {
  let page: Page
  const username = 'fdpuser'
  const password = 'pass12345'

  describe('fdp-storage tests', () => {
    beforeAll(async () => {
      await register(username, password)
      await login(username, password)
      page = await openPage(FDP_STORAGE_PAGE_URL)
    })

    afterAll(async () => {
      await page.close()
      await logout()
    })

    test('Should successfully create a pod', async () => {
      await click(page, 'create-pod-btn')

      await wait(5000)

      const pages = await global.__BROWSER__.pages()

      const pageTitles = await Promise.all(pages.map((page) => page.title()))

      const blossomPageIndex = pageTitles.findIndex((title) => title === 'Blossom')

      const blossomPage = pages[blossomPageIndex]

      await click(blossomPage, 'dialog-confirm-btn')

      expect(await waitForElementText(page, '#create-pod[complete="true"]')).toEqual('success')
    })

    test('Pod should be created', async () => {
      await click(page, 'check-pod-btn')

      expect(await waitForElementText(page, '#pod-created[complete="true"]')).toEqual('true')
    })

    test('Should successfully create a directory', async () => {
      await click(page, 'create-directory-btn')

      expect(await waitForElementText(page, '#create-directory[complete="true"]')).toEqual('success')
    })

    test('Should successfully upload file', async () => {
      await click(page, 'upload-file-btn')

      expect(await waitForElementText(page, '#upload-file[complete="true"]')).toEqual('success')
    })

    test('Should successfully download file', async () => {
      await click(page, 'download-file-btn')

      expect(await waitForElementText(page, '#download-file[complete="true"]')).toEqual('success')
    })
  })
})
