import { sendSwarmExtensionMessage } from './swarm-utils'

const SWARM_EXTENSION_GOOGLE_ID = 'afpgelfcknfbbfnipnomfdbbnbbemnia'

/**
 * Helper class that abstracts communication with the Swarm extension
 */
export class SwarmExtension {
  private sessionId: string = null

  constructor(private extensionId = SWARM_EXTENSION_GOOGLE_ID) {}

  public async register(): Promise<string> {
    return (this.sessionId = await sendSwarmExtensionMessage<string>(this.extensionId, 'register'))
  }

  public bzzProtocolToFakeUrl(url: string, newPage: boolean): Promise<string> {
    return sendSwarmExtensionMessage<string>(
      this.extensionId,
      'bzzLink.bzzProtocolToFakeUrl',
      this.sessionId,
      { url, newPage },
    )
  }

  public handleBzzLinkUrlToFakeUrl(bzzLinkUrl: string, newPage: boolean): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'bzzLink.bzzLinkUrlToFakeUrl', this.sessionId, {
      bzzLinkUrl,
      newPage,
    })
  }

  public urlToFakeUrl(url: string, newPage: boolean): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'bzzLink.urlToFakeUrl', this.sessionId, {
      url,
      newPage,
    })
  }

  public fakeBeeApiAddress(): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'web2Helper.fakeBeeApiAddress', this.sessionId)
  }

  public fakeBzzAddress(reference: string): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'web2Helper.fakeBzzAddress', this.sessionId, {
      reference,
    })
  }

  public beeAddress(): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'web2Helper.beeAddress', this.sessionId)
  }
}
