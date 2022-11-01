import { Page } from 'puppeteer'
import { BEE_URL } from './config/constants'
import { login, logout, register } from './test-utils/account'
import { click, getPageByTitle, openPage, wait, waitForElementText } from './test-utils/page'

const FDP_STORAGE_PAGE_URL = `${BEE_URL}/bzz/${global.FDP_STORAGE_PAGE_REFERENCE}/`

describe('Dapp interaction with Blossom, using the library', () => {
  let page: Page
  const username = 'fdpuser'
  const password = 'pass12345'

  beforeAll(async () => {
    await register(username, password)
    await login(username, password)
    page = await openPage(FDP_STORAGE_PAGE_URL)
  })

  afterAll(async () => {
    await page.close()
    await logout()
  })

  describe('fdp-storage tests', () => {
    test('Should successfully create a pod', async () => {
      await click(page, 'create-pod-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      if (blossomPage) {
        // If confirmation page is not open then an error occurred. That error will be printed
        // in the next line
        await click(blossomPage, 'dialog-confirm-btn')
      }

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

  describe('Signer tests', () => {
    test('Should sign a message', async () => {
      await click(page, 'sign-message-btn')

      await wait(5000)

      const blossomPage = await getPageByTitle('Blossom')

      await click(blossomPage, 'dialog-confirm-btn')

      expect(await waitForElementText(page, '#sign-message[complete="true"]')).toEqual(
        '0x505649f8f878db2067138ab30401c6a5e34a4318de94ffc63aa27269e46f6be410641b5a9f22ba47dfbc606b687f9ea7fca46390daeee934e03ce47284bc8c471b',
      )
    })
  })
})
