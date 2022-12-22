import { migrate } from './storage/storage-migration'

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'update' && process.env.ENVIRONMENT !== 'development') {
    migrate(chrome.runtime.getManifest().version)
    console.log(`Updated to new version`)
  }
})
