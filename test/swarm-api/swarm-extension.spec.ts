import { sendSwarmExtensionMessage } from '../../src/swarm-api/swarm-utils'
import { SwarmExtension } from '../../src/swarm-api/swarm-extension'

jest.mock('../../src/swarm-api/swarm-utils', () => ({
  sendSwarmExtensionMessage: jest.fn(() => Promise.resolve()),
}))

describe('SwarmExtension class tests', () => {
  let swarmExtensionId = 'swarm-extension-id'
  let swarmExtension: SwarmExtension = null

  beforeAll(() => {
    swarmExtension = new SwarmExtension(swarmExtensionId)
  })

  test('register method test', async () => {
    await swarmExtension.register()
    expect(sendSwarmExtensionMessage).toHaveBeenCalledWith(swarmExtensionId, 'register')
  })

  describe('Methods that use sessionId', () => {
    const sessionId = 'session-id'
    const url = 'http://example.com'
    const bzzLinkUrl = 'bzz://example.com'
    const newPage = true

    beforeAll(async () => {
      ;(sendSwarmExtensionMessage as jest.Mock).mockReturnValueOnce(Promise.resolve(sessionId))
      await swarmExtension.register()
    })

    beforeEach(() => {
      ;(sendSwarmExtensionMessage as jest.Mock).mockClear()
    })

    const assertSendSwarmExtensionMessageParameters = (action: string, parametersObject?: unknown) => {
      if (parametersObject) {
        expect(sendSwarmExtensionMessage).toHaveBeenCalledWith(
          swarmExtensionId,
          action,
          sessionId,
          parametersObject,
        )
      } else {
        expect(sendSwarmExtensionMessage).toHaveBeenCalledWith(swarmExtensionId, action, sessionId)
      }
    }

    test('bzzProtocolToFakeUrl method test', async () => {
      await swarmExtension.bzzProtocolToFakeUrl(url, newPage)
      assertSendSwarmExtensionMessageParameters('bzzLink.bzzProtocolToFakeUrl', { url, newPage })
    })

    test('bzzProtocolToFakeUrl method test', async () => {
      await swarmExtension.handleBzzLinkUrlToFakeUrl(bzzLinkUrl, newPage)
      assertSendSwarmExtensionMessageParameters('bzzLink.bzzLinkUrlToFakeUrl', { bzzLinkUrl, newPage })
    })

    test('bzzProtocolToFakeUrl method test', async () => {
      await swarmExtension.urlToFakeUrl(url, newPage)
      assertSendSwarmExtensionMessageParameters('bzzLink.urlToFakeUrl', { url, newPage })
    })

    test('bzzProtocolToFakeUrl method test', async () => {
      await swarmExtension.fakeBeeApiAddress()
      assertSendSwarmExtensionMessageParameters('web2Helper.fakeBeeApiAddress')
    })

    test('bzzProtocolToFakeUrl method test', async () => {
      const reference = 'reference'
      await swarmExtension.fakeBzzAddress(reference)
      assertSendSwarmExtensionMessageParameters('web2Helper.fakeBzzAddress', { reference })
    })

    test('bzzProtocolToFakeUrl method test', async () => {
      await swarmExtension.beeAddress()
      assertSendSwarmExtensionMessageParameters('web2Helper.beeAddress')
    })
  })
})
