import { Bee } from '@ethersphere/bee-js'
import { SwarmExtension } from './swarm-api/swarm-extension'
;(async () => {
  try {
    const swarmExtension = new SwarmExtension(process.env.SWARM_EXTENSION_ID)

    await swarmExtension.register()

    chrome.runtime.onMessage.addListener((message: string, sender, sendResponse) => {
      swarmExtension.fakeBzzAddress(message).then(sendResponse).catch(console.warn)

      return true
    })

    const beeAddress = await swarmExtension.beeAddress()

    const bee = new Bee(beeAddress)

    await bee.checkConnection()

    console.log('Initialization completed')
  } catch (error) {
    console.warn(error)
  }
})()
