import { sendExtensionMessage } from '../messaging/e2e.messaging';

async function sendSwarmExtensionMessage<Response>(
  extensionId: string,
  action: string,
  sessionId?: string,
  parameters?: unknown
): Promise<Response> {
  const { data, error } = await sendExtensionMessage<{
    data: Response;
    error: string;
  }>(extensionId, { action, sessionId, parameters });

  if (error) {
    throw new Error(error);
  }

  return data;
}

export class SwarmExtension {
  private sessionId: string = null;

  constructor(private extensionId: string) {}

  public async register(): Promise<string> {
    return (this.sessionId = await sendSwarmExtensionMessage<string>(
      this.extensionId,
      'register'
    ));
  }

  public bzzProtocolToFakeUrl(url: string, newPage: boolean): Promise<string> {
    return sendSwarmExtensionMessage<string>(
      this.extensionId,
      'bzzLink.bzzProtocolToFakeUrl',
      this.sessionId,
      { url, newPage }
    );
  }

  public handleBzzLinkUrlToFakeUrl(
    bzzLinkUrl: string,
    newPage: boolean
  ): Promise<string> {
    return sendSwarmExtensionMessage(
      this.extensionId,
      'bzzLink.bzzLinkUrlToFakeUrl',
      this.sessionId,
      { bzzLinkUrl, newPage }
    );
  }

  public urlToFakeUrl(url: string, newPage: boolean): Promise<string> {
    return sendSwarmExtensionMessage(
      this.extensionId,
      'bzzLink.urlToFakeUrl',
      this.sessionId,
      { url, newPage }
    );
  }

  public fakeBeeApiAddress(): Promise<string> {
    return sendSwarmExtensionMessage(
      this.extensionId,
      'web2Helper.fakeBeeApiAddress',
      this.sessionId
    );
  }

  public fakeBzzAddress(reference: string): Promise<string> {
    return sendSwarmExtensionMessage(
      this.extensionId,
      'web2Helper.fakeBzzAddress',
      this.sessionId,
      { reference }
    );
  }

  public beeAddress(): Promise<string> {
    return sendSwarmExtensionMessage(this.extensionId, 'web2Helper.beeAddress');
  }
}
