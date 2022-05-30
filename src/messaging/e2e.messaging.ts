/**
 * Generic function for communication with other extensions
 * @param extensionId ID of the extension that should receive the message
 * @param data Arbitrary data
 * @returns Promise which rejects if there was an error while sending the message, otherwise resolves with response
 */
export function sendExtensionMessage<Response>(extensionId: string, data: unknown): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, data, (response: Response) => {
      const { lastError } = chrome.runtime

      if (lastError) {
        return reject(new Error(lastError.message))
      }

      resolve(response)
    })
  })
}
