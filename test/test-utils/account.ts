import { Wallet } from 'ethers'
import { ElementHandle, Page } from 'puppeteer'
import { PRIVATE_KEY } from '../config/constants'
import { sendFunds } from './ethers'
import { openExtensionOptionsPage, setSwarmExtensionId } from './extension.util'
import { click, dataTestId, getElementByTestId, getElementChildren, waitForElementTextByTestId } from './page'

const blossomId = global.__BLOSSOM_ID__

export function extractTextFromSpan(wordElement: ElementHandle<Element>): Promise<string> {
  return wordElement.$eval('span', (e) => e.innerHTML)
}

export function extractTextFromSpanArray(wordElements: ElementHandle<Element>[]): Promise<string[]> {
  return Promise.all(wordElements.map((element) => extractTextFromSpan(element)))
}

export async function getMnemonic(page: Page): Promise<string[]> {
  const mnemonicElement = await getElementByTestId(page, 'mnemonic')

  const wordElements = await getElementChildren(mnemonicElement)

  return extractTextFromSpanArray(wordElements)
}

export async function getMnemonicConfirmationElements(
  page: Page,
  mnemonic: string[],
): Promise<ElementHandle<Element>[]> {
  const wordElements = await getElementChildren(await getElementByTestId(page, 'mnemonic-confirmation'))

  const words = await extractTextFromSpanArray(wordElements)

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

export async function fillUsernamePasswordForm(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  const usernameInput = await getElementByTestId(page, 'username')

  await usernameInput.click()
  await usernameInput.type(username)

  const passwordInput = await getElementByTestId(page, 'password')

  await passwordInput.click()
  await passwordInput.type(password)
  await (await getElementByTestId(page, 'submit')).click()
}

export async function login(username: string, password: string): Promise<void> {
  await setSwarmExtensionId()

  const page = await openExtensionOptionsPage(blossomId, 'auth.html')

  await click(page, 'login')

  await fillUsernamePasswordForm(page, username, password)

  await page.close()
}

export async function logout(): Promise<void> {
  const page = await openExtensionOptionsPage(blossomId, 'settings.html')

  await click(page, 'logout-btn')

  await getElementByTestId(page, 'settings-registration-login-button')
}

export async function registerExisting(username: string, password: string, mnemonic: string): Promise<void> {
  await setSwarmExtensionId()

  const wallet = Wallet.fromMnemonic(mnemonic)

  await sendFunds(PRIVATE_KEY, wallet.address, '0.1')

  const page = await openExtensionOptionsPage(blossomId, 'auth.html')

  await click(page, 'register')

  await fillUsernamePasswordForm(page, username, password)

  await click(page, 'existing-account')

  const mnemonicInput = await getElementByTestId(page, 'mnemonic-input')

  await mnemonicInput.click()
  await mnemonicInput.type(mnemonic)

  await click(page, 'submit')

  await waitForElementTextByTestId(page, 'complete')

  console.log(`Created user ${username}/${password}`)

  await page.close()
}

export async function register(username: string, password: string): Promise<void> {
  await setSwarmExtensionId()

  const page = await openExtensionOptionsPage(blossomId, 'auth.html')

  await click(page, 'register')

  await fillUsernamePasswordForm(page, username, password)

  await click(page, 'register-new')

  await page.waitForSelector(dataTestId('mnemonic'))

  const mnemonic = await getMnemonic(page)

  await click(page, 'submit')

  const rightOrderWordElements = await getMnemonicConfirmationElements(page, mnemonic)

  await rightOrderWordElements.reduce(async (prevPromise, element) => {
    await prevPromise

    return await element.click()
  }, Promise.resolve())

  await click(page, 'submit')

  const account = await waitForElementTextByTestId(page, 'account')

  await sendFunds(PRIVATE_KEY, account, '0.1')

  await waitForElementTextByTestId(page, 'complete')

  await page.close()
}

export function getWalletAddress(page: Page): Promise<string> {
  return waitForElementTextByTestId(page, 'address')
}
