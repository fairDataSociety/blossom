import { Swarm } from '@ethersphere/swarm-extension'

const SWARM_EXTENSION_GOOGLE_ID = 'afpgelfcknfbbfnipnomfdbbnbbemnia'

/**
 * Helper class that abstracts communication with the Swarm extension
 */
export class SwarmExtension {
  private swarm: Swarm = null

  constructor(extensionId = SWARM_EXTENSION_GOOGLE_ID) {
    this.swarm = new Swarm(extensionId)
  }

  public async register(): Promise<string> {
    await this.swarm.register()

    return this.swarm.sessionId
  }

  public bzzProtocolToFakeUrl(url: string, newPage: boolean): string {
    return this.swarm.bzzLink.bzzLinkUrlToFakeUrl(url, this.swarm.sessionId, newPage)
  }

  public handleBzzLinkUrlToFakeUrl(bzzLinkUrl: string, newPage: boolean): string {
    return this.swarm.bzzLink.bzzProtocolToFakeUrl(bzzLinkUrl, this.swarm.sessionId, newPage)
  }

  public urlToFakeUrl(url: string, newPage: boolean): string {
    return this.swarm.bzzLink.urlToFakeUrl(url, this.swarm.sessionId, newPage)
  }

  public fakeBeeApiAddress(): string {
    return this.swarm.web2Helper.fakeBeeApiAddress()
  }

  public fakeBzzAddress(reference: string): string {
    return this.swarm.web2Helper.fakeBzzAddress(reference)
  }

  public beeAddress(): Promise<{ beeApiUrl: string; beeDebugApiUrl: string }> {
    return this.swarm.web2Helper.beeApiUrls()
  }
}
