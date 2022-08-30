import { ElementHandle, Page } from 'puppeteer'
import { openExtensionOptionsPage, setSwarmExtensionId } from './test-utils/extension.util'
import {
  click,
  getElementByTestId,
  getElementChildren,
  getTextFromInput,
  typeToInput,
} from './test-utils/page'

const blossomId: string = global.__BLOSSOM_ID__
const ensRegistryAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab'
const subdomainRegistrarAddress = '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb'
const publicResolverAddress = '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24'

function extractLabelFromNetworkElement(networkElement: ElementHandle<Element>): Promise<string> {
  return networkElement.$eval('.MuiListItemText-root > span', (e) => e.innerHTML)
}

async function getNetworkElements(page): Promise<ElementHandle<Element>[]> {
  return getElementChildren(await getElementByTestId(page, 'network-list'))
}

describe('Settings page tests', () => {
  let page: Page
  let defaultNetworkCount: number

  beforeAll(async () => {
    await setSwarmExtensionId()
    page = await openExtensionOptionsPage(blossomId, 'settings.html')
  })

  afterAll(async () => {
    await page.close()
  })

  test('Should add a new network', async () => {
    await (await getElementByTestId(page, 'settings-network-button')).click()

    let networkElements = await getNetworkElements(page)

    defaultNetworkCount = networkElements.length

    await click(page, 'add-network-button')

    const label = 'Testnet'
    const rpc = 'http://example.com'

    await typeToInput(page, 'label', label)
    await typeToInput(page, 'rpc', rpc)

    await click(page, 'save-network-button')

    networkElements = await getNetworkElements(page)

    expect(networkElements.length).toEqual(defaultNetworkCount + 1)

    expect(await extractLabelFromNetworkElement(networkElements[networkElements.length - 1])).toEqual(label)
  })

  test('Should successfully update the new network', async () => {
    let networkElements = await getNetworkElements(page)

    await networkElements[networkElements.length - 1].click()

    await click(page, 'show-contract-addresses-checkbox')

    await typeToInput(page, 'ens-registry-input', ensRegistryAddress)
    await typeToInput(page, 'subdomain-registrar-input', subdomainRegistrarAddress)
    await typeToInput(page, 'public-resolver-input', publicResolverAddress)

    const newLabel = 'Testnet1'

    await typeToInput(page, 'label', newLabel)

    await click(page, 'save-network-button')

    networkElements = await getNetworkElements(page)

    expect(networkElements.length).toEqual(defaultNetworkCount + 1)

    expect(await extractLabelFromNetworkElement(networkElements[networkElements.length - 1])).toEqual(
      newLabel,
    )

    await networkElements[networkElements.length - 1].click()

    await click(page, 'show-contract-addresses-checkbox')

    expect(await getTextFromInput(page, 'ens-registry-input')).toEqual(ensRegistryAddress)
    expect(await getTextFromInput(page, 'subdomain-registrar-input')).toEqual(subdomainRegistrarAddress)
    expect(await getTextFromInput(page, 'public-resolver-input')).toEqual(publicResolverAddress)

    await click(page, 'save-network-button')
  })

  test('Should delete the previously created network', async () => {
    let networkElements = await getNetworkElements(page)

    await networkElements[networkElements.length - 1].click()

    await click(page, 'delete-network-button')

    networkElements = await getNetworkElements(page)

    expect(networkElements.length).toEqual(defaultNetworkCount)
  })
})
