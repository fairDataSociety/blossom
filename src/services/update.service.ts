import { Storage } from './storage/storage.service'

export class UpdateService {
  private storage: Storage = new Storage()

  constructor() {
    chrome.runtime.onInstalled.addListener(this.onInstalled.bind(this))
  }

  private onInstalled(details: chrome.runtime.InstalledDetails) {
    if (details.reason === 'update' && process.env.ENVIRONMENT !== 'development') {
      this.storage.migrate()
      console.log(`Updated to new version`)
    }
  }
}
