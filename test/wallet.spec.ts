import { ElementHandle, Page } from 'puppeteer'
import { openExtensionOptionsPage } from './test-utils/extension.util'
import { login, registerExisting } from './test-utils/account'
import {
  click,
  dataTestId,
  getElementByTestId,
  getElementChildren,
  getNetworkElementsFromSelect,
  typeToInput,
  wait,
  waitForElementText,
  waitForElementTextByTestId,
} from './test-utils/page'
import { getRandomString } from './test-utils/extension.util'

const blossomId: string = global.__BLOSSOM_ID__

async function getTransactionHistoryElements(page): Promise<ElementHandle<Element>[]> {
  return getElementChildren(await getElementByTestId(page, 'transaction-history'))
}

describe('Wallet tests', () => {
  let page: Page
  const username = 'walletuser-' + getRandomString()
  const password = 'pass12345'
  const mnemonic = 'range text benefit adjust fresh daring noodle fish educate carbon walnut balance'

  const toAddress = '0x9BDc3DF70Db00Fdc745dA0FeAb9a70d153270244'
  let balance: number

  async function getBalance(): Promise<number> {
    return Number((await waitForElementText(page, dataTestId('balance'))).substring(0, 4))
  }

  async function addNetwork(): Promise<void> {
    const settingsPage = await openExtensionOptionsPage(blossomId, 'settings.html')

    await (await getElementByTestId(settingsPage, 'settings-button')).click()

    await (await getElementByTestId(settingsPage, 'settings-network-button')).click()

    await click(settingsPage, 'add-network-button')

    await typeToInput(settingsPage, 'label', 'FDP Play 2')
    await typeToInput(settingsPage, 'rpc', 'http://localhost:9545')

    await click(settingsPage, 'save-network-button')

    await settingsPage.close()
  }

  beforeAll(async () => {
    await registerExisting(username, password, mnemonic)
    await login(username, password)
    page = await openExtensionOptionsPage(blossomId, 'wallet.html')
    balance = await getBalance()
  })

  afterAll(async () => {
    await page.close()
  })

  test('Should successfully send a transaction', async () => {
    await (await getElementByTestId(page, 'send-button')).click()

    await typeToInput(page, 'address-input', toAddress.substring(0, toAddress.length - 2))

    await (await getElementByTestId(page, 'address-submit')).click()

    await typeToInput(page, 'address-input', toAddress)

    await (await getElementByTestId(page, 'address-submit')).click()

    await typeToInput(page, 'amount-input', '0.')

    await (await getElementByTestId(page, 'amount-submit')).click()

    await typeToInput(page, 'amount-input', '0.01')

    await (await getElementByTestId(page, 'amount-submit')).click()

    await waitForElementTextByTestId(page, 'send-button')

    await wait(1000)

    await (await getElementByTestId(page, 'send-button')).click()

    await wait(1000)

    expect(await waitForElementTextByTestId(page, 'transaction-complete-text')).toBeTruthy()

    await (await getElementByTestId(page, 'back-button')).click()
  })

  test('New transaction should appear in transaction list', async () => {
    const transactions = await getTransactionHistoryElements(page)

    expect(transactions.length).toEqual(1)
  })

  test('Balance should be updated', async () => {
    const newBalance = await getBalance()
    const balanceDifference = balance - newBalance

    expect(balanceDifference).toBeGreaterThan(0.009)
    expect(balanceDifference).toBeLessThan(0.011)
  })

  test('Transaction history should be kept separately for different networks', async () => {
    await addNetwork()

    await page.reload()

    await wait(1000)

    const networkElements = await getNetworkElementsFromSelect(page)

    await networkElements[networkElements.length - 1].click()

    await wait(1000)

    const transactions = await getTransactionHistoryElements(page)

    expect(transactions.length).toEqual(0)
  })
})
