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

  page.close()

  return extensionId
}
