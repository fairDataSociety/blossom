export function sendExtensionMessage<Response>(
  extensionId: string,
  data?: unknown
): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, data, (response: Response) => {
      const { lastError } = chrome.runtime;

      if (lastError) {
        return reject(new Error(lastError.message));
      }

      resolve(response);
    });
  });
}
