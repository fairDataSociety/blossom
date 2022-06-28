export function isInternalMessage(sender: chrome.runtime.MessageSender): boolean {
  return sender.url?.startsWith('chrome-extension://') && sender.id === chrome.runtime.id
}

export function isOtherExtension(sender: chrome.runtime.MessageSender): boolean {
  return Boolean(sender.id) && sender.id !== chrome.runtime.id
}
