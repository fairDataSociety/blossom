import { Page } from 'puppeteer'
import { getElementByTestId, typeToInput } from './page'

export async function getExtensionId(extensionName: string): Promise<string> {
  const page = await global.__BROWSER__.newPage()
  await page.goto('chrome://extensions', { waitUntil: 'networkidle0' })

  await page.waitForSelector('extensions-manager')

  const extensionId = await page.evaluate((extensionName) => {
    const extensionsManager = document.querySelector('extensions-manager')
    const extensionsItemList = extensionsManager!.shadowRoot!.querySelector('extensions-item-list')
    const extensionsItem = extensionsItemList!.shadowRoot!.querySelectorAll('extensions-item')
    const exteinsionItems = Array.from(extensionsItem.entries())

    const ids = exteinsionItems
      .filter(
        ([index, item]) =>
          item.shadowRoot
            .querySelector('#name-and-version')
            .textContent.toLowerCase()
            .indexOf(extensionName.toLowerCase()) > -1,
      )
      .map(([index, item]) => item.id)

    return ids[0]
  }, extensionName)

  await page.close()

  return extensionId
}

export async function openExtensionOptionsPage(extensionId: string, page: string): Promise<Page> {
  const extensionPage = await global.__BROWSER__.newPage()
  await extensionPage.goto(`chrome-extension://${extensionId}/${page}`, {
    waitUntil: 'networkidle0',
  })

  return extensionPage
}

export async function setSwarmExtensionId(): Promise<void> {
  const settingsPage = await openExtensionOptionsPage(global.__BLOSSOM_ID__, 'settings.html')

  await (await getElementByTestId(settingsPage, 'settings-button')).click()

  await (await getElementByTestId(settingsPage, 'settings-swarm-button')).click()

  await typeToInput(settingsPage, 'swarm-extension-id-input', global.__SWARM_ID__)

  await (await getElementByTestId(settingsPage, 'swarm-extension-id-submit')).click()

  await getElementByTestId(settingsPage, 'settings-button')
  await settingsPage.close()
}

export function getRandomString(): string {
  return Math.random().toString().substring(2)
}
