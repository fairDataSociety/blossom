import { getExtensionId } from './utils/extension.util'

describe('Swarm extension API tests', () => {
  let swarmExtensionId: string = null

  beforeAll(async () => {
    try {
      swarmExtensionId = await getExtensionId('Swarm')

      if (!swarmExtensionId) {
        throw new Error('Missing the Swarm extension ID')
      }
    } catch (error) {
      throw new Error('Cannot find the Swarm extension: ' + error)
    }
  })

  it('Test extension present', async () => {
    const extensionId = await getExtensionId('Blossom')

    expect(extensionId).toBeTruthy()
  })
})
