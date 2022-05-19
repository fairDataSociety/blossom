import { BlossomMessages } from './blossom-messages'

export class E2EBlossomMessages implements BlossomMessages {
  constructor(private extensionId: string) {}

  public sendMessge<Response>(action: string, parameters?: unknown): Promise<Response> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        this.extensionId,
        { action, data: parameters },
        (response: { error: Error | string; data: Response }) => {
          const { lastError } = chrome.runtime

          if (lastError) {
            return reject(new Error(lastError.message))
          }

          const { data, error } = response

          if (error) {
            return reject(error)
          }

          resolve(data)
        },
      )
    })
  }
}
