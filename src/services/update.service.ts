import { SwarmExtension } from '../swarm-api/swarm-extension'
import { swarmFactory } from './storage/storage-factories'
import { migrate } from './storage/storage-migration'
import { Storage } from './storage/storage.service'

async function checkSwarmExtension() {
  try {
    const swarmExtension = new SwarmExtension(process.env.SWARM_EXTENSION_ID)
    await swarmExtension.beeAddress()
    const storage = new Storage()
    const swarm = swarmFactory()

    swarm.extensionEnabled = true

    await storage.setSwarm(swarm)
  } catch (error) {
    console.warn(error)
    // Ignore if Swarm extension is not installed
  }
}

chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    await checkSwarmExtension()
  }

  if (details.reason === 'update' && process.env.ENVIRONMENT !== 'development') {
    await migrate(chrome.runtime.getManifest().version)
    console.log(`Updated to new version`)
  }
})
