import { ElementHandle, Page } from 'puppeteer'
import { sendFunds } from './utils/ethers'
import { openExtensionOptionsPage } from './utils/extension.util'
import {
  dataTestId,
  getElementByTestId,
  getElementChildren,
  isElementDisabled,
  waitForElementText,
  waitForElementTextByTestId,
} from './utils/page'

function extractTextFromSpan(wordElement: ElementHandle<Element>): Promise<string> {
  return wordElement.$eval('span', (e) => e.innerHTML)
}

function extractMnemonic(wordElements: ElementHandle<Element>[]): Promise<string[]> {
  return Promise.all(wordElements.map((element) => extractTextFromSpan(element)))
}

async function getMnemonic(page: Page): Promise<string[]> {
  const mnemonicElement = await getElementByTestId(page, 'mnemonic')

  const wordElements = await getElementChildren(mnemonicElement)

  return extractMnemonic(wordElements)
}

async function getMnemonicConfirmationElements(
  page: Page,
  mnemonic: string[],
): Promise<ElementHandle<Element>[]> {
  const wordElements = await getElementChildren(await getElementByTestId(page, 'mnemonic-confirmation'))

  const words = await extractMnemonic(wordElements)

  return mnemonic.map((word, index) => {
    let occurrence = 0

    for (let i = 0; i <= index; i++) {
      if (mnemonic[i] === word) {
        occurrence += 1
      }
    }

    const wordIndex = words.findIndex((currentWord) => currentWord === word && --occurrence === 0)

    return wordElements[wordIndex]
  })
}

async function fillUsernamePasswordForm(page: Page, username: string, password: string): Promise<void> {
  const usernameInput = await getElementByTestId(page, 'username')

  await usernameInput.click()
  await usernameInput.type(username)

  const passwordInput = await getElementByTestId(page, 'password')

  await passwordInput.click()
  await passwordInput.type(password)
  await (await getElementByTestId(page, 'submit')).click()
}

const blossomId: string = global.__BLOSSOM_ID__
const username = 'test_user'
const password = 'pass123'
let mnemonic: string[]

describe('Successful registration tests', () => {
  let page: Page
  const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test('The Username/Password form should accept new account', async () => {
    await (await getElementByTestId(page, 'register')).click()

    await fillUsernamePasswordForm(page, username, password)

    await (await getElementByTestId(page, 'register-new')).click()

    expect(await page.waitForSelector(dataTestId('mnemonic'))).toBeTruthy()
  })

  test('Should prevent next steps if mnemonic is not correct and continue if the order is correct', async () => {
    mnemonic = await getMnemonic(page)
    await (await getElementByTestId(page, 'submit')).click()

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
    await rightOrderWordElements[10].click()
    await page.waitForTimeout(50)
    await rightOrderWordElements[10].click()
    await rightOrderWordElements[11].click()

    expect(await isElementDisabled(page, 'submit')).toBeFalsy()
    await (await getElementByTestId(page, 'submit')).click()
  })

  test('Should proceed after successful payment', async () => {
    const account = await waitForElementTextByTestId(page, 'account')

    await sendFunds(privateKey, account, '0.1')

    expect(await waitForElementTextByTestId(page, 'complete')).toBeTruthy()
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
    await (await getElementByTestId(page, 'register')).click()

    await fillUsernamePasswordForm(page, username, password)

    expect(await waitForElementText(page, `${dataTestId('username')} > p`)).toEqual(
      'Username is not available',
    )
  })
})

describe('Registration with an existing account', () => {
  let page: Page
  const username = 'test_user_2'

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test('Should successfully register with previously created account', async () => {
    await (await getElementByTestId(page, 'register')).click()

    await fillUsernamePasswordForm(page, username, password)

    await (await getElementByTestId(page, 'existing-account')).click()

    const mnemonicInput = await getElementByTestId(page, 'mnemonic-input')

    await mnemonicInput.click()
    await mnemonicInput.type(mnemonic.join(' '))

    await (await getElementByTestId(page, 'submit')).click()

    expect(await waitForElementTextByTestId(page, 'complete')).toBeTruthy()
  })
})

describe('Login tests', () => {
  let page: Page

  beforeAll(async () => {
    page = await openExtensionOptionsPage(blossomId, 'auth.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test("Shouldn't login with wrong password", async () => {
    await (await getElementByTestId(page, 'login')).click()

    await fillUsernamePasswordForm(page, username, 'wrongPassword')

    expect(await waitForElementTextByTestId(page, 'error-message')).toEqual('Invalid password.')
  })

  test('Should login with valid credentials', async () => {
    await page.reload()
    await fillUsernamePasswordForm(page, username, password)

    // TODO check if successful when the feature gets completed
  })
})
