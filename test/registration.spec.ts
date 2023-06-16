import { Page } from 'puppeteer'
import { PRIVATE_KEY } from './config/constants'
import {
  extractTextFromSpan,
  fillUsernamePasswordForm,
  getMnemonic,
  getMnemonicConfirmationElements,
  logout,
} from './test-utils/account'
import { sendFunds } from './test-utils/ethers'
import { openExtensionOptionsPage, setSwarmExtensionId } from './test-utils/extension.util'
import {
  click,
  dataTestId,
  getElementByTestId,
  isElementDisabled,
  wait,
  waitForElementText,
  waitForElementTextByTestId,
} from './test-utils/page'

async function assertUserLogin(username: string): Promise<void> {
  const settingsPage = await openExtensionOptionsPage(blossomId, 'settings.html')

  expect(await extractTextFromSpan(await getElementByTestId(settingsPage, 'user-info'))).toEqual(username)
}

const blossomId: string = global.__BLOSSOM_ID__
const username = 'testuser'
const password = 'pass12345'
let mnemonic: string[]

describe('Successful registration tests', () => {
  let page: Page

  beforeAll(async () => {
    await setSwarmExtensionId()
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test('The Username/Password form should accept new account', async () => {
    await click(page, 'register')

    await fillUsernamePasswordForm(page, username, password)

    await click(page, 'register-new')

    expect(await page.waitForSelector(dataTestId('mnemonic'))).toBeTruthy()
  })

  test('Should prevent next steps if mnemonic is not correct and continue if the order is correct', async () => {
    mnemonic = await getMnemonic(page)
    await click(page, 'submit')

    const rightOrderWordElements = await getMnemonicConfirmationElements(page, mnemonic)

    await rightOrderWordElements.slice(0, 10).reduce(async (prevPromise, element) => {
      await prevPromise

      return await element.click()
    }, Promise.resolve())

    expect(await isElementDisabled(page, 'submit')).toBeTruthy()

    await rightOrderWordElements[11].click()
    await rightOrderWordElements[10].click()

    expect(await isElementDisabled(page, 'submit')).toBeTruthy()

    await rightOrderWordElements[11].click()
    await page.waitForTimeout(50)
    await rightOrderWordElements[10].click()
    await rightOrderWordElements[11].click()

    expect(await isElementDisabled(page, 'submit')).toBeFalsy()
    await click(page, 'submit')
  })

  test('Should proceed after successful payment', async () => {
    const account = await waitForElementTextByTestId(page, 'account')

    await sendFunds(PRIVATE_KEY, account, '0.1')

    expect(await waitForElementTextByTestId(page, 'complete')).toBeTruthy()

    await assertUserLogin(username)
  })
})

describe('Unsuccessful registration tests', () => {
  let page: Page

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test("Shouldn't proceed with existing username", async () => {
    await click(page, 'register')

    await fillUsernamePasswordForm(page, username, password)

    expect(await waitForElementText(page, `${dataTestId('username')} > p`)).toEqual(
      'Username is not available',
    )
  })
})

describe('Registration with an existing account', () => {
  let page: Page
  const username = 'testuser2'

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await logout()
    await page.close()
  })

  test('Should successfully register with previously created account', async () => {
    await click(page, 'register')

    await fillUsernamePasswordForm(page, username, password)

    await click(page, 'existing-account')

    const mnemonicInput = await getElementByTestId(page, 'mnemonic-input')

    await mnemonicInput.click()
    await mnemonicInput.type(mnemonic.join(' '))

    await click(page, 'submit')

    expect(await waitForElementTextByTestId(page, 'complete')).toBeTruthy()

    await assertUserLogin(username)
  })
})

describe('Login tests', () => {
  let page: Page

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    if (!page.isClosed()) {
      await page.close()
    }
  })

  test("Shouldn't login with wrong password", async () => {
    await click(page, 'login')

    await fillUsernamePasswordForm(page, username, 'wrongPassword')

    expect(await waitForElementTextByTestId(page, 'error-message')).toEqual('Invalid password.')
  })

  test('Should login with valid credentials', async () => {
    await page.reload()

    await fillUsernamePasswordForm(page, username, password)

    await wait(500)

    await assertUserLogin(username)

    expect(page.isClosed()).toBeTruthy()
  })

  test('Should successfully logout', async () => {
    const settingsPage = await openExtensionOptionsPage(blossomId, 'settings.html')

    await click(settingsPage, 'logout-btn')

    expect(await getElementByTestId(settingsPage, 'settings-registration-login-button')).toBeTruthy()
  })
})
