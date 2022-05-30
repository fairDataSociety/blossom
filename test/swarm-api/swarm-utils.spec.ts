import { sendSwarmExtensionMessage } from '../../src/swarm-api/swarm-utils'
import { sendExtensionMessage } from '../../src/messaging/e2e.messaging'

jest.mock('../../src/messaging/e2e.messaging', () => ({
  sendExtensionMessage: jest.fn(),
}))

describe('sendSwarmExtensionMessage tests', () => {
  test('sendSwarmExtensionMessage function should properly extract data', async () => {
    const data = 'response data'

    ;(sendExtensionMessage as jest.Mock).mockReturnValueOnce(Promise.resolve({ data }))

    const response = await sendSwarmExtensionMessage('random-extension-id', 'random-action')

    expect(response).toEqual(data)
  })

  test('sendSwarmExtensionMessage function should reject promise on returned error', async () => {
    const error = 'Random error'
    ;(sendExtensionMessage as jest.Mock).mockReturnValueOnce(Promise.resolve({ error }))

    try {
      await sendSwarmExtensionMessage('random-extension-id', 'random-action')
    } catch (err) {
      expect(err).toEqual(new Error(error))
    }
  })

  test('sendSwarmExtensionMessage function should reject promise on error', async () => {
    const error = 'Random error'
    ;(sendExtensionMessage as jest.Mock).mockReturnValueOnce(Promise.reject(new Error(error)))

    try {
      await sendSwarmExtensionMessage('random-extension-id', 'random-action')
    } catch (err) {
      expect(err).toEqual(new Error(error))
    }
  })
})
