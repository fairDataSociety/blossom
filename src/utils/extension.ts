export function isInternalMessage(sender: chrome.runtime.MessageSender): boolean {
  return sender.url?.startsWith('chrome-extension://') && sender.id === chrome.runtime.id
}

export function isOtherExtension(sender: chrome.runtime.MessageSender): boolean {
  return Boolean(sender.id) && sender.id !== chrome.runtime.id
}

export function isSwarmExtensionError(error: string): boolean {
  return error.includes('Swarm extension') || error.includes('Invalid extension id')
}

export function setWarningBadge() {
  chrome.action.setBadgeBackgroundColor({ color: 'red' })
  chrome.action.setBadgeText({ text: '!' })
}

export function removeWarningBadge() {
  chrome.action.setBadgeText({ text: '' })
}
