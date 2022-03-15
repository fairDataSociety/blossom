export function openTab(url: string): Promise<chrome.tabs.Tab> {
  return chrome.tabs.create({ url })
}
